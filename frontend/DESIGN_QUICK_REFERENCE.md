# Nexus Arena - Design Quick Reference

## Color Classes (Tailwind)

### Primary (Sky Blue)
```jsx
bg-primary-500    // Main primary color
bg-primary-600    // Hover state
text-primary-600  // Primary text
border-primary-500 // Primary border
```

### Secondary (Teal)
```jsx
bg-secondary-500    // Main secondary color
bg-secondary-600    // Hover state
text-secondary-600  // Secondary text
border-secondary-500 // Secondary border
```

### Text Colors
```jsx
text-slate-900  // Primary text (headings, important)
text-slate-600  // Secondary text (body, descriptions)
text-slate-400  // Tertiary text (placeholders, hints)
```

### Backgrounds
```jsx
bg-background  // Page background (#fafbfc)
bg-surface     // Card background (white)
bg-accent-50   // Subtle background
bg-accent-100  // Light background
```

## Common Component Classes

### Buttons
```jsx
btn-primary    // Primary button (sky blue)
btn-secondary  // Secondary button (teal)
btn-outline    // Outline button
btn-ghost      // Ghost button (minimal)
```

### Cards
```jsx
card          // Standard card
card-hover    // Interactive card with hover
```

### Inputs
```jsx
input-field   // Standard input field
```

### Badges
```jsx
badge-primary    // Primary badge
badge-secondary  // Secondary badge
badge-success    // Success badge
badge-accent     // Accent badge
```

## Spacing

### Padding
```jsx
p-4    // 16px (standard)
p-6    // 24px (cards)
px-6   // 24px horizontal
py-3   // 12px vertical
```

### Margins
```jsx
mb-4   // 16px bottom
mb-6   // 24px bottom
mb-12  // 48px bottom (sections)
```

### Gaps
```jsx
gap-3  // 12px
gap-4  // 16px (standard)
gap-6  // 24px
```

## Border Radius

```jsx
rounded-xl    // 12px (standard - buttons, inputs)
rounded-2xl   // 16px (cards)
rounded-full  // Pills, badges, avatars
```

## Shadows

```jsx
shadow-sm  // Subtle (cards, inputs)
shadow-md  // Medium (hover states)
shadow-lg  // Large (modals)
```

## Typography

### Headings
```jsx
text-2xl font-semibold text-slate-900  // h2
text-3xl font-semibold text-slate-900  // h1
text-lg font-semibold text-slate-900   // h3
```

### Body Text
```jsx
text-sm text-slate-600   // Small text
text-base text-slate-600 // Body text
text-slate-400           // Tertiary text
```

## Common Patterns

### Page Container
```jsx
<div className="min-h-screen bg-background">
  <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
    {/* Content */}
  </div>
</div>
```

### Card Layout
```jsx
<div className="card">
  <h3 className="text-lg font-semibold text-slate-900 mb-2">Title</h3>
  <p className="text-slate-600">Description</p>
</div>
```

### Button Group
```jsx
<div className="flex gap-3">
  <button className="btn-primary">Primary</button>
  <button className="btn-secondary">Secondary</button>
</div>
```

### Form Input
```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-slate-900">
    Label
  </label>
  <input className="input-field" placeholder="Placeholder" />
</div>
```

### Header Bar
```jsx
<div className="bg-surface border-b border-border px-4 py-4">
  <div className="max-w-6xl mx-auto flex items-center justify-between">
    {/* Header content */}
  </div>
</div>
```

## Icon Sizes

```jsx
w-4 h-4  // Small (16px)
w-5 h-5  // Standard (20px) - Most common
w-6 h-6  // Large (24px)
w-8 h-8  // Extra Large (32px)
```

## Responsive Classes

```jsx
hidden lg:block        // Hide on mobile, show on desktop
flex-col md:flex-row   // Stack on mobile, row on desktop
text-2xl sm:text-3xl   // Responsive text size
p-4 sm:p-6 lg:p-8      // Responsive padding
```

## Animation (Framer Motion)

### Fade In
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## Color Hex Codes

### Primary
- `#0ea5e9` - Primary 500 (main)
- `#0284c7` - Primary 600 (hover)
- `#0369a1` - Primary 700 (active)

### Secondary
- `#14b8a6` - Secondary 500 (main)
- `#0d9488` - Secondary 600 (hover)
- `#0f766e` - Secondary 700 (active)

### Backgrounds
- `#fafbfc` - Background
- `#ffffff` - Surface
- `#e2e8f0` - Border

### Text
- `#0f172a` - Slate 900 (primary)
- `#475569` - Slate 600 (secondary)
- `#94a3b8` - Slate 400 (tertiary)

## Quick Checklist

When creating a new component:
- [ ] Use standard color palette
- [ ] Consistent spacing (multiples of 4px)
- [ ] Proper border radius (xl for buttons, 2xl for cards)
- [ ] Appropriate text colors (slate-900/600/400)
- [ ] Subtle shadows (sm for cards)
- [ ] Focus states for interactive elements
- [ ] Responsive design (mobile first)
- [ ] Proper semantic HTML
- [ ] Accessibility considerations

## Common Mistakes to Avoid

❌ Using old color classes (`text-text-primary` - use `text-slate-900`)
❌ Inconsistent spacing
❌ Missing hover states
❌ No focus states
❌ Excessive animations
❌ Too many colors
❌ Inconsistent border radius
❌ Missing responsive classes

---

**For detailed documentation, see**: `DESIGN_SYSTEM.md`

