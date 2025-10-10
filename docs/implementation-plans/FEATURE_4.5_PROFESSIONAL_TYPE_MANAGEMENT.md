# Implementation Plan: Feature 4.5 - Professional Type Management

**Feature ID**: 4.5  
**Feature Name**: Professional Type Management  
**Priority**: P1 - High  
**Estimated Effort**: 4-6 hours (Frontend Only)  
**Status**: 🟡 Partially Implemented  
**Created**: October 10, 2025  
**Frontend Directory**: `frontend/realty-reach-main/`

---

## Executive Summary

Currently, the professional type is hardcoded to "Advocate" in the backend when a professional user is created. This implementation plan details the **frontend changes only** needed to enable professionals to select their type during registration and profile completion in the `realty-reach-main` application.

**Scope**: This plan focuses exclusively on the React TypeScript frontend in `frontend/realty-reach-main/`. Backend changes are documented separately.

---

## Current State Analysis

### What Exists in `realty-reach-main`

**Directory Structure**:
```
frontend/realty-reach-main/
├── src/
│   ├── Models/User.ts                    # Type definitions & enums
│   ├── Pages/
│   │   ├── RegisterPage/
│   │   │   └── ProfProfileCompletion.tsx # Registration form
│   │   └── UserDashboard/
│   │       └── ProfessionalDashboard.tsx # Dashboard view
│   ├── services/
│   │   ├── AuthService.ts
│   │   └── JobService.ts
│   ├── api/backendApi.ts                 # Axios instance
│   └── RoutesConfig.tsx                  # Route definitions
```

**Current Implementation**:

**1. Models/User.ts** - Enum Mismatch Issue:
```typescript
// ⚠️ WRONG ORDER - Doesn't match backend!
export enum ProfessionalTypeEnum {
  Advocate = 1,
  Conveyancer = 2,        // Backend has Broker = 2
  BuildAndPest = 3,       // Backend has Conveyancer = 3
  Broker = 4              // Backend has BuildAndPest = 4
}

export const ProfessionalTypeEnumMapping: Record<ProfessionalTypeEnum, string> = {
  [ProfessionalTypeEnum.Advocate]: "Buyer's Advocate",
  [ProfessionalTypeEnum.Conveyancer]: "Conveyancer",
  [ProfessionalTypeEnum.BuildAndPest]: "Building & Pest Inspector",
  [ProfessionalTypeEnum.Broker]: "Mortgage Broker",
};
```

**2. ProfProfileCompletion.tsx** - Form exists but doesn't submit type:
```typescript
// Lines 31-45: Form state includes professionalType
const [formData, setFormData] = useState({
  firstName: professionalUser?.FirstName || "",
  lastName: professionalUser?.LastName || "",
  companyName: professionalUser?.CompanyName || "",
  abn: professionalUser?.ABN || "",
  licenseNumber: professionalUser?.LicenseNumber || "",
  professionalType: professionalUser?.ProfessionType || "", // ← Captured but not sent
  phone: "",
  // ... other fields
});

// Lines 107-141: Submit function doesn't send professionalType to /api/User
const handleSubmit = async () => {
  const professionalData = {
    userId: professionalUser?.Id,
    firstName: formData.firstName,
    // ... other fields
    professionalType: Number(formData.professionalType), // ← Only sent to /api/Professional/profile
  };
  
  await axios.post('/api/Professional/profile', professionalData); // Wrong endpoint!
};
```

**3. UI Components** - Dropdown exists (lines 200-230):
```typescript
<TextField
  fullWidth
  select
  label="Professional Type"
  name="professionalType"
  value={formData.professionalType}
  onChange={handleInputChange}
  error={!!formErrors.professionalType}
  helperText={formErrors.professionalType}
  required
>
  {Object.entries(ProfessionalTypeEnumMapping).map(([key, label]) => (
    <MenuItem key={key} value={key}>
      {label}
    </MenuItem>
  ))}
</TextField>
```

### Frontend Issues Identified

