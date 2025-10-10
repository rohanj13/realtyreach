# RealtyReach Project Charter

## Executive Summary

**RealtyReach** is a platform that connects Australian real estate customers with qualified professionals throughout their property buying or selling journey. The platform uses an intelligent matching algorithm to recommend the top 5 professionals in each service category based on location, credentials, and specializations.

**Status**: Active Development  
**Target Market**: Australian Real Estate Market  
**Primary Users**: Property Buyers/Sellers (Customers) and Real Estate Service Professionals

---

## Problem Statement

Navigating the real estate process in Australia requires coordination with multiple specialized professionals (buyer's advocates, mortgage brokers, conveyancers, building inspectors). Current solutions lack:

1. **Centralized Discovery**: No single platform to find and manage all required professionals
2. **Journey-Aware Matching**: Services needed vary by purchase stage (pre-approval vs. post-purchase)
3. **Quality Assurance**: Difficulty verifying professional credentials and specializations
4. **Location Optimization**: Finding professionals who service specific Australian regions/states

---

## Solution Overview

RealtyReach provides a **two-sided marketplace** with:

### For Customers
- Create property jobs (Buy/Sell) with detailed requirements
- Receive AI-matched recommendations for up to 5 professionals per service type
- Track jobs through buying stages (Just Started → Pre-Approval → Post Purchase)
- View professional profiles with verification status, ABN, and specializations
- Finalize matches and manage professional relationships

### For Professionals
- Create verified profiles with credentials, service regions, and specializations
- Receive notifications about applicable jobs matching their expertise
- Manage their service offerings and availability

---

## Technical Architecture

### Technology Stack

**Backend**
- .NET 8 (C#) - Monolithic API architecture
- Entity Framework Core - ORM with PostgreSQL
- ASP.NET Identity + JWT - Authentication & Authorization
- Domain-Driven Design (DDD) principles

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- Material-UI (MUI 5) - Component library
- React Hook Form + Yup - Form validation
- React Router v6 - Routing
- Axios - HTTP client with JWT interceptors

**Infrastructure**
- PostgreSQL 16 (Docker containerized)
- Docker Compose for local development
- Nginx (for frontend in production)

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Port 3000)               │
│           Material-UI • TypeScript • Vite                    │
└────────────────────────┬────────────────────────────────────┘
                         │ JWT Bearer Token
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Identity.Api (Separate Service)             │
│           ASP.NET Identity • In-Memory DB                    │
│           Issues JWT tokens for authentication               │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              RealtyReachApi (Port 5073)                      │
│                 Main Business Logic API                      │
│    Controllers → Services → Repositories → DbContext         │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Port 5432)                 │
│        Jobs • Customers • Professionals • Suburbs            │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Features Implemented

### 1. User Management & Authentication
**Status**: ✅ Implemented

- **Multi-Role System**: Customer, Professional, Admin roles
- **Dual API Authentication**: 
  - Identity.Api handles registration/login and JWT token generation
  - RealtyReachApi validates JWT tokens for business operations
- **Profile Completion Flow**: First-time users complete role-specific profiles
- **User Types**:
  - `Customer`: Property buyers/sellers posting jobs
  - `Professional`: Service providers (Advocates, Brokers, Conveyancers, Inspectors)
  - `Admin`: Platform administrators

**Endpoints**:
- `POST /api/Auth/register` - User registration with role assignment
- `POST /api/Auth/login` - Authentication with JWT token generation
- `POST /api/User` - Create user profile in main database
- `PUT /api/Professional` - Update professional profile

---

### 2. Job Creation & Management
**Status**: ✅ Implemented

Customers create jobs with comprehensive property details:

**Job Attributes**:
- **Basic Info**: Title, Type (Buy/Sell), Additional Details
- **Location**: Regions (e.g., "Melbourne", "Sydney"), States (NSW, VIC, QLD, etc.)
- **Property Details**: 
  - Purchase Type (First Home, Investment, Upgrading)
  - Property Types (House, Apartment, Townhouse, Land, etc.)
  - Budget Range (Min/Max)
- **Journey Stage**: Just Started, Pre-Approval, Post Purchase
- **Contact**: Email, Phone
- **Specializations**: First Home Buyers, Luxury Homes, Rural, Investors, etc.

