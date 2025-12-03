# UI Components Library Documentation

## Overview

The RealtyReach application includes a comprehensive library of reusable UI components built on Material-UI 5 with consistent theming. These components provide a foundation for building consistent user interfaces across the application.

## Components Reference

### 1. PageContainer

**Purpose**: Main content wrapper for pages with consistent padding and max-width.

**Props**:

- `children` (React.ReactNode): Page content
- `maxWidth` ('xs' | 'sm' | 'md' | 'lg' | 'xl'): Container max-width (default: 'lg')
- Standard `ContainerProps` from Material-UI

**Usage**:

```tsx
<PageContainer maxWidth="lg">{/* Page content */}</PageContainer>
```

**Features**:

- Responsive padding (2px on mobile, 3px on desktop)
- Vertical padding of 4 units
- Proper max-width constraints

---

### 2. PageHeader

**Purpose**: Consistent page header with title, subtitle, description, and actions.

**Props**:

- `title` (string): Main page title
- `subtitle` (string, optional): Secondary title
- `description` (string, optional): Additional description text
- `actions` (React.ReactNode, optional): Right-side action buttons
- Standard `StackProps` from Material-UI

**Usage**:

```tsx
<PageHeader
  title="Dashboard"
  subtitle="Welcome back"
  description="Manage your jobs and professionals"
  actions={<Button variant="contained">New Job</Button>}
/>
```

**Features**:

- Responsive layout (column on mobile, row on desktop)
- Bottom border for visual separation
- Flexible content alignment
- Automatic spacing management

---

### 3. LoadingSpinner

**Purpose**: Consistent loading state indicator.

**Props**:

- `message` (string, optional): Loading message (default: 'Loading...')
- `fullHeight` (boolean, optional): Use full viewport height (default: false)
- `size` (number, optional): Spinner size in pixels (default: 48)

**Usage**:

```tsx
{
  isLoading ? (
    <LoadingSpinner message="Loading your jobs..." fullHeight />
  ) : (
    <YourContent />
  );
}
```

**Features**:

- Centered spinner and message
- Configurable size and message
- Optional full-height layout for page-level loading

---

### 4. ErrorAlert

**Purpose**: Display error messages with optional retry action.

**Props**:

- `message` (string): Error message text
- `title` (string, optional): Alert title (default: 'Error')
- `onRetry` (function, optional): Callback for retry button
- `onClose` (function, optional): Callback for closing alert
- Standard `AlertProps` from Material-UI

**Usage**:

```tsx
{
  error && (
    <ErrorAlert
      title="Failed to Load Jobs"
      message={error}
      onRetry={handleRetry}
      onClose={() => setError(null)}
    />
  );
}
```

**Features**:

- Red error styling (from theme)
- Optional retry button
- Dismissible with close button
- Professional error message formatting

---

### 5. SuccessAlert

**Purpose**: Display success messages.

**Props**:

- `message` (string): Success message text
- `title` (string, optional): Alert title
- `onClose` (function, optional): Callback for closing alert
- Standard `AlertProps` from Material-UI

**Usage**:

```tsx
{
  successMessage && (
    <SuccessAlert
      title="Success"
      message={successMessage}
      onClose={() => setSuccessMessage(null)}
    />
  );
}
```

**Features**:

- Green success styling (from theme)
- Dismissible with close button
- Optional title for additional context

---

### 6. WarningAlert

**Purpose**: Display warning messages.

**Props**:

- `message` (string): Warning message text
- `title` (string, optional): Alert title
- `onClose` (function, optional): Callback for closing alert
- Standard `AlertProps` from Material-UI

**Usage**:

```tsx
<WarningAlert
  title="Warning"
  message="Please review this information carefully"
  onClose={() => setWarning(null)}
/>
```

**Features**:

- Orange warning styling (from theme)
- Dismissible with close button
- High-visibility styling

---

### 7. ActionButton

**Purpose**: Primary action button with loading state.

**Props**:

- `label` (string): Button text
- `isLoading` (boolean, optional): Show loading spinner (default: false)
- `icon` (React.ReactNode, optional): Button icon
- Standard `ButtonProps` from Material-UI

**Usage**:

```tsx
<ActionButton
  label="Save Job"
  icon={<SaveIcon />}
  isLoading={isSaving}
  onClick={handleSave}
/>
```

**Features**:

- Contained primary button styling
- Loading state with spinner
- Icon support
- Auto-disable during loading

---

### 8. SecondaryActionButton

**Purpose**: Secondary action button with outline style.

**Props**:

- `label` (string): Button text
- `icon` (React.ReactNode, optional): Button icon
- Standard `ButtonProps` from Material-UI

**Usage**:

```tsx
<SecondaryActionButton
  label="Cancel"
  icon={<CancelIcon />}
  onClick={handleCancel}
/>
```

**Features**:

- Outlined primary button styling
- Icon support
- Subtle but visible styling

---

### 9. EmptyState

**Purpose**: Display when no content is available.

**Props**:

- `icon` (React.ReactNode, optional): Large icon or illustration
- `title` (string): Empty state title
- `description` (string, optional): Additional description
- `action` (React.ReactNode, optional): Action button or link

**Usage**:

```tsx
{
  jobs.length === 0 && (
    <EmptyState
      icon={<BusinessIcon sx={{ fontSize: 64 }} />}
      title="No Jobs Found"
      description="Create your first job to get started"
      action={
        <Button variant="contained" onClick={handleCreate}>
          Create Job
        </Button>
      }
    />
  );
}
```

**Features**:

- Centered layout with dashed border
- Large icon for visual appeal
- Optional description and action
- Professional empty state design

---

## Theme Integration

All components automatically use the centralized theme from `/src/theme/theme.ts`:

- **Colors**: Primary, secondary, success, warning, error from `colors.ts`
- **Typography**: Heading, body, caption styles defined in theme
- **Spacing**: Consistent padding and margins based on theme spacing
- **Elevation**: Shadows and elevation levels from theme

## Usage Patterns

### Pattern 1: Page with Loading and Error States

```tsx
import {
  PageContainer,
  PageHeader,
  LoadingSpinner,
  ErrorAlert,
} from "@/SharedComponents/UIComponents";

export const MyPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <PageContainer>
      <PageHeader title="My Page" />

      {error && (
        <ErrorAlert message={error} onRetry={() => window.location.reload()} />
      )}

      {loading ? <LoadingSpinner message="Loading..." /> : <YourContent />}
    </PageContainer>
  );
};
```

### Pattern 2: Empty State with Action

```tsx
import { EmptyState } from "@/SharedComponents/UIComponents";

export const JobsList: React.FC = () => {
  const [jobs, setJobs] = useState([]);

  return (
    <>
      {jobs.length === 0 ? (
        <EmptyState
          icon={<BusinessIcon />}
          title="No Jobs Yet"
          description="Create your first real estate job"
          action={<ActionButton label="Create Job" onClick={handleCreate} />}
        />
      ) : (
        <JobTable jobs={jobs} />
      )}
    </>
  );
};
```

### Pattern 3: Form with Loading

```tsx
import {
  ActionButton,
  SecondaryActionButton,
} from "@/SharedComponents/UIComponents";

export const JobForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await submitJob(data);
      // Show success
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Stack direction="row" spacing={2}>
        <ActionButton label="Save" isLoading={isSubmitting} type="submit" />
        <SecondaryActionButton label="Cancel" onClick={handleCancel} />
      </Stack>
    </form>
  );
};
```

## Styling with Theme

All components support the Material-UI `sx` prop for additional customization:

```tsx
<PageContainer sx={{ backgroundColor: "background.secondary" }}>
  <PageHeader
    title="Custom Styled Header"
    sx={{ borderColor: "primary.main", mb: 4 }}
  />
</PageContainer>
```

Access theme values in the `sx` prop using:

- `theme.palette.primary.main`
- `theme.palette.success.light`
- `theme.spacing(2)` for spacing units
- `theme.typography.h4` for typography

## Best Practices

1. **Use PageContainer** for all page-level content
2. **Use PageHeader** for consistent page titles
3. **Use LoadingSpinner** for async operations
4. **Use Alert components** for user feedback
5. **Use ActionButton** for primary actions
6. **Use EmptyState** when no content is available
7. **Avoid hardcoding colors** - use theme palette
8. **Use theme spacing** - `sx={{ p: 2, gap: 1 }}`

## Component Composition

You can compose components together for complex layouts:

```tsx
<PageContainer>
  <PageHeader
    title="Advanced Page"
    actions={
      <Stack direction="row" spacing={1}>
        <ActionButton label="New" />
        <SecondaryActionButton label="Settings" />
      </Stack>
    }
  />

  {error && <ErrorAlert message={error} />}
  {loading && <LoadingSpinner />}

  {data.length === 0 ? (
    <EmptyState title="No Data" action={<ActionButton label="Create" />} />
  ) : (
    <DataTable data={data} />
  )}
</PageContainer>
```

## Future Enhancements

Potential new components to add:

- DataTable with sorting and filtering
- FormField wrapper for consistent form inputs
- Breadcrumbs navigation
- Tabs component
- Modal dialog
- Tooltip wrapper
- Badge component
- Progress bar
- Skeleton loaders

---

_Last Updated: 2024_  
_Location: `/src/SharedComponents/UIComponents.tsx`_