1. **❌ Enum Value Mismatch**: Frontend enum values 2-4 don't align with backend (Conveyancer/BuildAndPest/Broker order is wrong)
2. **❌ Wrong API Endpoint**: Professional type sent to `/api/Professional/profile` instead of `/api/User` during user creation
3. **❌ Timing Issue**: Type should be sent when creating the user record, not during profile completion
4. **❌ No Profile Edit Page**: No UI for professionals to update their type after registration
5. **❌ Dashboard Missing Type Display**: Dashboard doesn't show current professional type
6. **❌ No Validation**: Form allows submission without selecting a type (though marked required)

---

## Goals & Success Criteria

### Frontend Goals
1. ✅ Fix enum value mismatch in `Models/User.ts`
2. ✅ Send professional type during user creation (to `/api/User`)
3. ✅ Display professional type in dashboard
4. ✅ Create profile edit page for updating professional type
5. ✅ Add proper validation for type selection
6. ✅ Add route for profile edit page

### Success Criteria
- [ ] Professional can select type during registration flow
- [ ] Selected type string (e.g., "Broker") is sent to `/api/User` endpoint
- [ ] Frontend enum matches backend: Advocate=1, Broker=2, Conveyancer=3, BuildAndPest=4
- [ ] Dashboard displays professional type with proper label
- [ ] Professional can navigate to edit profile page
- [ ] Edit profile page allows changing professional type
- [ ] Form validation prevents submission without type selection
- [ ] All TypeScript compiles without errors

---

## Technical Design (Frontend Only)

### Component Architecture

```
┌────────────────────────────────────────────────────┐
│  Models/User.ts                                    │
│  - ProfessionalTypeEnum (FIXED: 1,2,3,4)          │
│  - ProfessionalTypeEnumMapping (labels)           │
└────────────┬───────────────────────────────────────┘
             │ imported by
             ↓
┌────────────────────────────────────────────────────┐
│  ProfProfileCompletion.tsx                         │
│  Step 1: Business Details                         │
│  - Dropdown: Select professional type             │
│  - formData.professionalType: string              │
└────────────┬───────────────────────────────────────┘
             │ On registration
             │ POST /api/User
             │ { professionalType: "Broker" }
             ↓
┌────────────────────────────────────────────────────┐
│  Backend: UserController                           │
│  - Receives type string                           │
│  - Stores in database                             │
└────────────┬───────────────────────────────────────┘
             │ After successful registration
             ↓
┌────────────────────────────────────────────────────┐
│  ProfessionalDashboard.tsx                         │
│  - Displays: "Type: Mortgage Broker"              │
│  - Button: "Edit Profile" → navigate to edit page │
└────────────┬───────────────────────────────────────┘
             │ Click "Edit Profile"
             ↓
┌────────────────────────────────────────────────────┐
│  ProfessionalProfileEdit.tsx (NEW)                 │
│  - Pre-filled form with current data              │
│  - Can change professional type                   │
│  - PUT /api/Professional { professionalType }     │
└────────────────────────────────────────────────────┘
```

### Data Flow (Frontend Perspective)

**1. Registration Flow (FIXED)**:
```typescript
// User registers → ProfProfileCompletion.tsx
1. Professional selects "Mortgage Broker" from dropdown
2. Form stores: formData.professionalType = "Broker" (enum string name)
3. On first step completion:
   - POST /api/User
   - Body: { professionalType: "Broker" }
4. Backend creates user with correct ProfessionalTypeId = 2
5. Remaining profile steps complete other details
6. Navigate to /professionaldashboard
```

**2. Profile View Flow**:
```typescript
// ProfessionalDashboard.tsx
1. useContext(UserContext) → get user data
2. Display: user.ProfessionType → "Broker"
3. Use ProfessionalTypeEnumMapping to show: "Mortgage Broker"
4. Show "Edit Profile" button
```

**3. Profile Update Flow (NEW)**:
```typescript
// ProfessionalProfileEdit.tsx
1. Load current profile data via GET /api/User
2. Pre-populate form fields including professionalType
3. Professional changes type from "Broker" to "Advocate"
4. On submit:
   - PUT /api/Professional
   - Body: { ..., professionalType: "Advocate" }
5. Backend updates ProfessionalTypeId = 1
6. Refresh UserContext
7. Navigate back to dashboard
```

### API Integration Points

