# Nexus Arena - Design System Documentation

## Overview
Nexus Arena uses a minimalistic, professional design system with a cool, soft color palette. The design emphasizes clarity, simplicity, and a modern aesthetic.

## Color Palette

### Primary Colors (Sky Blue)
The primary color is a vibrant sky blue used for main actions, links, and key UI elements.

- **Primary 50**: `#f0f9ff` - Lightest background tint
- **Primary 100**: `#e0f2fe` - Light background
- **Primary 200**: `#bae6fd` - Subtle accent
- **Primary 300**: `#7dd3fc` - Light accent
- **Primary 400**: `#38bdf8` - Medium accent
- **Primary 500**: `#0ea5e9` - **DEFAULT** - Main primary color
- **Primary 600**: `#0284c7` - Hover state
- **Primary 700**: `#0369a1` - Active state
- **Primary 800**: `#075985` - Dark variant
- **Primary 900**: `#0c4a6e` - Darkest variant

**Usage**: Buttons, links, badges, focus states, active elements

### Secondary Colors (Teal/Cyan)
The secondary color is a soothing teal used for complementary actions and accents.

- **Secondary 50**: `#f0fdfa` - Lightest background tint
- **Secondary 100**: `#ccfbf1` - Light background
- **Secondary 200**: `#99f6e4` - Subtle accent
- **Secondary 300**: `#5eead4` - Light accent
- **Secondary 400**: `#2dd4bf` - Medium accent
- **Secondary 500**: `#14b8a6` - **DEFAULT** - Main secondary color
- **Secondary 600**: `#0d9488` - Hover state
- **Secondary 700**: `#0f766e` - Active state
- **Secondary 800**: `#115e59` - Dark variant
- **Secondary 900**: `#134e4a` - Darkest variant

**Usage**: Secondary buttons, alternate badges, complementary accents

### Accent Colors (Cool Grays)
Neutral grays for backgrounds, borders, and subtle elements.

- **Accent 50**: `#f8fafc` - Lightest background
- **Accent 100**: `#f1f5f9` - Very light background
- **Accent 200**: `#e2e8f0` - Light border/divider
- **Accent 300**: `#cbd5e1` - Medium border
- **Accent 400**: `#94a3b8` - Darker border
- **Accent 500**: `#64748b` - **DEFAULT** - Medium gray
- **Accent 600**: `#475569` - Dark gray
- **Accent 700**: `#334155` - Darker gray
- **Accent 800**: `#1e293b` - Very dark gray
- **Accent 900**: `#0f172a` - Darkest gray

**Usage**: Borders, dividers, subtle backgrounds, disabled states

### Text Colors (Slate)
Text colors use Tailwind's slate palette for consistency.

- **Text Primary**: `text-slate-900` (`#0f172a`) - Main text, headings
- **Text Secondary**: `text-slate-600` (`#475569`) - Secondary text, descriptions
- **Text Tertiary**: `text-slate-400` (`#94a3b8`) - Tertiary text, placeholders, hints

**Usage**: 
- `text-slate-900`: Headings, important text, primary content
- `text-slate-600`: Body text, descriptions, secondary content
- `text-slate-400`: Placeholders, hints, disabled text, timestamps

### Semantic Colors
- **Success**: `#10b981` - Success states, positive feedback
- **Error**: `#ef4444` (red-500) - Error states, warnings
- **Warning**: `#f59e0b` (amber-500) - Warning states

### Background Colors
- **Background**: `#fafbfc` - Main page background (light cool gray)
- **Surface**: `#ffffff` - Card backgrounds, elevated surfaces
- **Border**: `#e2e8f0` - Standard border color

## Typography

### Font Families
- **Heading Font**: `Inter, system-ui, sans-serif` - All headings (h1-h6)
- **Body Font**: `Inter, system-ui, sans-serif` - Body text, paragraphs
- **Mono Font**: `JetBrains Mono, Monaco, monospace` - Code, room codes

### Font Weights
- **Normal**: `400` - Body text
- **Medium**: `500` - Buttons, labels
- **Semibold**: `600` - Headings, emphasized text
- **Bold**: `700` - Strong emphasis (rarely used)

### Font Sizes
- **xs**: `0.75rem` (12px) - Small text, captions
- **sm**: `0.875rem` (14px) - Secondary text, descriptions
- **base**: `1rem` (16px) - Body text (default)
- **lg**: `1.125rem` (18px) - Large body text
- **xl**: `1.25rem` (20px) - Small headings
- **2xl**: `1.5rem` (24px) - Medium headings
- **3xl**: `1.875rem` (30px) - Large headings
- **4xl**: `2.25rem` (36px) - Extra large headings
- **5xl**: `3rem` (48px) - Hero headings

## Spacing

