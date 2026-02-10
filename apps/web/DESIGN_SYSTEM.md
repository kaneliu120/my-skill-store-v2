# MySkillStore Design System Documentation

## Typography Scale

### Font Families

```css
--font-sans: Inter, Noto Sans SC, Noto Sans JP, Noto Sans KR, PingFang SC, Microsoft YaHei, Hiragino Sans GB, Noto Sans CJK SC, sans-serif
--font-mono: Geist Mono, monospace
```

**Usage:**
- **Primary (Latin)**: Inter - Used for English and other Latin-based languages
- **CJK Fallbacks**: Noto Sans SC/JP/KR - Optimized fonts for Chinese, Japanese, Korean
- **System Fallbacks**: PingFang SC, Microsoft YaHei, Hiragino Sans GB - Native system fonts for better performance
- **Universal CJK**: Noto Sans CJK SC - Final fallback for all CJK characters

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `font-normal` | 400 | Body text, descriptions |
| `font-medium` | 500 | Emphasized text, labels |
| `font-semibold` | 600 | Subheadings, important UI elements |
| `font-bold` | 700 | Headings, titles, CTAs |

**CSS Variables:**
```css
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### Font Sizes

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 0.75rem (12px) | 1rem | Small labels, captions |
| `text-sm` | 0.875rem (14px) | 1.25rem | Secondary text, descriptions |
| `text-base` | 1rem (16px) | 1.5rem | Body text (default) |
| `text-lg` | 1.125rem (18px) | 1.75rem | Emphasized body text |
| `text-xl` | 1.25rem (20px) | 1.75rem | Small headings |
| `text-2xl` | 1.5rem (24px) | 2rem | Section subheadings |
| `text-3xl` | 1.875rem (30px) | 2.25rem | Section headings |
| `text-4xl` | 2.25rem (36px) | 2.5rem | Page headings |
| `text-5xl` | 3rem (48px) | 1.16 | Hero headings |
| `text-6xl` | 3.75rem (60px) | 1 | Large display text |

**Responsive Typography Pattern:**
```tsx
// Mobile → Tablet → Desktop
<h1 className="text-2xl md:text-4xl lg:text-5xl">
```

---

## Spacing System

### Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 0.25rem (4px) | Tight spacing, icon gaps |
| `sm` | 0.5rem (8px) | Small gaps, compact layouts |
| `md` | 1rem (16px) | Standard spacing |
| `lg` | 1.5rem (24px) | Section spacing |
| `xl` | 2rem (32px) | Large section spacing |
| `2xl` | 3rem (48px) | Extra large spacing |
| `3xl` | 4rem (64px) | Hero sections, major divisions |

**CSS Variables:**
```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
--spacing-2xl: 3rem
--spacing-3xl: 4rem
```

**Usage Examples:**
```tsx
// Using Tailwind classes
<div className="gap-6">        // 24px gap
<div className="space-y-8">    // 32px vertical spacing
<div className="px-6 py-8">    // 24px horizontal, 32px vertical padding

// Using CSS variables
padding: var(--spacing-lg);
margin-bottom: var(--spacing-2xl);
```

### Common Spacing Patterns

**Section Padding:**
```tsx
// Mobile: 16px vertical, Desktop: 20px vertical
<section className="py-16 md:py-20">

// Mobile: 24px vertical, Desktop: 24px vertical
<section className="py-24">
```

**Container Padding:**
```tsx
// Horizontal padding: 24px on all screens
<div className="px-6">
```

**Component Spacing:**
```tsx
// Card spacing
<Card className="p-6">           // 24px padding
<CardContent className="pt-6">   // 24px top padding

// Stack spacing
<div className="space-y-6">      // 24px between children
<div className="space-y-8">      // 32px between children
```

---

## Container Widths

### Width Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `max-w-container-sm` | 640px | Narrow content (forms, single column) |
| `max-w-container-md` | 768px | Medium content |
| `max-w-container-lg` | 1024px | Standard content |
| `max-w-container-xl` | 1280px | Wide content |
| `max-w-container-2xl` | 1536px | Extra wide content |

### Standard Container Widths by Section

| Section | Max Width | Rationale |
|---------|-----------|-----------|
| Hero | `max-w-6xl` (1536px) | Wide layout for visual impact |
| Features | `max-w-6xl` | Consistent with hero |
| Product Grid | `max-w-6xl` | Accommodate 3-4 columns |
| How It Works | `max-w-6xl` | 4-column layout needs width |
| Blog Section | `max-w-6xl` | 3-column layout |
| FAQ | `max-w-4xl` (1280px) | Narrower for readability |
| Footer | `max-w-6xl` | Consistent with main content |

**Standard Container Pattern:**
```tsx
<div className="container mx-auto px-6 max-w-6xl">
  {/* Content */}
</div>
```

**FAQ/Form Pattern (Narrower):**
```tsx
<div className="container mx-auto px-6 max-w-4xl">
  {/* Content */}
</div>
```

---

## Grid Layouts

### Product Grid

```tsx
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

**Rationale:** 
- Mobile: Full width for better readability
- Tablet: 2 columns utilize space efficiently
- Desktop: 3 columns (not 4) for better card sizing

### Process Steps Grid

```tsx
// Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
```

**Rationale:**
- Mobile: Stack vertically
- Tablet: 2x2 grid
- Desktop: All 4 in a row

### Content Grid (2-column)

```tsx
// Mobile: 1 column, Desktop: 2 columns
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
```

### Product Detail Grid

