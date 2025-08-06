# DashboardPreview Component

A simplified, purpose-built component for dashboard CV previews that replaced the over-engineered shared component approach.

## Key Simplifications

✅ **Removed unnecessary abstractions**:
- No `standalone` prop (dashboard previews are always single-page)
- No empty state handling (dashboard previews always have content)  
- No complex shared hooks/utils (simple, focused implementation)

✅ **Self-contained logic**:
- Built-in dashboard-specific scaling (0.2 to 0.5 scale range)
- Inline style generation (no external style generator)
- Direct HTML rendering (no separate page content component)

## Usage Examples

### For Saved CVs (from database):
```tsx
<DashboardPreview
  markdown={cvData.content}
  css={cvData.design}
  pageFormat={cvData.style.pageSize as "A4" | "Letter"}
  fontSize={cvData.style.fontSize}
  pagePadding={cvData.style.marginV}
  lineHeight={cvData.style.lineHeight}
  paragraphSpacing={cvData.style.paragraphSpace}
  themeColor={cvData.style.theme}
  variant="saved"  // Uses 'saved-cv-preview-content' CSS class
/>
```

### For Templates (built-in):
```tsx
<DashboardPreview
  markdown={template.markdown}
  css={template.css}
  variant="template"  // Uses 'cv-preview-content' CSS class (default)
/>
```

## Benefits of This Approach

1. **Simpler Code**: ~50% less code, easier to understand and maintain
2. **Purpose-Built**: Designed specifically for dashboard use case  
3. **Self-Contained**: No dependencies on complex shared components
4. **Better Performance**: Less abstraction overhead
5. **Easier Debugging**: All logic in one place

## Implementation Notes

- Fixed scale range (0.2-0.5) optimized for dashboard cards
- Assumes content always exists (no empty state needed)
- Single page rendering (no multi-page logic)  
- Tailwind classes for styling consistency