**Professional Selection**:
- Customers select needed professional types (Advocate, Broker, Conveyancer, Building & Pest)
- Algorithm suggests top 5 professionals per selected type
- Customers review suggestions and finalize matches

**Endpoints**:
- `POST /api/jobs/customer` - Create new job (Customer role)
- `GET /api/jobs/customer/user/{userId}` - Get all jobs for customer
- `GET /api/jobs/customer/{jobId}` - Get specific job details
- `DELETE /api/jobs/customer/{jobId}` - Delete job
- `POST /api/jobs/customer/finalise` - Finalize professional match

**Job Lifecycle**:
```
Job Created → Algorithm Suggests Professionals → Customer Reviews → 
Customer Selects → Match Finalized → JobProfessionalLink Created
```

---

### 3. Intelligent Matching Algorithm
**Status**: ✅ Implemented (Core Logic Complete)

The `MatchingService` uses a **multi-factor scoring system** to rank professionals:

#### Scoring Criteria

| Factor | Points | Logic |
|--------|--------|-------|
| **Location Match** | 30-80 | Region overlap (+80), State overlap (+30), Cross-match (+50) |
| **Verification Status** | +10 | Professional credentials verified |
| **ABN Registration** | +5 | Australian Business Number present |
| **Specialization Match** | +15 each | Per matching specialization (e.g., FirstHomeBuyers) |

#### Algorithm Flow

1. **Filter by Professional Type**: Get all professionals of requested types (Advocate, Broker, etc.)
2. **Parallel Scoring**: Score each professional concurrently using `Task.WhenAll`
3. **Location Scoring Priority**:
   - Region-to-Region match (highest): +80 points
   - State-to-State match: +30 points
   - Job regions' states ↔ Professional states: +50 points
4. **Credential Bonuses**: Verified (+10), ABN (+5)
5. **Specialization Overlap**: +15 per matching specialization
6. **Group & Rank**: Group by professional type, sort by score descending
7. **Top 5 Selection**: Return top 5 professionals per type
8. **Store Suggestions**: Save to `JobDetail.SuggestedProfessionalIds`

#### Example Scoring
```
Professional A (Buyer's Advocate):
- Melbourne region match: +80
- Verified: +10
- Has ABN: +5
- Specializations: FirstHomeBuyers (+15), Investors (+15)
Total: 125 points

Professional B (Buyer's Advocate):
- Victoria state match: +30
- Not verified: 0
- No ABN: 0
Total: 30 points

→ Professional A ranked higher
```

**Implementation**:
- Service: `MatchingService.IdentifySuitableProfessionalsAsync(Job)`
- Location Logic: `LocationService.CalculateMatchingScore(Job, Professional)`
- Finalization: `MatchingService.FinalizeMatchAsync(MatchingJobDto)`

---

### 4. Professional Discovery
**Status**: ✅ Implemented

Professionals can discover jobs they're qualified for:

**Discovery Logic**:
- Filter jobs by professional type
- Show jobs in serviceable regions/states
- Display job details, budget, and customer requirements

**Endpoints**:
- `GET /api/jobs/professional/{professionalId}/availablejobs` - Get applicable jobs

---

### 5. Location Services
**Status**: ✅ Implemented

Comprehensive Australian location data:

**Data Source**: CSV seed data (`australian_postcodes.csv`)
- **Suburbs**: ~15,000+ Australian suburbs with postcodes
- **Regions**: Major metro areas (Melbourne, Sydney, Brisbane, etc.)
- **States**: NSW, VIC, QLD, WA, SA, TAS, NT, ACT
- **Auto-seeding**: Database populated on first startup

**Features**:
- Search locations by query
- Get all regions/states for dropdowns
- Suburb-to-region mapping
- State abbreviations to enum conversion

**Endpoints**:
- `GET /api/Location/regions` - Get all regions
- `GET /api/Location/states` - Get all states
- `GET /api/Location/search?query={text}` - Search locations

**Future Enhancement**: Haversine distance calculation for suburb-to-suburb proximity matching (commented in code)

---

### 6. Professional Specializations
**Status**: ✅ Implemented

Professionals can specify expertise in:
- `FirstHomeBuyers` - First-time home buyer specialists
- `LuxuryHomes` - High-end property experts
- `RuralHomes` - Rural/regional property specialists
- `Investors` - Investment property advisors
- `ForeignInvestors` - International buyer specialists
- `Downsizers` - Downsizing/retirement specialists
- `Retirees` - Retirement living experts