```tsx
// Mobile: 1 column, Desktop: 2/3 + 1/3 split
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div className="md:col-span-2">{/* Main content */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

---

## Color System

### Brand Colors

```css
--color-purple-600: Primary brand color (buttons, links, accents)
--color-purple-700: Hover states
--color-purple-100: Light backgrounds
--color-purple-50: Very light backgrounds
```

### Semantic Colors

```css
--color-gray-900: Primary text
--color-gray-600: Secondary text
--color-gray-500: Tertiary text, placeholders
--color-gray-200: Borders
--color-gray-100: Light backgrounds
--color-gray-50: Very light backgrounds
```

### Usage Patterns

**Text:**
```tsx
<h1 className="text-gray-900">     // Headings
<p className="text-gray-600">      // Body text
<span className="text-gray-500">   // Secondary text
```

**Backgrounds:**
```tsx
<div className="bg-white">         // Cards, containers
<div className="bg-gray-50">       // Page backgrounds
<div className="bg-gray-100">      // Alternate sections
```

**Borders:**
```tsx
<div className="border border-gray-200">  // Standard borders
<div className="border-2 border-purple-200">  // Emphasized borders
```

---

## Border Radius

### Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | `calc(var(--radius) - 4px)` | Small elements |
| `rounded-md` | `calc(var(--radius) - 2px)` | Medium elements |
| `rounded-lg` | `var(--radius)` | Standard (10px) |
| `rounded-xl` | `calc(var(--radius) + 4px)` | Large elements |
| `rounded-2xl` | `calc(var(--radius) + 8px)` | Extra large |
| `rounded-3xl` | `calc(var(--radius) + 12px)` | Very large |
| `rounded-full` | `9999px` | Circles, pills |

**Base Radius:**
```css
--radius: 0.625rem; /* 10px */
```

### Usage Patterns

```tsx
<Button className="rounded-lg">        // Standard buttons
<Card className="rounded-xl">          // Cards
<Input className="rounded-lg">         // Form inputs
<Badge className="rounded-full">       // Pills, badges
<div className="rounded-2xl">          // Hero sections, large cards
```

---

## Responsive Breakpoints

### Tailwind Breakpoints

| Prefix | Min Width | Usage |
|--------|-----------|-------|
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large desktops |

### Mobile-First Approach

Always design for mobile first, then add responsive classes:

```tsx
// ✅ Good: Mobile first
<div className="text-2xl md:text-4xl lg:text-5xl">

// ❌ Bad: Desktop first
<div className="text-5xl lg:text-4xl md:text-2xl">
```

### Common Responsive Patterns

**Typography:**
```tsx
<h1 className="text-2xl md:text-4xl lg:text-5xl">
<p className="text-base md:text-lg">
```

**Spacing:**
```tsx
<section className="py-16 md:py-20">
<div className="px-4 md:px-6">
```

**Layout:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="flex flex-col md:flex-row">
```

**Visibility:**
```tsx
<div className="hidden md:block">      // Show on desktop only
<div className="block md:hidden">      // Show on mobile only
```

---

## Component Patterns

### Button Sizes

```tsx
<Button size="sm">    // Small: h-9 px-3 text-sm
<Button size="default"> // Default: h-10 px-4 text-base
<Button size="lg">    // Large: h-12 px-8 text-lg
```

### Card Spacing

```tsx
<Card>
  <CardHeader>        // Default padding
    <CardTitle>       // mb-2
  </CardHeader>
  <CardContent className="pt-6">  // 24px top padding
</Card>
```

### Input Heights

```tsx
<Input className="h-10">   // Standard input height
<Button className="h-10">  // Match input height
```

---

## Best Practices

### 1. Consistency

- Use design tokens instead of arbitrary values
- Follow established spacing patterns
- Maintain consistent container widths

### 2. Accessibility

- Maintain minimum font size of 14px (text-sm) for body text
- Ensure sufficient color contrast (WCAG AA minimum)
- Use semantic HTML elements

### 3. Performance

- Use `font-display: swap` for web fonts
- Optimize images and use appropriate formats
- Minimize layout shifts with consistent spacing

### 4. Multilingual Support

- Test with CJK languages (Chinese, Japanese, Korean)
- Allow for text expansion in translations (up to 30%)
- Use flexible layouts that accommodate longer text

### 5. Mobile-First

- Design for mobile viewports first (375px)
- Test on common breakpoints: 375px, 768px, 1024px, 1440px
- Ensure touch targets are at least 44x44px

---

## Quick Reference

### Common Spacing Values

- **4px**: `gap-1`, `p-1`, `m-1`
- **8px**: `gap-2`, `p-2`, `m-2`
- **16px**: `gap-4`, `p-4`, `m-4`
- **24px**: `gap-6`, `p-6`, `m-6`
- **32px**: `gap-8`, `p-8`, `m-8`
- **48px**: `gap-12`, `p-12`, `m-12`

### Common Font Sizes

- **12px**: `text-xs`
- **14px**: `text-sm`
- **16px**: `text-base`
- **18px**: `text-lg`
- **20px**: `text-xl`
- **24px**: `text-2xl`
- **30px**: `text-3xl`
- **36px**: `text-4xl`
- **48px**: `text-5xl`

### Common Container Widths

- **640px**: `max-w-container-sm` or `max-w-2xl`
- **768px**: `max-w-container-md` or `max-w-3xl`
- **1024px**: `max-w-container-lg` or `max-w-4xl`
- **1280px**: `max-w-container-xl` or `max-w-5xl`
- **1536px**: `max-w-container-2xl` or `max-w-6xl`
