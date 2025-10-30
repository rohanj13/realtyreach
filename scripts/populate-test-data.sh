#!/bin/bash

###############################################################################
# RealtyReach Test Data Population Script
# 
# Populates test data into both Identity API and RealtyReach API databases
# after all services are running.
#
# Prerequisites:
#   - PostgreSQL running (docker-compose up)
#   - Identity API running (dotnet run on port 5209)
#   - RealtyReach API running (dotnet run on port 5073)
#
# Usage:
#   ./populate-test-data.sh              # Run with default test data
#   ./populate-test-data.sh --help       # Show help
#   ./populate-test-data.sh --clean      # Delete all test data only (no repopulation)
#
# What it creates:
#   - 6 Professional accounts (covering all types: Advocate, Broker, Conveyancer, BuildAndPest)
#   - 2 Customer accounts with 5 varied jobs each (10 jobs total)
#   - 1 Admin account
#   - All data synced between Identity API and RealtyReach API
#   - Jobs automatically matched with existing professionals by type
#
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# Configuration
IDENTITY_API_URL="http://localhost:5209"
REALTY_REACH_API_URL="http://localhost:5073"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Test users
declare -a CUSTOMERS=(
    "customer1@test.com:Test@123456:John:Smith"
    "customer2@test.com:Test@123456:Jane:Doe"
)

declare -a PROFESSIONALS=(
    "professional1@test.com:Test@123456:Michael:Johnson:Advocate"
    "professional2@test.com:Test@123456:Sarah:Williams:Broker"
    "professional3@test.com:Test@123456:David:Brown:Conveyancer"
    "professional4@test.com:Test@123456:Emma:Davis:BuildAndPest"
    "professional5@test.com:Test@123456:James:Wilson:Advocate"
    "professional6@test.com:Test@123456:Olivia:Martinez:Broker"
)

declare -a ADMINS=(
    "admin1@test.com:Test@123456:Admin:User"
)

