---
goal: "Implement Get Applicable Jobs for Professionals Feature"
version: 1.0
date_created: 2025-10-20
last_updated: 2025-10-20
owner: rohanj13
status: "Planned"
tags: ["feature", "jobs", "professional", "api"]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-planned-blue)

This implementation plan details the development of the "Get Applicable Jobs for Professionals" feature. This feature allows professionals to view jobs where they have been finalized as a match by customers, enabling them to follow up on high-quality leads.

## 1. Requirements & Constraints

- **REQ-001**: Professionals should only see jobs where they have been finalized as a match
- **REQ-002**: Jobs must be filterable by status (Open, In Progress, Completed)
- **REQ-003**: Frontend must display key job details (title, location, specializations)
- **SEC-001**: Professionals can only access their own matched jobs
- **CON-001**: Must use existing JobProfessionalLink table for relationship tracking
- **GUD-001**: Follow existing API response patterns using DTOs
- **PAT-001**: Use repository pattern consistent with existing codebase

## 2. Implementation Steps

### Implementation Phase 1: Backend Development

- GOAL-001: Implement backend API for retrieving professional's matched jobs

| Task     | Description                                        | Completed | Date |
| -------- | -------------------------------------------------- | --------- | ---- |
| TASK-001 | Create GetMatchedJobsDto                           |           |      |
| TASK-002 | Implement GetMatchedJobsForProfessional repository |           |      |
| TASK-003 | Implement ProfJobService method                    |           |      |
| TASK-004 | Add API endpoint in ProfJobController              |           |      |
| TASK-005 | Add unit tests for service and controller          |           |      |

### Implementation Phase 2: Frontend Integration

- GOAL-002: Implement frontend components for displaying matched jobs

| Task     | Description                           | Completed | Date |
| -------- | ------------------------------------- | --------- | ---- |
| TASK-006 | Create MatchedJobsService in frontend |           |      |
| TASK-007 | Implement MatchedJobsList component   |           |      |
| TASK-008 | Add job filtering functionality       |           |      |
| TASK-009 | Integrate with professional dashboard |           |      |
| TASK-010 | Add loading and error states          |           |      |

## 3. Alternatives

- **ALT-001**: Show all available jobs with match scores (Rejected: Professionals should only see confirmed matches)
- **ALT-002**: Real-time notifications for new matches (Future enhancement)

## 4. Dependencies

- **DEP-001**: Existing JobProfessionalLink table
- **DEP-002**: JWT Authentication from Identity.Api
- **DEP-003**: Existing Job and Professional entities
- **DEP-004**: React + ChakraUI frontend stack

## 5. Files

### Backend Files

- **FILE-001**: `/RealtyReachApi/Controllers/ProfJobController.cs`
- **FILE-002**: `/RealtyReachApi/Services/ProfJobService.cs`
- **FILE-003**: `/RealtyReachApi/Dtos/GetMatchedJobsDto.cs`
- **FILE-004**: `/RealtyReachApi/Repositories/IProfJobRepository.cs`
- **FILE-005**: `/RealtyReachApi/Repositories/ProfJobRepository.cs`

### Frontend Files

- **FILE-006**: `/frontend/realty-reach/src/services/MatchedJobsService.ts`
- **FILE-007**: `/frontend/realty-reach/src/components/Jobs/MatchedJobsList.tsx`
- **FILE-008**: `/frontend/realty-reach/src/pages/ProfessionalDashboard/MatchedJobs.tsx`

## 6. Testing

### Backend Tests

- **TEST-001**: Unit test: ProfJobService GetMatchedJobsForProfessional
- **TEST-002**: Integration test: GET /api/jobs/professional/matches endpoint
- **TEST-003**: Test authorization and security constraints

### Frontend Tests

- **TEST-004**: Test MatchedJobsList component rendering
- **TEST-005**: Test job filtering functionality
- **TEST-006**: Test loading and error states

## 7. Risks & Assumptions

- **RISK-001**: Performance with large number of matched jobs
- **RISK-002**: Race conditions if customer unmatches while professional is viewing
- **ASSUMPTION-001**: JobProfessionalLink table correctly tracks finalized matches
- **ASSUMPTION-002**: Professional verification status doesn't affect viewing matches

## 8. Related Specifications

```csharp
// GetMatchedJobsDto.cs
public class GetMatchedJobsDto
{
    public int JobId { get; set; }
    public string Title { get; set; }
    public string JobType { get; set; }
    public List<string> Regions { get; set; }
    public List<string> Specialisations { get; set; }
    public DateTime MatchedDate { get; set; }
    public JobStatus Status { get; set; }
}

// ProfJobController.cs
[HttpGet("matches")]
[Authorize(Roles = "Professional")]
public async Task<ActionResult<List<GetMatchedJobsDto>>> GetMatchedJobs()
{
    var professionalId = User.GetUserId();
    var jobs = await _profJobService.GetMatchedJobsForProfessional(professionalId);
    return Ok(jobs);
}

// ProfJobService.cs
public async Task<List<GetMatchedJobsDto>> GetMatchedJobsForProfessional(Guid professionalId)
{
    var matches = await _profJobRepository.GetMatchedJobsForProfessional(professionalId);
    return _mapper.Map<List<GetMatchedJobsDto>>(matches);
}
```