| Action | Method | Endpoint | Request Body | Frontend File |
|--------|--------|----------|--------------|---------------|
| Create user with type | POST | `/api/User` | `{ professionalType: "Broker" }` | `ProfProfileCompletion.tsx` |
| Get current profile | GET | `/api/User` | - | `ProfessionalProfileEdit.tsx` |
| Update profile | PUT | `/api/Professional` | `{ professionalType: "Advocate", ... }` | `ProfessionalProfileEdit.tsx` |

### Enum Mapping Strategy

**Frontend must send enum NAME (string), not value (number)**:

```typescript
// ✅ CORRECT
{ professionalType: "Broker" }        // Backend can parse this
{ professionalType: "Advocate" }

// ❌ WRONG
{ professionalType: 2 }               // Backend expects string
{ professionalType: "Mortgage Broker" } // Backend expects enum name
```

---

## Implementation Steps

### Phase 1: Fix Enum Synchronization (2 hours)

#### Step 1.1: Align Frontend Enum with Backend
**File**: `frontend/realty-reach-main/src/Models/User.ts`

**Change**:
```typescript
// BEFORE (WRONG)
export enum ProfessionalTypeEnum {
  Advocate = 1,
  Conveyancer = 2,
  BuildAndPest = 3,
  Broker = 4
}

// AFTER (CORRECT - matches backend)
export enum ProfessionalTypeEnum {
  Advocate = 1,
  Broker = 2,
  Conveyancer = 3,
  BuildAndPest = 4
}
```

**Testing**: 
- Verify all frontend references still work
- Check `CreateJobForm.tsx` buying stages mapping
- Ensure `ProfessionalTypeEnumMapping` displays correct labels

#### Step 1.2: Create Backend DTO for Professional Creation
**File**: `RealtyReachApi/Dtos/ProfessionalDTO.cs`

**Add**:
```csharp
public class CreateProfessionalDto
{
    [Required]
    public Guid Id { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    public string ProfessionalType { get; set; } // "Advocate", "Broker", "Conveyancer", "BuildAndPest"
    
    public bool FirstLogin { get; set; } = true;
}
```

**Rationale**: Separate DTO for creation vs. full profile prevents confusion

---

### Phase 2: Accept Professional Type from Frontend (3 hours)

#### Step 2.1: Update UserController to Accept Type
**File**: `RealtyReachApi/Controllers/UserController.cs`

**Change** (lines 58-70):
```csharp
// BEFORE
else if (role == "Professional")
{
    var professional = new ProfessionalDto
    {
        Id = userId,
        Email = email,
        ProfessionalType = "Advocate", //TODO: Accept Values from frontend
        FirstLogin = true
    };
    await _professionalService.CreateProfessionalAsync(professional);
    return Ok("Success");
}

// AFTER
else if (role == "Professional")
{
    // Read professional type from request body
    var createDto = await Request.ReadFromJsonAsync<CreateProfessionalDto>();
    
    if (createDto == null || string.IsNullOrEmpty(createDto.ProfessionalType))
    {
        return BadRequest("Professional type is required.");
    }
    
    // Validate professional type
    if (!Enum.TryParse<ProfessionalType.ProfessionalTypeEnum>(
        createDto.ProfessionalType, out var typeEnum))
    {
        return BadRequest($"Invalid professional type: {createDto.ProfessionalType}. " +
            "Valid types: Advocate, Broker, Conveyancer, BuildAndPest");
    }
    
    var professional = new ProfessionalDto
    {
        Id = userId,
        Email = email,
        ProfessionalType = createDto.ProfessionalType,
        FirstLogin = true
    };
    
    await _professionalService.CreateProfessionalAsync(professional);
    return Ok(new { Message = "Success", ProfessionalType = createDto.ProfessionalType });
}
```

**Validation Rules**:
- Professional type must be provided
- Must match one of the enum values (case-sensitive)
- Return 400 Bad Request with helpful message if invalid

#### Step 2.2: Update Frontend to Send Professional Type
**File**: `frontend/realty-reach-main/src/Pages/RegisterPage/ProfProfileCompletion.tsx`

**Find the submission function** (around line 100-150) and update:

```typescript
// In handleSubmit function
const handleSubmit = async () => {
  setIsSubmitting(true);
  setSubmitError("");
  
  try {
    // First, create user in main database with professional type
    const createUserResponse = await backendApi.post('/api/User', {
      professionalType: formData.professionalType // ADD THIS LINE
    });
    
    // Then update profile details
    const profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      companyName: formData.companyName,
      abn: formData.abn,
      licenseNumber: formData.licenseNumber,
      // ... other fields
    };
    
    await backendApi.put(`/api/User/professional/${user?.Id}`, profileData);
    
    // Navigate to dashboard
    navigate('/professionaldashboard');
    
  } catch (error) {
    console.error("Profile completion error:", error);
    setSubmitError("Failed to complete profile. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};
```

**Validation on Frontend**:
```typescript
const validateForm = (): boolean => {
  const errors: Record<string, string> = {};
  
  if (!formData.professionalType) {
    errors.professionalType = "Please select your professional type";
  }
  
  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
  }
  
  // ... other validations
  
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};
```

---

### Phase 3: Implement Professional Profile Update (3-4 hours)

#### Step 3.1: Implement UpdateProfessionalAsync Service
**File**: `RealtyReachApi/Services/ProfessionalService.cs`

**Replace** (line 40):
```csharp
// BEFORE
public async Task UpdateProfessionalAsync(Guid id, Professional updatedProfessional)
{
    throw new NotImplementedException();
}

// AFTER
public async Task UpdateProfessionalAsync(Guid id, UpdateProfessionalDto updateDto)
{
    var professional = await _repository.GetProfessionalByIdAsync(id);
    
    if (professional == null)
    {
        throw new KeyNotFoundException($"Professional with ID {id} not found");
    }
    
    // Update fields if provided
    if (!string.IsNullOrEmpty(updateDto.FirstName))
        professional.FirstName = updateDto.FirstName;
        
    if (!string.IsNullOrEmpty(updateDto.LastName))
        professional.LastName = updateDto.LastName;
        
    if (!string.IsNullOrEmpty(updateDto.CompanyName))
        professional.CompanyName = updateDto.CompanyName;
        
    if (!string.IsNullOrEmpty(updateDto.ABN))
        professional.ABN = updateDto.ABN;
        
    if (!string.IsNullOrEmpty(updateDto.LicenseNumber))
        professional.LicenseNumber = updateDto.LicenseNumber;
    
    // Update professional type if provided
    if (!string.IsNullOrEmpty(updateDto.ProfessionalType))
    {
        if (Enum.TryParse<ProfessionalType.ProfessionalTypeEnum>(
            updateDto.ProfessionalType, out var typeEnum))
        {
            professional.ProfessionalTypeId = (int)typeEnum;
        }
        else
        {
            throw new ArgumentException(
                $"Invalid professional type: {updateDto.ProfessionalType}");
        }
    }
    
    // Update collections if provided
    if (updateDto.Regions != null)
        professional.Regions = updateDto.Regions;
        
    if (updateDto.States != null)
        professional.States = updateDto.States;
        
    if (updateDto.Specialisations != null)
        professional.Specialisations = updateDto.Specialisations;
    
    // Mark FirstLogin as false
    professional.FirstLogin = false;
    
    await _repository.UpdateProfessionalAsync(professional);
}
```

#### Step 3.2: Create UpdateProfessionalDto
**File**: `RealtyReachApi/Dtos/ProfessionalDTO.cs`

**Add**:
```csharp
public class UpdateProfessionalDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? CompanyName { get; set; }
    public string? ABN { get; set; }
    public string? LicenseNumber { get; set; }
    public string? ProfessionalType { get; set; } // Optional - only if changing
    public List<string>? Regions { get; set; }
    public List<AustralianState>? States { get; set; }
    public List<Specialisation>? Specialisations { get; set; }
}
```

#### Step 3.3: Update ProfessionalController
**File**: `RealtyReachApi/Controllers/ProfessionalController.cs`