# Utility functions
log_info() { echo -e "${BLUE}ℹ${NC} $*"; }
log_success() { echo -e "${GREEN}✓${NC} $*"; }
log_error() { echo -e "${RED}✗${NC} $*"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $*"; }
log_section() { echo -e "\n${BOLD}${BLUE}→ $*${NC}\n"; }

show_help() {
    cat << EOF
${BOLD}RealtyReach Test Data Population${NC}

${BOLD}USAGE:${NC}
    ./populate-test-data.sh [OPTIONS]

${BOLD}OPTIONS:${NC}
    --help              Show this help message
    --clean             Delete all test data from database (no repopulation)
    --verify            Check services are running (no data creation)

${BOLD}EXAMPLE:${NC}
    ./populate-test-data.sh

${BOLD}TEST DATA CREATED:${NC}
    • 2 customers (with 5 varied jobs each = 10 jobs total)
    • 6 professionals (covering all types: Advocate, Broker, Conveyancer, BuildAndPest)
    • 1 admin

${BOLD}REQUIRED SERVICES:${NC}
    PostgreSQL (port 5432) .... docker-compose up
    Identity API (port 5209) .. cd Identity.Api && dotnet run
    RealtyReach API (5073) .... cd RealtyReachApi && dotnet run

EOF
}

check_service() {
    local url=$1
    local name=$2
    if curl -s "$url/health" &>/dev/null || nc -z localhost ${url##*:} 2>/dev/null; then
        log_success "$name is running"
        return 0
    else
        log_error "$name is not running on ${url##*:}"
        return 1
    fi
}

verify_services() {
    log_section "Verifying Services"
    
    local all_ok=true
    
    check_service "http://localhost:5209" "Identity API" || all_ok=false
    check_service "http://localhost:5073" "RealtyReach API" || all_ok=false
    
    if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_success "PostgreSQL is running"
    else
        log_error "PostgreSQL is not running"
        all_ok=false
    fi
    
    if [ "$all_ok" = false ]; then
        log_error "Not all services are running. Start them first:"
        echo ""
        echo "Terminal 1: docker-compose up"
        echo "Terminal 2: cd Identity.Api && dotnet run"
        echo "Terminal 3: cd RealtyReachApi && dotnet run"
        return 1
    fi
    
    return 0
}

register_and_create_user() {
    local email=$1
    local password=$2
    local first_name=$3
    local last_name=$4
    local role=$5
    
    log_info "Processing: $email ($role)" >&2
    
    # Step 1: Try to register with Identity API
    local register_response=$(curl -s -w "\n%{http_code}" -X POST "$IDENTITY_API_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\",\"role\":\"$role\"}" 2>/dev/null)
    
    local register_code=$(echo "$register_response" | tail -n 1)
    local register_body=$(echo "$register_response" | sed '$d')
    
    local token=""
    
    # Extract token from response
    if echo "$register_body" | grep -q "token"; then
        token=$(echo "$register_body" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
        log_success "Registered with Identity API" >&2
    elif [ "$register_code" = "400" ]; then
        # User likely already exists, try login
        log_info "User exists, attempting login..." >&2
        local login_response=$(curl -s -w "\n%{http_code}" -X POST "$IDENTITY_API_URL/api/auth/login" \
            -H "Content-Type: application/json" \
            -d "{\"email\":\"$email\",\"password\":\"$password\"}" 2>/dev/null)
        
        local login_code=$(echo "$login_response" | tail -n 1)
        local login_body=$(echo "$login_response" | sed '$d')
        
        if echo "$login_body" | grep -q "token"; then
            token=$(echo "$login_body" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
            log_warning "Using existing account" >&2
        else
            log_error "Login failed (HTTP $login_code): $login_body" >&2
            return 1
        fi
    else
        log_error "Registration failed (HTTP $register_code): $register_body" >&2
        return 1
    fi
    
    if [ -z "$token" ]; then
        log_error "Failed to extract token for $email" >&2
        return 1
    fi
    
    # Step 2: Create user profile in RealtyReach API with FirstLogin=true
    local create_response=$(curl -s -w "\n%{http_code}" -X POST "$REALTY_REACH_API_URL/api/user" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" 2>/dev/null)
    
    local create_code=$(echo "$create_response" | tail -n 1)
    local create_body=$(echo "$create_response" | sed '$d')
    
    if [ "$create_code" = "200" ]; then
        log_success "User created in RealtyReach API" >&2
    elif [ "$create_code" = "400" ] || [ "$create_code" = "500" ]; then
        log_warning "User profile already exists (HTTP $create_code), will update instead" >&2
    else
        log_error "User creation failed (HTTP $create_code): $create_body" >&2
        return 1
    fi
    
    # Step 3: Update profile with FirstName, LastName, Email, and set FirstLogin=false
    # This completes the first login flow
    # Use different endpoints based on role
    if [ "$role" = "Professional" ]; then
        # Professionals use /api/professional endpoint (handled separately by update_professional function)
        log_success "Professional user ready for profile update" >&2
    elif [ "$role" = "Admin" ]; then
        # Admin accounts don't have profile update endpoint yet
        log_success "Admin account created (no profile update needed)" >&2
    else
        # Customers use /api/user endpoint
        local update_response=$(curl -s -w "\n%{http_code}" -X PUT "$REALTY_REACH_API_URL/api/user" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "{\"email\":\"$email\",\"firstName\":\"$first_name\",\"lastName\":\"$last_name\",\"firstLogin\":false}" 2>/dev/null)
        
        local update_code=$(echo "$update_response" | tail -n 1)
        local update_body=$(echo "$update_response" | sed '$d')
        
        if [ "$update_code" = "200" ]; then
            log_success "Profile updated (FirstName/LastName set, FirstLogin cleared)" >&2
        elif [ "$update_code" = "400" ]; then
            log_warning "Profile update returned 400 (may already exist), continuing..." >&2
        else
            log_error "Profile update failed (HTTP $update_code): $update_body" >&2
            return 1
        fi
    fi
    
    # Only output the token to stdout - all logging goes to stderr
    echo "$token"
}

create_sample_jobs() {
    local token=$1
    local count=$2
    
    # Define job templates with all required fields
    # Format: Title:JobType:JourneyProgress:Professionals:PropertyType:Regions:StatesNumeric:SpecialisationsNumeric
    # Professional Types: Advocate, Broker, Conveyancer, BuildAndPest
    # States: NSW=0, VIC=1, QLD=2, WA=3, SA=4, TAS=5, NT=6, ACT=7
    # Specialisations: FirstHomeBuyers=0, LuxuryHomes=1, RuralHomes=2, Investors=3, ForeignInvestors=4, Downsizers=5, Retirees=6
    # Regions: Use actual region names from Suburbs table for proper matching (+80 points for region-to-region match)
    declare -a job_templates=(
        "Buy with Advocate:Buy:Just Started:Advocate:Residential:Melbourne - Inner,Melbourne - Inner East:1:0,3"
        "Buy with Broker:Buy:Pre-Approval:Broker:Residential:Sydney - City and Inner South,Sydney - Eastern Suburbs:0:0"
        "Sell with Advocate and Conveyancer:Sell:Just Started:Advocate,Conveyancer:Residential:Brisbane Inner City,Brisbane - North:2:0,3"
        "Investment Property:Buy:Post Purchase:Advocate,BuildAndPest:Investment:Melbourne - North West,Melbourne - West:1:0,3"
        "Premium Purchase:Buy:Pre-Approval:Advocate,Broker:Residential:Sydney - Northern Beaches,Sydney - North Sydney and Hornsby:0:1,3"
    )
    
    for i in $(seq 1 $count); do
        local template_index=$(( (i - 1) % ${#job_templates[@]} ))
        local template="${job_templates[$template_index]}"
        
        # Parse template - now includes regions field
        IFS=':' read -r title job_type journey_progress professionals property_type regions states_numeric specialisations_numeric <<< "$template"
        
        # Convert professional names to JSON array
        local prof_array=$(echo "$professionals" | sed 's/,/","/g' | sed 's/^/["/;s/$/"]/g')
        
        # Convert regions to JSON array (e.g., "Melbourne - Inner,Sydney - City" becomes ["Melbourne - Inner","Sydney - City"])
        local regions_array=$(echo "$regions" | sed 's/,/","/g' | sed 's/^/["/;s/$/"]/g')
        
        # Convert state numbers to JSON array (e.g., "1,2" becomes "[1,2]")
        local states_array="[$states_numeric]"
        
        # Convert specialisation numbers to JSON array (e.g., "0,3" becomes "[0,3]")
        local specs_array="[$specialisations_numeric]"
        
        # Create job with all required fields
        local job_response=$(curl -s -w "\n%{http_code}" -X POST "$REALTY_REACH_API_URL/api/jobs/customer" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "{
                \"jobTitle\":\"$title - Job $i\",
                \"jobType\":\"$job_type\",
                \"propertyType\":\"$property_type\",
                \"journeyProgress\":\"$journey_progress\",
                \"selectedProfessionals\":$prof_array,
                \"regions\":$regions_array,
                \"states\":$states_array,
                \"specialisations\":$specs_array,
                \"budgetMin\":500000,
                \"budgetMax\":1000000,
                \"contactEmail\":\"customer@test.com\",
                \"contactPhone\":\"0412345678\",
                \"purchaseType\":\"Owner-Occupier\",
                \"additionalDetails\":\"Sample job for testing\"
            }" 2>/dev/null)
        
        local job_code=$(echo "$job_response" | tail -n 1)
        local job_body=$(echo "$job_response" | sed '$d')
        
        if [ "$job_code" = "200" ]; then
            log_success "Created job: $title ($job_type)" >&2
        else
            log_error "Job creation failed (HTTP $job_code): $job_body" >&2
        fi
    done
}

update_professional() {
    local token=$1
    local first_name=$2
    local last_name=$3
    local prof_type=$4
    
    # States: NSW=0, VIC=1, QLD=2, WA=3, SA=4, TAS=5, NT=6, ACT=7
    # Specialisations: FirstHomeBuyers=0, LuxuryHomes=1, RuralHomes=2, Investors=3, ForeignInvestors=4, Downsizers=5, Retirees=6
    # Regions: Use actual region names from Suburbs table for proper matching (+80 points for region match)
    # NOTE: verificationStatus is NOT included - professionals cannot self-verify (admin-only via future endpoint)
    local prof_response=$(curl -s -w "\n%{http_code}" -X PUT "$REALTY_REACH_API_URL/api/professional" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{
            \"firstName\":\"$first_name\",
            \"lastName\":\"$last_name\",
            \"professionalType\":\"$prof_type\",
            \"regions\":[\"Melbourne - Inner\",\"Sydney - City and Inner South\",\"Brisbane Inner City\"],
            \"states\":[1,0,2],
            \"specialisations\":[0,3],
            \"abn\":\"12345678901\",
            \"firstLogin\":false
        }" 2>/dev/null)
    
    local prof_code=$(echo "$prof_response" | tail -n 1)
    local prof_body=$(echo "$prof_response" | sed '$d')
    
    if [ "$prof_code" = "200" ]; then
        log_success "Professional profile updated: $first_name $last_name ($prof_type)" >&2
    else
        log_error "Professional profile update failed (HTTP $prof_code): $prof_body" >&2
    fi
}

delete_test_data() {
    log_section "Resetting Test Data"
    
    log_info "Deleting all test data from RealtyReach database..."
    log_warning "Note: Identity API uses in-memory database - restart Identity.Api to clear users"
    
    # Check if container is running
    if ! docker ps --format '{{.Names}}' | grep -q '^postgres$'; then
        log_error "PostgreSQL container 'postgres' is not running"
        log_info "Start it with: docker compose up"
        return 1
    fi
    
    log_info "Executing DELETE statements..."
    
    # Execute delete with verbose output - use PGPASSWORD to provide password
    # Use -i flag for interactive mode to ensure proper execution
    local delete_result=$(PGPASSWORD=admin docker exec -i postgres psql -U admin -d realtyreach -v ON_ERROR_STOP=1 -e << 'EOF' 2>&1
-- Delete JobProfessionalLink entries first (foreign key constraint)
DELETE FROM "JobProfessionalLink" 
WHERE "JobDetailId" IN (
    SELECT "JobDetailId" FROM "Jobs" 
    WHERE "CustomerId" IN (
        SELECT "Id" FROM "Customers" WHERE "Email" LIKE '%@test.com'
    )
);

-- Delete JobDetails
DELETE FROM "JobDetails" 
WHERE "JobDetailId" IN (
    SELECT "JobDetailId" FROM "Jobs" 
    WHERE "CustomerId" IN (
        SELECT "Id" FROM "Customers" WHERE "Email" LIKE '%@test.com'
    )
);

-- Delete Jobs
DELETE FROM "Jobs" 
WHERE "CustomerId" IN (
    SELECT "Id" FROM "Customers" WHERE "Email" LIKE '%@test.com'
);

-- Delete Customers
DELETE FROM "Customers" WHERE "Email" LIKE '%@test.com';

-- Delete Professionals
DELETE FROM "Professionals" WHERE "Email" LIKE '%@test.com';

-- Delete Admins
DELETE FROM "Admins" WHERE "Email" LIKE '%@test.com';

-- Show counts to verify deletion
SELECT 'Remaining Customers:' AS info, COUNT(*) FROM "Customers" WHERE "Email" LIKE '%@test.com';
SELECT 'Remaining Professionals:' AS info, COUNT(*) FROM "Professionals" WHERE "Email" LIKE '%@test.com';
SELECT 'Remaining Jobs:' AS info, COUNT(*) FROM "Jobs";
EOF
)
    
    local exit_code=$?
    
    # Display the full output for debugging
    echo "$delete_result"
    
    if [ $exit_code -eq 0 ]; then
        log_success "Test data cleared successfully"
        return 0
    else
        log_error "Failed to delete test data (exit code: $exit_code)"
        return 1
    fi
}

main() {
    clear
    
    echo -e "${BOLD}${BLUE}"
    echo "╔════════════════════════════════════════════════╗"
    echo "║   RealtyReach Test Data Population             ║"
    echo "╚════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Parse arguments
    case "${1:-}" in
        --help|-h)
            show_help
            exit 0
            ;;
        --verify)
            verify_services
            exit $?
            ;;
        --clean)
            verify_services || exit 1
            delete_test_data
            log_section "Complete!"
            log_success "All test data cleared successfully"
            exit 0
            ;;
        *)
            if [ -n "$1" ]; then
                log_error "Unknown option: $1"
                show_help
                exit 1
            fi
            ;;
    esac
    
    # Verify services are running
    verify_services || exit 1
    
    log_section "Creating Test Data"
    
    # Create professionals FIRST so they exist when customers create jobs
    log_info "Creating professionals..."
    for professional in "${PROFESSIONALS[@]}"; do
        IFS=':' read -r email password first last type <<< "$professional"
        token=$(register_and_create_user "$email" "$password" "$first" "$last" "Professional")
        [ -n "$token" ] && update_professional "$token" "$first" "$last" "$type"
    done
    
    # Create customers and their jobs AFTER professionals exist
    log_info "Creating customers..."
    for customer in "${CUSTOMERS[@]}"; do
        IFS=':' read -r email password first last <<< "$customer"
        token=$(register_and_create_user "$email" "$password" "$first" "$last" "Customer")
        [ -n "$token" ] && create_sample_jobs "$token" 5
    done
    
    # Create admin
    log_info "Creating admin..."
    for admin in "${ADMINS[@]}"; do
        IFS=':' read -r email password first last <<< "$admin"
        register_and_create_user "$email" "$password" "$first" "$last" "Admin"
    done
    
    log_section "Complete!"
    log_success "All test data created successfully"
    
    echo -e "\n${BOLD}Test Credentials:${NC}"
    echo "  Customer:    customer1@test.com / Test@123456"
    echo "  Professional: professional1@test.com / Test@123456"
    echo "  Admin:       admin1@test.com / Test@123456"
    
    echo -e "\n${BOLD}Quick Commands:${NC}"
    echo "  View all users:"
    echo "    docker exec postgres psql -U admin -d realtyreach -c 'SELECT COUNT(*) FROM \"AspNetUsers\";'"
    echo ""
    echo "  View customers:"
    echo "    docker exec postgres psql -U admin -d realtyreach -c 'SELECT email, \"FirstName\", \"LastName\" FROM \"Customers\";'"
    echo ""
    echo "  Clean test data:"
    echo "    ./populate-test-data.sh --clean"
    echo ""
}

main "$@"