These specializations factor into the matching algorithm (+15 points per match).

---

### 7. Journey Stage Tracking
**Status**: ✅ Implemented

Customers progress through buying stages:

**Stages** (configured in `appsettings.json`):
1. **Just Started**: Needs Buyer's Advocate, Mortgage Broker
2. **Pre-Approval**: Needs Buyer's Advocate, Conveyancer, Building & Pest Inspector
3. **Post Purchase**: Needs Conveyancer, Building & Pest Inspector

**Configuration**:
```json
"Buying Stages": {
  "Just Started": ["Buyer's Advocate", "Mortgage Broker"],
  "Pre-Approval": ["Buyer's Advocate", "Conveyancer", "Building & Pest Inspector"],
  "Post Purchase": ["Conveyancer", "Building & Pest Inspector"]
}
```

This enables journey-aware professional recommendations.

---

### 8. Dashboard & UI
**Status**: ✅ Implemented

**Customer Dashboard**:
- View all created jobs
- Create new job wizard
- View matched professionals for each job
- Track job status (Open/Closed)

**Professional Dashboard**:
- View profile and credentials
- Browse available jobs
- See job matches

**Shared Components**:
- `CreateJobForm.tsx` - Multi-step job creation
- `MatchedProfessionals.tsx` - Display matched professionals
- `Metrics.tsx` - Dashboard metrics
- `NotificationsDrawer.tsx` - Notification system

**Routing**:
- Landing pages for customers and professionals
- Protected routes with role-based access control
- Profile completion flows
- Error pages (Unauthorized, etc.)

---

## Domain Model

### Core Entities

```
Customer (1) ──── (M) Job (1) ──── (1) JobDetail (M) ──── (M) Professional
                                           │
                                           └── (M) JobProfessionalLink

Suburb (location data for matching)
ProfessionalType (Advocate, Broker, Conveyancer, BuildAndPest)
```

### Key Relationships

- **Customer → Jobs**: One-to-many (customers create multiple jobs)
- **Job → JobDetail**: One-to-one (job has detailed requirements)
- **JobDetail ↔ Professional**: Many-to-many via `JobProfessionalLink`
- **Professional → ProfessionalType**: Many-to-one (each professional has one type)

### Entity Attributes

**Job**:
- JobId, CustomerId, JobTitle, JobType (Buy/Sell)
- Status (Open/Closed), CreatedAt, UpdatedAt
- Navigation: Customer, JobDetails

**JobDetail**:
- Regions, States, Specialisations, PurchaseType, PropertyType
- JourneyProgress, SelectedProfessionals, SuggestedProfessionalIds
- BudgetMin, BudgetMax, ContactEmail, ContactPhone

**Professional**:
- Id (Guid), Email, FirstName, LastName, ProfessionalTypeId
- ABN, LicenseNumber, VerificationStatus, CompanyName
- Regions, States, Specialisations

**JobProfessionalLink**:
- JobDetailId, ProfessionalId (composite key)
- SelectionDate, AssignedDate

---

## Architecture Patterns

### Layered Architecture (DDD-Inspired)

```
Controllers (HTTP endpoints, authorization)
    ↓
Services (Business logic orchestration)
    ↓
Repositories (Data access abstraction)
    ↓
DbContext (Entity Framework Core)
```

**Dependency Injection**: All services/repositories registered in `Program.cs`

**Example Flow**:
```csharp
CustomerJobController.CreateJob()
    → ICustomerJobService.CreateJobAsync()
        → IJobRepository.CreateJobAsync()
            → SharedDbContext.Jobs.Add()
        → IMatchingService.IdentifySuitableProfessionalsAsync()
            → IProfessionalRepository.GetProfessionalsByTypeIds()
            → ILocationService.CalculateMatchingScore()
    → IJobMapper.ToJobDto()
    → Return Ok(JobDto)
```

### Mapper Pattern

All entity-to-DTO conversions use mapper interfaces:
- `IJobMapper`: Job ↔ JobDto, CreateJobDto
- `IProfessionalMapper`: Professional ↔ ProfessionalDto
- `ICustomerMapper`: Customer ↔ CustomerDto

**Never expose entities directly** - controllers return DTOs only.

### Repository Pattern