**Replace** (lines 27-34):
```csharp
// BEFORE
[HttpPut]
public async Task<IActionResult> UpdateProfessional([FromBody] Professional professional)
{
    var userId = Guid.Parse(GetUserIdFromToken());
    await _professionalService.UpdateProfessionalAsync(userId, professional);
    return Ok("Professional updated successfully.");
}

// AFTER
[HttpPut]
public async Task<IActionResult> UpdateProfessional([FromBody] UpdateProfessionalDto updateDto)
{
    var userId = Guid.Parse(GetUserIdFromToken());
    
    try
    {
        await _professionalService.UpdateProfessionalAsync(userId, updateDto);
        
        // Fetch updated profile to return
        var updatedProfile = await _professionalService.GetProfessionalByIdAsync(userId);
        
        return Ok(new 
        { 
            Message = "Professional updated successfully.",
            Professional = updatedProfile
        });
    }
    catch (KeyNotFoundException ex)
    {
        return NotFound(ex.Message);
    }
    catch (ArgumentException ex)
    {
        return BadRequest(ex.Message);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}
```

#### Step 3.4: Update Repository Interface
**File**: `RealtyReachApi/Repositories/IProfessionalRepository.cs`

**Ensure this method exists**:
```csharp
public interface IProfessionalRepository
{
    // ... existing methods
    Task<bool> UpdateProfessionalAsync(Professional professional);
}
```

**File**: `RealtyReachApi/Repositories/ProfessionalRepository.cs`

**Implement if missing**:
```csharp
public async Task<bool> UpdateProfessionalAsync(Professional professional)
{
    _context.Professionals.Update(professional);
    var result = await _context.SaveChangesAsync();
    return result > 0;
}
```

---

### Phase 4: Frontend Profile Edit UI (2-3 hours)

#### Step 4.1: Create Professional Profile Edit Page
**File**: `frontend/realty-reach-main/src/Pages/UserDashboard/ProfessionalProfileEdit.tsx`

**Create new file**:
```typescript
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/userContext';
import { ProfessionalTypeEnum, ProfessionalTypeEnumMapping } from '../../Models/User';
import { backendApi } from '../../api/backendApi';

const ProfessionalProfileEdit: React.FC = () => {
  const { user, refreshUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    abn: '',
    licenseNumber: '',
    professionalType: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await backendApi.get('/api/User');
      const data = response.data;
      
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        companyName: data.companyName || '',
        abn: data.abn || '',
        licenseNumber: data.licenseNumber || '',
        professionalType: data.professionalType || ''
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await backendApi.put('/api/Professional', formData);
      setSuccess('Profile updated successfully!');
      await refreshUser(); // Refresh user context
      
      setTimeout(() => navigate('/professionaldashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          Edit Professional Profile
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Professional Type"
                  value={formData.professionalType}
                  onChange={(e) => setFormData({ ...formData, professionalType: e.target.value })}
                  required
                  helperText="Select your primary service type"
                >
                  {Object.entries(ProfessionalTypeEnumMapping).map(([key, label]) => (
                    <MenuItem key={key} value={ProfessionalTypeEnum[key as any]}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ABN"
                  value={formData.abn}
                  onChange={(e) => setFormData({ ...formData, abn: e.target.value })}
                  helperText="Australian Business Number"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="License Number"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                    fullWidth
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/professionaldashboard')}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfessionalProfileEdit;
```

#### Step 4.2: Add Route for Profile Edit
**File**: `frontend/realty-reach-main/src/RoutesConfig.tsx`

**Add route** (around line 60):
```typescript
<Route
  path="/professional/profile/edit"
  element={
    <ProtectedRoute allowedRoles={["Professional"]}>
      <ProfessionalProfileEdit />
    </ProtectedRoute>
  }
/>
```

#### Step 4.3: Add Edit Button to Dashboard
**File**: `frontend/realty-reach-main/src/Pages/UserDashboard/ProfessionalDashboard.tsx`

**Add button** to display professional type and allow editing:
```typescript
<Box display="flex" alignItems="center" gap={2}>
  <Typography variant="h6">
    Type: {ProfessionalTypeEnumMapping[user?.ProfessionType as ProfessionalTypeEnum] || 'Not Set'}
  </Typography>
  <Button
    variant="outlined"
    size="small"
    onClick={() => navigate('/professional/profile/edit')}
  >
    Edit Profile
  </Button>
</Box>
```

---

## Testing Strategy

### Unit Tests

#### Backend Tests
**File**: `RealtyReachApi.Tests/Services/ProfessionalServiceTests.cs`