### Standard Spacing Scale
- **1**: `0.25rem` (4px)
- **2**: `0.5rem` (8px)
- **3**: `0.75rem` (12px)
- **4**: `1rem` (16px)
- **6**: `1.5rem` (24px)
- **8**: `2rem` (32px)
- **12**: `3rem` (48px)
- **16**: `4rem` (64px)

### Common Spacing Patterns
- **Card Padding**: `p-6` (24px)
- **Section Spacing**: `mb-12` (48px)
- **Element Gap**: `gap-4` (16px)
- **Button Padding**: `py-3 px-6` (12px vertical, 24px horizontal)

## Border Radius

- **sm**: `0.25rem` (4px) - Small elements
- **md**: `0.375rem` (6px) - Medium elements
- **lg**: `0.5rem` (8px) - Large elements
- **xl**: `0.75rem` (12px) - **Standard** - Cards, inputs
- **2xl**: `1rem` (16px) - Large cards
- **3xl**: `1.5rem` (24px) - Extra large cards
- **full**: `9999px` - Pills, badges, avatars

## Shadows

### Shadow Scale
- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` - Subtle elevation
- **DEFAULT**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)` - Standard
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)` - Medium elevation
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` - Large elevation
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` - Extra large elevation

**Usage**:
- `shadow-sm`: Cards, inputs (default)
- `shadow-md`: Hover states, elevated cards
- `shadow-lg`: Modals, dropdowns (if needed)

## Components

### Buttons

#### Primary Button
```jsx
<button className="btn-primary">
  Primary Action
</button>
```
- Background: `bg-primary-500`
- Text: White
- Hover: `bg-primary-600`
- Active: `bg-primary-700`
- Border Radius: `rounded-xl` (12px)
- Padding: `py-3 px-6`

#### Secondary Button
```jsx
<button className="btn-secondary">
  Secondary Action
</button>
```
- Background: `bg-secondary-500`
- Text: White
- Hover: `bg-secondary-600`
- Active: `bg-secondary-700`

#### Outline Button
```jsx
<button className="btn-outline">
  Outline Action
</button>
```
- Background: Transparent
- Border: `border-primary-500`
- Text: `text-primary-600`
- Hover: `bg-primary-50`

#### Ghost Button
```jsx
<button className="btn-ghost">
  Ghost Action
</button>
```
- Background: Transparent
- Text: `text-slate-600`
- Hover: `bg-accent-100`, `text-slate-900`

### Cards

#### Standard Card
```jsx
<div className="card">
  Card Content
</div>
```
- Background: `bg-surface` (white)
- Border: `border border-border` (1px solid)
- Border Radius: `rounded-2xl` (16px)
- Padding: `p-6` (24px)
- Shadow: `shadow-sm`

#### Hover Card
```jsx
<div className="card-hover">
  Interactive Card
</div>
```
- Same as card, plus:
- Hover: `shadow-md`, `border-primary-200`
- Cursor: `cursor-pointer`

### Input Fields

```jsx
<input className="input-field" placeholder="Enter text..." />
```
- Background: `bg-surface` (white)
- Border: `border border-border`
- Focus Border: `border-primary-500`
- Border Radius: `rounded-xl` (12px)
- Padding: `px-4 py-3`
- Placeholder: `text-slate-400`
- Focus Ring: `ring-2 ring-primary-500`

### Badges

#### Primary Badge
```jsx
<span className="badge-primary">Badge</span>
```
- Background: `bg-primary-50`
- Text: `text-primary-700`
- Border: `border border-primary-200`
- Border Radius: `rounded-full`
- Padding: `px-3 py-1`

#### Secondary Badge
```jsx
<span className="badge-secondary">Badge</span>
```
- Background: `bg-secondary-50`
- Text: `text-secondary-700`
- Border: `border border-secondary-200`

#### Success Badge
```jsx
<span className="badge-success">Badge</span>
```
- Background: `bg-green-50`
- Text: `text-green-700`
- Border: `border border-green-200`

#### Accent Badge
```jsx
<span className="badge-accent">Badge</span>
```
- Background: `bg-accent-100`
- Text: `text-accent-700`
- Border: `border border-accent-300`

## Design Principles

### 1. Minimalism
- Clean, uncluttered interfaces
- Remove unnecessary elements
- Focus on essential functionality
- Use whitespace effectively

### 2. Consistency
- Consistent spacing throughout
- Uniform border radius
- Standardized component styles
- Predictable interaction patterns

### 3. Clarity
- Clear visual hierarchy
- Readable typography
- Sufficient contrast
- Obvious interactive elements

### 4. Professionalism
- Subtle, refined aesthetics
- No excessive animations
- Clean color palette
- Modern but timeless design

### 5. Accessibility
- Sufficient color contrast
- Focus states for keyboard navigation
- Clear interactive feedback
- Readable font sizes

## Layout Patterns

### Page Structure
```jsx
<div className="min-h-screen bg-background">
  {/* Header */}
  <div className="bg-surface border-b border-border px-4 py-4">
    {/* Header content */}
  </div>
  
  {/* Main Content */}
  <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
    {/* Page content */}
  </div>
