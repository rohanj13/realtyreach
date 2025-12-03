# Quick Start Guide - Using the RealtyReach Theme System

## For New Developers

Welcome to the RealtyReach team! Here's how to use the theme system when building pages and components.

## 5-Minute Setup

### 1. Create a New Page

Use `PageContainer` as the root wrapper:

```tsx
// Pages/MyNewPage.tsx
import { PageContainer, PageHeader } from "@/SharedComponents/UIComponents";

export const MyNewPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader title="My New Page" subtitle="Page description here" />
      {/* Your content */}
    </PageContainer>
  );
};
```

### 2. Add Loading States

Use `LoadingSpinner`:

```tsx
import { LoadingSpinner } from "@/SharedComponents/UIComponents";

{
  isLoading ? <LoadingSpinner message="Loading data..." /> : <YourContent />;
}
```

### 3. Handle Errors

Use `ErrorAlert`:

```tsx
import { ErrorAlert } from "@/SharedComponents/UIComponents";

{
  error && <ErrorAlert message={error} onRetry={() => refetch()} />;
}
```

### 4. Use Buttons

Use `ActionButton` and `SecondaryActionButton`:

```tsx
import { ActionButton, SecondaryActionButton } from '@/SharedComponents/UIComponents';

<ActionButton
  label="Save"
  icon={<SaveIcon />}
  isLoading={isSaving}
  onClick={handleSave}
/>

<SecondaryActionButton
  label="Cancel"
  onClick={handleCancel}
/>
```

### 5. Empty States

Use `EmptyState` for empty content:

```tsx
import { EmptyState } from "@/SharedComponents/UIComponents";

{
  items.length === 0 && (
    <EmptyState
      icon={<BusinessIcon />}
      title="No Items Found"
      description="Create your first item to get started"
      action={<ActionButton label="Create" />}
    />
  );
}
```

## Accessing Theme Colors

Use the Material-UI `sx` prop with theme palette:

```tsx
<Box sx={{ color: 'primary.main', bg: 'background.paper' }}>
  {/* Uses primary blue from theme */}
</Box>

<Box sx={{ color: 'success.main' }}>
  {/* Uses success green from theme */}
</Box>

<Box sx={{ color: 'error.main' }}>
  {/* Uses error red from theme */}
</Box>
```

**Available Colors**:

- `primary.main`, `primary.light`, `primary.dark`
- `secondary.main`, `secondary.light`, `secondary.dark`
- `success.main`, `warning.main`, `error.main`, `info.main`
- `text.primary`, `text.secondary`, `text.disabled`
- `background.paper`, `background.default`
- `divider`

## Using Theme in Custom Styles

Access the full theme in component styles:

```tsx
import { useTheme } from "@mui/material";

export const MyComponent: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        color: theme.palette.primary.main,
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
      }}
    >
      Styled with theme!
    </Box>
  );
};
```

## Common Patterns

### Pattern: Loading a List

```tsx
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.getItems();
      setItems(data);
    } catch (err) {
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  };
  fetchItems();
}, []);

return (
  <PageContainer>
    <PageHeader title="Items" />
    {error && <ErrorAlert message={error} onRetry={() => fetchItems()} />}
    {loading ? (
      <LoadingSpinner />
    ) : items.length === 0 ? (
      <EmptyState title="No items" />
    ) : (
      <ItemList items={items} />
    )}
  </PageContainer>
);
```

### Pattern: Form with Submission

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [successMessage, setSuccessMessage] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (data: FormData) => {
  try {
    setIsSubmitting(true);
    setError(null);
    await api.submitData(data);
    setSuccessMessage("Saved successfully!");
  } catch (err) {
    setError("Failed to save");
  } finally {
    setIsSubmitting(false);
  }
};

return (
  <PageContainer>
    {error && <ErrorAlert message={error} />}
    {successMessage && <SuccessAlert message={successMessage} />}
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <ActionButton label="Save" isLoading={isSubmitting} type="submit" />
    </form>
  </PageContainer>
);
```

## Don'ts (What to Avoid)

❌ **Don't hardcode colors**

```tsx
// Bad
<Box sx={{ color: '#1976d2' }}>
```

✅ **Do use theme colors**

```tsx
// Good
<Box sx={{ color: 'primary.main' }}>
```

---

❌ **Don't use Container directly**

```tsx
// Bad
<Container maxWidth="lg">
```

✅ **Do use PageContainer**

```tsx
// Good
<PageContainer maxWidth="lg">
```

---

❌ **Don't create custom buttons**

```tsx
// Bad
<Button variant="contained" color="primary">
```

✅ **Do use ActionButton**

```tsx
// Good
<ActionButton label="Submit" />
```

---

❌ **Don't show raw errors**

```tsx
// Bad
<Typography color="error">{error}</Typography>
```

✅ **Do use ErrorAlert**

```tsx
// Good
<ErrorAlert message={error} />
```

## Component Checklist

When creating a new page:

- ✅ Use `PageContainer` as root
- ✅ Use `PageHeader` for title
- ✅ Use `LoadingSpinner` for loading
- ✅ Use `ErrorAlert` for errors
- ✅ Use `ActionButton` for primary actions
- ✅ Use `EmptyState` when no content
- ✅ Use theme colors (no hardcoding)
- ✅ Use theme spacing (`sx={{ p: 2, gap: 1 }}`)

## Getting Help

### Find Documentation

- **Theme System**: `/docs/THEME_SYSTEM_IMPLEMENTATION.md`
- **Component Reference**: `/docs/UI_COMPONENTS_REFERENCE.md`
- **This Guide**: `/docs/QUICK_START_THEME.md`

### Find Examples

- **CustomerDashboard**: `/src/Pages/UserDashboard/CustomerDashboard.tsx`
- **JobMatches**: `/src/Pages/UserDashboard/JobMatches.tsx`
- **MyJobs**: `/src/Pages/UserDashboard/MyJobs.tsx`

### Find Components

- **UIComponents**: `/src/SharedComponents/UIComponents.tsx`
- **Theme Config**: `/src/theme/theme.ts`
- **Colors**: `/src/theme/colors.ts`

## TypeScript Support

All components have full TypeScript support with proper types:

```tsx
// All props are typed
import { PageContainer } from "@/SharedComponents/UIComponents";
import type { PageContainerProps } from "@/SharedComponents/UIComponents";

// TypeScript will catch errors
<PageContainer maxWidth="invalid" />; // Error: Type '"invalid"' is not assignable
```

## Performance Tips

1. **Memoize complex components**

```tsx
const MemoizedList = React.memo(ItemList);
```

2. **Use useCallback for handlers**

```tsx
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);
```

3. **Use useMemo for expensive operations**

```tsx
const filteredItems = useMemo(() => {
  return items.filter(/* expensive operation */);
}, [items]);
```

## Customizing Components

All components support the `sx` prop for additional styling:

```tsx
<PageContainer sx={{ maxWidth: 'md' }}>
  {/* Custom styles */}
</PageContainer>

<LoadingSpinner size={64} />

<ErrorAlert
  message="Error"
  sx={{ mt: 2, mb: 4 }}
/>
```

## Next Steps

1. **Read the full theme documentation**: `/docs/THEME_SYSTEM_IMPLEMENTATION.md`
2. **Review component examples**: Check existing pages using components
3. **Build your first page**: Use this guide as reference
4. **Ask questions**: Reach out to the team for clarification

---

**Last Updated**: 2024  
**Status**: Ready to use  
**Questions?** Check the full documentation or ask the team!