```csharp
public class ProfessionalServiceTests
{
    [Fact(DisplayName = "CreateProfessionalAsync with valid type stores correct ProfessionalTypeId")]
    public async Task CreateProfessionalAsync_WithValidType_StoresCorrectTypeId()
    {
        // Arrange
        var dto = new ProfessionalDto
        {
            Id = Guid.NewGuid(),
            Email = "test@example.com",
            ProfessionalType = "Broker",
            FirstLogin = true
        };
        
        // Act
        await _service.CreateProfessionalAsync(dto);
        
        // Assert
        var professional = await _repository.GetProfessionalByIdAsync(dto.Id);
        Assert.Equal(2, professional.ProfessionalTypeId); // Broker = 2
    }
    
    [Theory(DisplayName = "CreateProfessionalAsync validates professional type")]
    [InlineData("Advocate", 1)]
    [InlineData("Broker", 2)]
    [InlineData("Conveyancer", 3)]
    [InlineData("BuildAndPest", 4)]
    public async Task CreateProfessionalAsync_WithAllTypes_StoresCorrectIds(
        string typeName, int expectedId)
    {
        // Arrange
        var dto = new ProfessionalDto
        {
            Id = Guid.NewGuid(),
            Email = $"test{expectedId}@example.com",
            ProfessionalType = typeName,
            FirstLogin = true
        };
        
        // Act
        await _service.CreateProfessionalAsync(dto);
        
        // Assert
        var professional = await _repository.GetProfessionalByIdAsync(dto.Id);
        Assert.Equal(expectedId, professional.ProfessionalTypeId);
    }
    
    [Fact(DisplayName = "UpdateProfessionalAsync changes professional type")]
    public async Task UpdateProfessionalAsync_ChangesType_UpdatesSuccessfully()
    {
        // Arrange
        var professionalId = Guid.NewGuid();
        await SeedProfessional(professionalId, "Advocate");
        
        var updateDto = new UpdateProfessionalDto
        {
            ProfessionalType = "Broker"
        };
        
        // Act
        await _service.UpdateProfessionalAsync(professionalId, updateDto);
        
        // Assert
        var professional = await _repository.GetProfessionalByIdAsync(professionalId);
        Assert.Equal(2, professional.ProfessionalTypeId);
    }
}
```

#### Frontend Tests
**File**: `frontend/realty-reach-main/src/Pages/RegisterPage/ProfProfileCompletion.test.tsx`

```typescript
describe('ProfProfileCompletion', () => {
  test('sends selected professional type to backend', async () => {
    const mockPost = jest.spyOn(backendApi, 'post');
    
    render(<ProfProfileCompletion />);
    
    // Select professional type
    const typeSelect = screen.getByLabelText(/professional type/i);
    fireEvent.change(typeSelect, { target: { value: 'Broker' } });
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' }
    });
    
    // Submit
    fireEvent.click(screen.getByText(/complete profile/i));
    
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/api/User', {
        professionalType: 'Broker'
      });
    });
  });
  
  test('displays validation error when type not selected', async () => {
    render(<ProfProfileCompletion />);
    
    // Submit without selecting type
    fireEvent.click(screen.getByText(/complete profile/i));
    
    expect(await screen.findByText(/please select your professional type/i))
      .toBeInTheDocument();
  });
});
```

### Integration Tests

**File**: `RealtyReachApi.Tests/Integration/ProfessionalTypeFlowTests.cs`