Data access abstracted behind interfaces:
- `IJobRepository`, `IProfessionalRepository`, `ICustomerRepository`
- `ILocationRepository`, `IProfessionalTypeRepository`

Enables testability and decoupling from EF Core.

---

## Security & Authentication

### JWT Token Flow

1. **Registration**: `Identity.Api/Auth/register` creates user with role
2. **Login**: `Identity.Api/Auth/login` returns JWT token
3. **Storage**: Frontend stores token in `localStorage`
4. **Authorization**: `backendApi` axios interceptor adds `Bearer {token}` header
5. **Validation**: RealtyReachApi validates token on each request

### Role-Based Authorization

Controllers use `[Authorize(Roles = "...")]` attributes:
- **Customer**: Can create/view jobs, finalize matches
- **Professional**: Can view applicable jobs, update profile
- **Admin**: Platform management (limited implementation)

### CORS Configuration

Hardcoded to allow `http://localhost:3000` in development:
```csharp
policy.WithOrigins("http://localhost:3000")
      .AllowAnyHeader()
      .AllowAnyMethod();
```

**⚠️ Security Notes**:
- JWT secret is hardcoded in `appsettings.json` - **MUST change for production**
- Identity.Api uses in-memory database - not production-ready
- CORS allows single origin - expand for production

---

## Database Schema

### Main Tables

**Jobs**: JobId (PK), CustomerId (FK), JobTitle, JobType, Status, CreatedAt, UpdatedAt

**JobDetails**: JobDetailId (PK), JobId (FK), Regions, States, Specialisations, PurchaseType, PropertyType, JourneyProgress, SelectedProfessionals, SuggestedProfessionalIds, BudgetMin, BudgetMax, ContactEmail, ContactPhone

**Customers**: Id (Guid, PK), Email, FirstName, LastName, FirstLogin

**Professionals**: Id (Guid, PK), ProfessionalTypeId (FK), Email, FirstName, LastName, ABN, LicenseNumber, VerificationStatus, CompanyName, Regions, States, Specialisations, FirstLogin

**JobProfessionalLink**: JobDetailId (FK), ProfessionalId (FK), SelectionDate, AssignedDate (Composite PK)

**ProfessionalTypes**: ProfessionalTypeId (PK), TypeName, Description

**Suburbs**: SuburbId (PK), Postcode, Locality, State, Region, Latitude, Longitude

### Migration Strategy

- **Auto-migration on startup** in Development environment
- Suburb data auto-seeded from CSV on first run
- Migration command: `dotnet ef migrations add <Name> --project RealtyReachApi`

---

## Development Workflows

### Running Locally

**1. Start PostgreSQL**:
```bash
docker-compose up
```

**2. Run Backend**:
```bash
dotnet build realtyreach.sln
dotnet run --project RealtyReachApi/RealtyReachApi.csproj
# API: http://localhost:5073
# Swagger: http://localhost:5073/swagger
```

**3. Run Frontend**:
```bash
cd frontend/realty-reach-main
npm install
npm start
# Frontend: http://localhost:3000
```

### VS Code Tasks

Available in task panel:
- `build` - Build .NET solution
- `publish` - Publish solution
- `watch` - Watch mode for hot reload

---

## Current Limitations & Technical Debt

### 1. Identity Service Separation
- Identity.Api uses **in-memory database** (user data lost on restart)
- User profile data duplicated between Identity.Api and RealtyReachApi
- **Recommendation**: Migrate to shared PostgreSQL or consolidate services

### 2. Matching Algorithm Enhancements
- Suburb-to-suburb Haversine distance calculation commented out
- No professional availability/capacity tracking
- No professional ratings/reviews system
- Static journey stage configuration (not user-customizable)

### 3. Job Management Features
- Update job endpoint commented out
- No job progression to next stage endpoint
- Job status tracking basic (Open/Closed only)
- No job history or audit trail

### 4. Professional Features
- Limited professional profile management
- No portfolio/case studies
- No calendar/availability management
- No messaging between customers and professionals

### 5. Testing
- No visible test projects in workspace
- Testing infrastructure needs setup
- Test naming convention defined but not enforced

### 6. Deployment
- Backend and frontend Docker containers commented out in docker-compose
- No CI/CD pipeline
- No production environment configuration
- Hardcoded secrets in configuration files

