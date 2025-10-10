# RealtyReach Development Guide

## Architecture Overview

RealtyReach is a monolithic .NET 8 real estate professional matching platform with dual APIs and a React frontend.

### System Components

- **RealtyReachApi**: Main business API (.NET 8) - Handles jobs, professionals, customers, and matching logic
- **Identity.Api**: Separate authentication service (ASP.NET Identity + JWT) with in-memory database
- **Frontend**: React 18 + TypeScript + Vite + Material-UI (MUI 5) application
- **Database**: PostgreSQL (containerized, port 5432)

### Data Flow Pattern

```
React Frontend (Port 3000)
    ↓ JWT Bearer Auth
RealtyReachApi (Port 5073) ← Main business logic
    ↓ PostgreSQL connection
SharedDbContext → Entity Framework Core
```

**Key Integration**: Frontend uses `backendApi` (axios instance) with JWT interceptor for all API calls. Identity.Api provides JWT tokens; RealtyReachApi validates them.

## Domain Model

### Core Entities
- **Job**: Customer real estate jobs (Buy/Sell) with `JobDetail` (one-to-one)
- **Customer**: Users posting jobs, linked via `Jobs` collection
- **Professional**: Service providers (e.g., Buyer's Advocate, Mortgage Broker) with verification status, regions, and specializations
- **JobProfessionalLink**: Many-to-many relationship between `JobDetail` and `Professional`
- **Suburb**: Australian location data with state/postcode, seeded via `SuburbSeeder`

### Layered Architecture (DDD-inspired)

**Controllers** → **Services** → **Repositories** → **DbContext**

- **Controllers**: Role-based authorization (`[Authorize(Roles = "Customer")]`), slim action methods
- **Services**: Business logic orchestration (e.g., `CustomerJobService`, `MatchingService`)
- **Repositories**: Data access interfaces (`IJobRepository`, `IProfessionalRepository`)
- **Mappers**: Entity ↔ DTO conversions (e.g., `IJobMapper.ToJobDto(Job)`)

## Professional Matching Algorithm

### Overview

The `MatchingService` is the core business logic for matching customers' real estate jobs with suitable professionals. It uses a **scoring algorithm** to rank professionals based on location, verification status, specializations, and other criteria.

### Matching Workflow

1. **Customer Creates Job** → Selects professional types needed (e.g., "Advocate", "Broker")
2. **`IdentifySuitableProfessionalsAsync(Job)`** → Retrieves and scores all professionals
3. **Algorithm Returns Top 5 per Professional Type** → Stored in `JobDetail.SuggestedProfessionalIds`
4. **Customer Reviews & Selects** → Frontend displays professionals
5. **`FinalizeMatchAsync(MatchingJobDto)`** → Creates `JobProfessionalLink`, removes from suggestions

### Scoring Algorithm (`CalculateScore`)

Professionals are ranked by total score across these dimensions:

| Criteria | Points | Logic |
|----------|--------|-------|
| **Location Match** | 30-80 | Region-to-region match: +80pts<br>State-to-state match: +30pts<br>Job region ↔ Professional state: +50pts |
| **Verification Status** | +10 | Professional has verified credentials |
| **ABN Registered** | +5 | Australian Business Number present |
| **Specialization Match** | +15 each | Per overlapping specialization (e.g., `FirstHomeBuyers`, `LuxuryHomes`) |

**Location Scoring Details** (`LocationService.CalculateMatchingScore`):
```csharp
// Priority hierarchy:
1. Region overlap (job.Regions ∩ professional.Regions) → +80 points
2. State overlap (job.States ∩ professional.States) → +30 points  
3. Cross-match (job.Regions' states ∩ professional.States) → +50 points
```

**Example Scoring**:
- Professional A: Melbourne region (+80), Verified (+10), ABN (+5), 2 specializations (+30) = **125 points**
- Professional B: Victoria state (+30), Unverified (0), No ABN (0) = **30 points**

### Key Domain Models

**Job Selection Flow**:
```csharp
JobDetail.SelectedProfessionals    // User picks: ["Advocate", "Broker"]
    ↓ MatchingService
JobDetail.SuggestedProfessionalIds // Top 5 per type: [guid1, guid2, ...]
    ↓ Customer Selection
JobProfessionalLink                // Final match record
```

**Professional Specializations** (Enum):
- `FirstHomeBuyers`, `LuxuryHomes`, `RuralHomes`, `Investors`, `ForeignInvestors`, `Downsizers`, `Retirees`

**Professional Types** (Enum):
- `Advocate` (1), `Broker` (2), `Conveyancer` (3), `BuildAndPest` (4)

### Implementation Notes

- **Top 5 Per Type**: Algorithm groups by `ProfessionalTypeId`, sorts by score descending, takes top 5
- **Async Processing**: Uses `Task.WhenAll` to score professionals in parallel
- **Journey Progress Integration**: `appsettings.json` "Buying Stages" maps journey stages to required professional types
- **Future Enhancement**: Haversine distance calculation for suburb-to-suburb matching (currently commented out)

## Development Workflows

### Running the Application

**Backend (RealtyReachApi)**:
```bash
dotnet build realtyreach.sln
dotnet run --project RealtyReachApi/RealtyReachApi.csproj
```
Available task: `build` (VS Code task panel)

**Frontend**:
```bash
cd frontend/realty-reach-main
npm start  # Vite dev server → http://localhost:3000
```

**Infrastructure (PostgreSQL)**:
```bash
docker-compose up  # Starts postgres:16 container
```
Connection string: `Host=localhost;Database=realtyreach;Username=admin;Password=admin`

### Database Migrations

EF Core migrations auto-apply on startup in Development:
```csharp
// Program.cs - runs on app start
dbContext.Database.Migrate();
SuburbSeeder.SeedDatabase(dbContext);
```

Create new migration:
```bash
dotnet ef migrations add <MigrationName> --project RealtyReachApi
```

### Testing

**Test naming convention**: `MethodName_Condition_ExpectedResult()`
```csharp
[Fact(DisplayName = "Descriptive scenario")]
public void CreateJob_WithValidData_ReturnsJobDto()
```

Run tests:
```bash
dotnet test  # No test projects visible yet in workspace
```

## Project Conventions

### Authentication & Authorization

- **JWT Configuration**: Hardcoded secret in `appsettings.json` (`JWTDev` section) - **change for production**
- **Token storage**: Frontend stores JWT in `localStorage`, attached via axios interceptor
- **Role-based routes**: Controllers use `[Authorize(Roles = "Customer")]` or `"Professional"`
- **CORS**: Configured to allow `http://localhost:3000` only

### Service Registration Pattern (Program.cs)

```csharp
// Repositories
builder.Services.AddScoped<IJobRepository, JobRepository>();
// Services
builder.Services.AddScoped<ICustomerJobService, CustomerJobService>();
// Mappers
builder.Services.AddScoped<IJobMapper, JobMapper>();
```

**Always register interface + implementation pairs**. Constructor injection is used throughout.

### API Response Patterns

Controllers return:
- `Ok(dto)` for successful operations
- `NotFound()` when resources don't exist
- `BadRequest()` for validation failures
- DTOs (never raw entities) via mapper services

### Database Context Usage

`SharedDbContext` includes:
- Identity tables (via `IdentityDbContext` pattern in future - currently separated)
- Business entities: `Jobs`, `JobDetails`, `Professionals`, `Customers`, `Suburbs`
- Explicit relationships configured in `OnModelCreating` (not conventions)

### Frontend Architecture

- **Routing**: `react-router-dom` with `ProtectedRoute` wrapper for auth checks
- **State management**: Local state + `localStorage` for auth tokens (no Redux/Context yet)
- **API layer**: `services/` directory (e.g., `JobService.ts`, `AuthService.ts`) wraps `backendApi`
- **Forms**: `react-hook-form` + `yup` validation + MUI components

## Critical Files Reference

- **Backend startup**: `RealtyReachApi/Program.cs` (DI container, middleware pipeline, DB migrations)
- **Entity relationships**: `RealtyReachApi/Data/SharedDbContext.cs`
- **Job journey config**: `RealtyReachApi/Misc/JourneyProgressOptions.cs` + `appsettings.json` "Buying Stages"
- **Frontend API client**: `frontend/realty-reach-main/src/api/backendApi.ts`
- **Route definitions**: `frontend/realty-reach-main/src/RoutesConfig.tsx`

## Common Pitfalls

1. **Forgot to register service/repository**: Add to `Program.cs` DI container or get runtime errors
2. **EF tracking issues**: Use `AsNoTracking()` for read-only queries; remember `SaveChangesAsync()`
3. **CORS errors**: Verify frontend origin matches CORS policy (`http://localhost:3000`)
4. **JWT secret**: Hardcoded secret in `appsettings.json` is **development-only**
5. **Dual API confusion**: Identity.Api is separate; use RealtyReachApi's JWT validation, not Identity.Api's database

## AI Development Guidelines

**Before implementing**:
1. Check existing patterns in `Services/`, `Repositories/`, and `Controllers/` for consistency
2. Follow DDD principles from `.github/instructions/dotnet-architecture-good-practices.instructions.md`
3. Use mapper interfaces (`IJobMapper`, `IProfessionalMapper`) - never expose entities directly
4. Register new services in `Program.cs` immediately after creation

**When adding features**:
- DTOs go in `Dtos/` directory
- Business logic in `Services/`, data access in `Repositories/`
- Always use async/await (`Task<T>`) for database operations
- Test naming: `MethodName_Condition_ExpectedResult()`