```csharp
public class ProfessionalTypeFlowTests : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact(DisplayName = "Full flow: Register, Create User with Type, Update Type")]
    public async Task ProfessionalTypeFlow_EndToEnd_WorksCorrectly()
    {
        // 1. Register professional user
        var registerResponse = await _client.PostAsJsonAsync("/api/Auth/register", new
        {
            Email = "professional@test.com",
            Password = "Test123!",
            Role = "Professional"
        });
        Assert.True(registerResponse.IsSuccessStatusCode);
        
        // 2. Login and get token
        var loginResponse = await _client.PostAsJsonAsync("/api/Auth/login", new
        {
            Email = "professional@test.com",
            Password = "Test123!"
        });
        var loginData = await loginResponse.Content.ReadFromJsonAsync<LoginResponse>();
        _client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", loginData.Token);
        
        // 3. Create user with professional type
        var createResponse = await _client.PostAsJsonAsync("/api/User", new
        {
            ProfessionalType = "Advocate"
        });
        Assert.True(createResponse.IsSuccessStatusCode);
        
        // 4. Verify professional type is stored
        var getResponse = await _client.GetAsync("/api/User");
        var professional = await getResponse.Content.ReadFromJsonAsync<ProfessionalDto>();
        Assert.Equal("Advocate", professional.ProfessionalType);
        Assert.Equal(1, professional.ProfessionalTypeId);
        
        // 5. Update professional type
        var updateResponse = await _client.PutAsJsonAsync("/api/Professional", new
        {
            ProfessionalType = "Broker"
        });
        Assert.True(updateResponse.IsSuccessStatusCode);
        
        // 6. Verify update
        getResponse = await _client.GetAsync("/api/User");
        professional = await getResponse.Content.ReadFromJsonAsync<ProfessionalDto>();
        Assert.Equal("Broker", professional.ProfessionalType);
        Assert.Equal(2, professional.ProfessionalTypeId);
    }
}
```

### Manual Testing Checklist

- [ ] **Registration Flow**
  - [ ] Professional can select type from dropdown
  - [ ] Dropdown shows all 4 types with correct labels
  - [ ] Validation error appears if type not selected
  - [ ] Selected type is saved after submission
  
- [ ] **Profile Display**
  - [ ] Dashboard shows correct professional type
  - [ ] Type matches what was selected during registration
  
- [ ] **Profile Update**
  - [ ] Edit profile page loads with current type pre-selected
  - [ ] Can change to different type
  - [ ] Updated type saves successfully
  - [ ] Dashboard reflects new type after update
  
- [ ] **Error Handling**
  - [ ] Invalid type value returns 400 Bad Request
  - [ ] Helpful error message shown to user
  - [ ] Database constraints prevent invalid FK references
  
- [ ] **Matching Algorithm**
  - [ ] Jobs still match correctly with professionals of correct type
  - [ ] Changing professional type updates match eligibility

---

## Database Migrations

### Migration Required?
**Yes** - If `ProfessionalTypes` table doesn't have seed data

### Migration Script
**File**: Create via `dotnet ef migrations add SeedProfessionalTypes`

**Manual seed** (if needed):
```csharp
// In a migration or startup seed
protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.InsertData(
        table: "ProfessionalTypes",
        columns: new[] { "ProfessionalTypeId", "TypeName", "Description" },
        values: new object[,]
        {
            { 1, "Advocate", "Buyer's Advocate - Assists buyers in property purchase" },
            { 2, "Broker", "Mortgage Broker - Arranges home loans and financing" },
            { 3, "Conveyancer", "Conveyancer - Handles legal property transfers" },
            { 4, "BuildAndPest", "Building & Pest Inspector - Conducts property inspections" }
        });
}
```

---

## Deployment Plan

### Pre-Deployment Checklist
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Manual testing completed
- [ ] Code reviewed and approved
- [ ] Database migration tested on staging

### Deployment Steps
1. **Deploy database migration** (if needed)
   ```bash
   dotnet ef database update --project RealtyReachApi
   ```

2. **Deploy backend changes**
   - Build: `dotnet build realtyreach.sln`
   - Test: `dotnet test`
   - Deploy to staging environment
   - Verify API endpoints with Swagger

3. **Deploy frontend changes**
   - Build: `cd frontend/realty-reach-main && npm run build`
   - Test: `npm test`
   - Deploy to staging environment
   - Verify registration flow

4. **Smoke tests on staging**
   - Register new professional with each type
   - Verify type saves correctly
   - Update professional type
   - Verify matching still works

5. **Production deployment**
   - Deploy during low-traffic window
   - Monitor error logs for first hour
   - Verify first production professional creation