### 7. UI/UX
- Profile completion flows basic
- No real-time notifications
- Limited error handling on frontend
- No loading states/skeletons

---

## Future Roadmap

### Phase 1: Foundation Completion (Current)
- ✅ User authentication and profiles
- ✅ Job creation and management
- ✅ Intelligent matching algorithm
- ✅ Location services
- 🔄 Professional discovery (partially complete)

### Phase 2: Enhanced Matching
- [ ] Haversine distance-based suburb matching
- [ ] Professional ratings and reviews system
- [ ] Availability and capacity management
- [ ] Machine learning for match optimization
- [ ] Historical performance tracking

### Phase 3: Communication & Collaboration
- [ ] In-app messaging between customers and professionals
- [ ] Video call scheduling
- [ ] Document sharing and management
- [ ] Task/milestone tracking
- [ ] Notification system (email, SMS, push)

### Phase 4: Marketplace Features
- [ ] Professional pricing and quotes
- [ ] Service packages and bundles
- [ ] Payment processing integration
- [ ] Escrow/trust account management
- [ ] Review and dispute resolution

### Phase 5: Analytics & Intelligence
- [ ] Customer journey analytics
- [ ] Professional performance dashboards
- [ ] Market insights and reporting
- [ ] Predictive analytics for job success
- [ ] Recommendation engine improvements

### Phase 6: Production Readiness
- [ ] Consolidate authentication services
- [ ] Production database configuration
- [ ] Secrets management (Azure Key Vault, AWS Secrets Manager)
- [ ] CI/CD pipeline (GitHub Actions, Azure DevOps)
- [ ] Comprehensive testing suite
- [ ] Performance optimization
- [ ] Security audit and penetration testing

---

## Success Metrics (Proposed)

### User Engagement
- Number of registered customers and professionals
- Jobs created per month
- Successful matches per job
- Time to first match
- User retention rate

### Matching Quality
- Match acceptance rate (customer selects suggested professional)
- Average match score of selected professionals
- Customer satisfaction with matches
- Professional satisfaction with job quality

### Platform Health
- API response times
- Error rates
- Uptime percentage
- Database query performance

---

## Team & Resources

### Current State
- Solo development project
- Monolithic architecture for rapid iteration
- DDD principles for maintainability
- React + .NET stack for full-stack capability

### Required Skills
- **Backend**: .NET Core, C#, Entity Framework, PostgreSQL, DDD
- **Frontend**: React, TypeScript, Material-UI, React Hook Form
- **DevOps**: Docker, CI/CD, Cloud deployment (Azure/AWS)
- **Domain**: Australian real estate market knowledge

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Dual API complexity** | High | Plan to consolidate into single API or microservices |
| **Hardcoded secrets** | Critical | Implement secrets management before production |
| **In-memory auth DB** | Critical | Migrate to PostgreSQL or external auth provider |
| **No testing** | High | Establish test suite with unit, integration, and E2E tests |
| **Matching algorithm accuracy** | Medium | Collect user feedback, implement ML improvements |
| **Professional verification** | High | Implement robust credential verification process |
| **Scalability** | Medium | Load testing, caching strategy, database optimization |

---

## Compliance & Legal

### Australian Considerations
- **ABN Verification**: Integration with ABR (Australian Business Register) API
- **Privacy Act**: Compliance for personal data handling
- **Professional Licensing**: Verify licenses with state regulatory bodies
- **Consumer Protection**: Fair trading, dispute resolution mechanisms
- **Data Sovereignty**: Ensure Australian data stored in Australian servers

---

## Conclusion

RealtyReach is a well-architected platform addressing a real market need in the Australian real estate sector. The core matching algorithm is innovative and the technical foundation is solid. 

**Next Steps**:
1. Complete professional dashboard features
2. Implement messaging system
3. Add comprehensive testing
4. Consolidate authentication services
5. Prepare for production deployment

**Key Strengths**:
- ✅ Clean DDD architecture
- ✅ Intelligent matching algorithm
- ✅ Role-based security
- ✅ Modern tech stack
- ✅ Comprehensive location data

**Areas for Improvement**:
- ⚠️ Testing coverage
- ⚠️ Production readiness
- ⚠️ Professional features
- ⚠️ Communication tools
- ⚠️ Deployment automation

---

**Document Version**: 1.0  
**Last Updated**: October 10, 2025  
**Status**: Active Development