</div>
```

### Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="card-hover">Card 1</div>
  <div className="card-hover">Card 2</div>
  <div className="card-hover">Card 3</div>
</div>
```

### Centered Content
```jsx
<div className="flex items-center justify-center min-h-screen">
  <div className="card max-w-md w-full">
    {/* Centered content */}
  </div>
</div>
```

## Animations

### Standard Transitions
- **Duration**: `200ms` (0.2s) for most interactions
- **Easing**: `ease-in-out` or `ease-out`
- **Properties**: `transition-all duration-200`

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

### Scale In
```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

## Responsive Design

### Breakpoints
- **sm**: `640px` - Small devices
- **md**: `768px` - Tablets
- **lg**: `1024px` - Laptops
- **xl**: `1280px` - Desktops
- **2xl**: `1536px` - Large desktops

### Common Patterns
- **Mobile First**: Design for mobile, enhance for larger screens
- **Hide on Mobile**: `hidden lg:block` - Hide on mobile, show on desktop
- **Stack on Mobile**: `flex-col md:flex-row` - Stack on mobile, row on desktop
- **Responsive Text**: `text-2xl sm:text-3xl lg:text-4xl`

## Icon Usage

### Icon Libraries
- **Lucide React**: Primary icon library
- **Size**: Typically `w-5 h-5` (20px) for standard icons
- **Color**: Inherit text color or use semantic colors

### Common Icon Sizes
- **Small**: `w-4 h-4` (16px) - Inline with text
- **Standard**: `w-5 h-5` (20px) - Buttons, lists
- **Large**: `w-6 h-6` (24px) - Headings, cards
- **Extra Large**: `w-8 h-8` (32px) - Hero sections

## Best Practices

### Do's
✅ Use consistent spacing (multiples of 4px)
✅ Maintain proper contrast ratios
✅ Use semantic HTML elements
✅ Provide clear visual feedback
✅ Keep animations subtle
✅ Use consistent border radius
✅ Follow the color palette
✅ Maintain whitespace

### Don'ts
❌ Don't use excessive gradients
❌ Don't over-animate elements
❌ Don't use too many colors
❌ Don't ignore focus states
❌ Don't use inconsistent spacing
❌ Don't mix design patterns
❌ Don't use overly bright colors
❌ Don't clutter interfaces

## Color Usage Guidelines

### Primary Color (Sky Blue)
- Use for: Primary actions, links, active states, focus rings
- Avoid: Large background areas, text (use for accents only)

### Secondary Color (Teal)
- Use for: Secondary actions, complementary accents, badges
- Avoid: Primary CTAs (use primary instead)

### Accent Colors (Grays)
- Use for: Borders, dividers, subtle backgrounds, disabled states
- Avoid: Primary text (use slate for text)

### Text Colors (Slate)
- Use for: All text content
- Primary: Headings, important text
- Secondary: Body text, descriptions
- Tertiary: Placeholders, hints, timestamps

## Component Examples

### Button Group
```jsx
<div className="flex gap-3">
  <button className="btn-primary">Primary</button>
  <button className="btn-secondary">Secondary</button>
  <button className="btn-outline">Outline</button>
</div>
```

### Form Input
```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-slate-900">
    Email
  </label>
  <input
    type="email"
    className="input-field"
    placeholder="your@email.com"
  />
</div>
```

### Card with Badge
```jsx
<div className="card">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-slate-900">Title</h3>
    <span className="badge-primary">New</span>
  </div>
  <p className="text-slate-600">Description text</p>
</div>
```

## File Structure

### Styles
- **Main CSS**: `frontend/src/index.css`
- **Tailwind Config**: `frontend/tailwind.config.js`
- **Component Styles**: Inline Tailwind classes

### Components
- **Pages**: `frontend/src/pages/`
- **Layout**: `frontend/src/components/layout/`
- **Common**: `frontend/src/components/common/`
- **Games**: `frontend/src/components/games/`

## Updates and Maintenance

### When Adding New Components
1. Follow existing patterns
2. Use standard color palette
3. Maintain consistent spacing
4. Use semantic HTML
5. Add proper focus states
6. Test responsiveness

### When Modifying Colors
1. Update this document
2. Update Tailwind config
3. Test contrast ratios
4. Update component examples
5. Document changes

## Resources

### Design Tools
- **Figma**: For design mockups (if used)
- **Tailwind CSS**: For styling
- **Framer Motion**: For animations

### Color Tools
- **Coolors**: For color palette generation
- **Contrast Checker**: For accessibility testing

### Documentation
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev

---

**Last Updated**: January 2025
**Version**: 2.0 (Minimalistic Design System)
**Maintained By**: Development Team