### Rollback Plan
If issues occur:
1. Revert backend deployment (UserController changes are safe - backward compatible)
2. Frontend can stay deployed (graceful degradation - defaults to Advocate)
3. No database rollback needed (data model unchanged)

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Enum mismatch breaks existing data** | Low | High | Verify no existing data relies on old frontend enum values |
| **Breaking change for mobile apps** | Medium | Medium | Version API, support both enum formats temporarily |
| **Performance impact from additional validation** | Low | Low | Validation is simple string parsing, negligible overhead |
| **Users confused by type change option** | Medium | Low | Add confirmation dialog when changing type |
| **Jobs matched to wrong professionals** | Low | Critical | Extensive testing of matching algorithm after type changes |

---

## Success Metrics

### Quantitative
- 100% of new professional registrations include professional type selection
- 0 validation errors related to professional type in production (first week)
- < 5% of professionals change their type after registration
- Professional profile update success rate > 95%

### Qualitative
- User feedback indicates type selection is clear and intuitive
- No customer complaints about mismatched professional types
- Support tickets related to professional type < 2 per week

---

## Future Enhancements

### Phase 2 (Post-MVP)
1. **Multi-Type Professionals**: Allow professionals to register for multiple types
   - Add `ProfessionalTypesMapping` junction table
   - Update matching algorithm to handle multiple types
   - UI shows all registered types as badges

2. **Type Change Audit Trail**: Track when professionals change types
   - Add `ProfessionalTypeHistory` table
   - Display history in admin panel
   - Alert customers if matched professional changes type

3. **Dynamic Professional Types**: Admin can add new types without code changes
   - Move enum to database-driven approach
   - Add admin UI for managing types
   - Auto-generate frontend enum from API

4. **Type-Specific Onboarding**: Customize registration based on selected type
   - Advocates: Upload licenses, service areas
   - Brokers: Lender relationships, loan types
   - Conveyancers: Jurisdictions, turnaround times
   - Inspectors: Certifications, inspection types

---

## Related Features

This feature enables or unblocks:
- **Feature 2.1**: Get Applicable Jobs (requires accurate professional type)
- **Feature 4.1**: Update Professional Profile (shares update infrastructure)
- **Feature 4.3**: Professional Verification (type-specific verification rules)
- **Feature 6.3**: Platform Configuration (journey stages map to professional types)

---

## Resources & References

### Documentation
- [DDD Architecture Guidelines](.github/instructions/dotnet-architecture-good-practices.instructions.md)
- [Project Charter](PROJECT_CHARTER.md)
- [Copilot Instructions](.github/copilot-instructions.md)

### Code References
- `RealtyReachApi/Models/ProfessionalType.cs` - Enum and entity
- `RealtyReachApi/Services/ProfessionalService.cs` - Business logic
- `frontend/src/Models/User.ts` - Frontend types
- `RealtyReachApi/Services/MatchingService.cs` - Uses professional type for matching

### External APIs
- None (internal feature only)

---

## Implementation Checklist

### Backend
- [ ] Fix `CreateProfessionalDto` DTO
- [ ] Update `UserController.CreateUser()` to accept type from request
- [ ] Add validation for professional type
- [ ] Implement `UpdateProfessionalAsync()` in service
- [ ] Create `UpdateProfessionalDto`
- [ ] Update `ProfessionalController.UpdateProfessional()`
- [ ] Update repository interface and implementation
- [ ] Write unit tests for service methods
- [ ] Write integration tests for full flow
- [ ] Update Swagger documentation

### Frontend
- [ ] Fix enum alignment in `Models/User.ts`
- [ ] Update `ProfProfileCompletion.tsx` to send type
- [ ] Add validation for professional type selection
- [ ] Create `ProfessionalProfileEdit.tsx` page
- [ ] Add route for profile edit page
- [ ] Add edit button to professional dashboard
- [ ] Display professional type in dashboard
- [ ] Write component tests
- [ ] Update TypeScript types

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsive testing

### Documentation
- [ ] Update API documentation
- [ ] Update user guide (if exists)
- [ ] Update developer documentation
- [ ] Create release notes

### Deployment
- [ ] Code review approved
- [ ] Deploy to staging
- [ ] Staging smoke tests pass
- [ ] Deploy to production
- [ ] Production smoke tests pass
- [ ] Monitor for 24 hours

---

**Document Version**: 1.0  
**Last Updated**: October 10, 2025  
**Status**: Ready for Implementation  
**Assigned To**: [Your Name]  
**Estimated Completion**: [Date]
