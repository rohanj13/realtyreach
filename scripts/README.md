# RealtyReach Scripts

## Quick Start

**1. Start services (3 terminals):**
```bash
# Terminal 1
docker compose up

# Terminal 2
cd Identity.Api && dotnet run

# Terminal 3
cd RealtyReachApi && dotnet run
```

**2. Populate test data:**
```bash
cd scripts
./populate-test-data.sh
```

## What Gets Created

- **6 Professionals** (2 Advocates, 2 Brokers, 1 Conveyancer, 1 BuildAndPest) - all verified
- **2 Customers** with 5 jobs each = 10 total jobs
- **1 Admin** account

All users have `firstLogin` set to false and are ready to use.

## Test Credentials

```
Customer:     customer1@test.com / Test@123456
Professional: professional1@test.com / Test@123456
Admin:        admin1@test.com / Test@123456
```

## Commands

```bash
./populate-test-data.sh          # Create test data
./populate-test-data.sh --clean  # Delete all test data only
./populate-test-data.sh --verify # Check if services are running
./populate-test-data.sh --help   # Show help
```

## Verify Data

```bash
# View professionals
docker exec postgres psql -U admin -d realtyreach -c \
  'SELECT "Email", "FirstName", "LastName", "ProfessionalTypeId" FROM "Professionals";'

# View customers
docker exec postgres psql -U admin -d realtyreach -c \
  'SELECT "Email", "FirstName", "LastName" FROM "Customers";'

# Count jobs
docker exec postgres psql -U admin -d realtyreach -c \
  'SELECT COUNT(*), "JobType" FROM "Jobs" GROUP BY "JobType";'
```

## Services

| Service | Port | URL |
|---------|------|-----|
| Identity API | 5209 | http://localhost:5209 |
| RealtyReach API | 5073 | http://localhost:5073 |
| PostgreSQL | 5432 | localhost:5432 (docker container: `postgres`) |

## Troubleshooting

**Services not running?**
```bash
# Check ports
lsof -i :5209 :5073 :5432

# Check docker
docker ps | grep postgres
```

**Script errors?**
- Ensure all 3 services show "Application started" before running
- Identity API uses in-memory database - restart it to clear auth users
- Use `--clean` to reset PostgreSQL test data