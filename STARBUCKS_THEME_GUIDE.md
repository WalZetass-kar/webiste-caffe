# Starbucks-Inspired Theme Implementation Guide

Panduan lengkap implementasi tema Starbucks untuk website manajemen kafe.

---

## 🎨 Color Palette

### Primary Colors
```css
--starbucks-dark: #1E3932;      /* Dark forest green-brown (Primary) */
--starbucks-green: #00704A;     /* Starbucks signature green */
--starbucks-cream: #F7F5F2;     /* Warm cream background */
--starbucks-beige: #E8DDD3;     /* Soft beige */
--starbucks-latte: #D4C5B9;     /* Latte brown */
--starbucks-accent: #00A862;    /* Fresh green accent */
--starbucks-gold: #CBA258;      /* Premium gold accent */
```

### Text Colors
```css
--text-primary: #1E3932;        /* Dark green-brown */
--text-secondary: #6B5D52;      /* Medium brown */
--text-muted: #9B8B7E;          /* Light brown */
```

### Usage Guide
- **Sidebar**: Dark green-brown (#1E3932)
- **Background**: Cream gradient (#F7F5F2 to #E8DDD3)
- **Cards**: White with subtle shadows
- **Buttons**: Starbucks green (#00704A)
- **Accents**: Fresh green (#00A862) sparingly
- **Text**: Dark green-brown for headings, medium brown for body

---

## 📐 Layout Structure

### Dashboard Layout
```
┌─────────────────────────────────────────┐
│  Sidebar (Dark)  │  Main Content Area   │
│  #1E3932         │  Cream Background    │
│                  │                      │
│  Navigation      │  Topbar              │
│  Menu Items      │  ─────────────────   │
│                  │  Content Cards       │
│                  │  (White, rounded)    │
└─────────────────────────────────────────┘
```

### Responsive Breakpoints
- Mobile: < 768px (sidebar hidden, mobile nav)
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🎯 Component Styles

### 1. Cards (Starbucks Style)
```tsx
<div className="starbucks-card">
  {/* Content */}
</div>
```

**CSS:**
```css
.starbucks-card {
  @apply rounded-2xl border border-[#D4C5B9]/40 bg-white shadow-lg transition-all duration-300;
}

.starbucks-card:hover {
  @apply shadow-2xl;
  transform: translateY(-4px);
}
```

**Features:**
- Large border-radius (rounded-2xl)
- Subtle border
- White background
- Smooth hover effect
- Lift on hover

### 2. Buttons (Starbucks Style)
```tsx
<button className="starbucks-button">
  Click Me
</button>
```

**CSS:**
```css
.starbucks-button {
  @apply rounded-full bg-[#00704A] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300;
}

.starbucks-button:hover {
  @apply bg-[#00A862] shadow-lg;
  transform: translateY(-2px);
}
```

**Features:**
- Fully rounded (rounded-full)
- Starbucks green
- Bold text
- Lift on hover
- Color change on hover

### 3. Inputs (Starbucks Style)
```tsx
<input className="starbucks-input" />
```

**CSS:**
```css
.starbucks-input {
  @apply rounded-xl border border-[#D4C5B9] bg-white px-4 py-3 text-[#1E3932] transition-all duration-200 focus:border-[#00704A] focus:ring-2 focus:ring-[#00704A]/20;
}
```

**Features:**
- Rounded corners
- Subtle border
- Green focus state
- Smooth transitions

---

## 🔤 Typography

### Font Stack
```css
/* Body Text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Headings */
font-family: 'Playfair Display', Georgia, serif;
```

### Font Sizes & Weights
```css
/* Headings */
h1: text-4xl font-bold (36px)
h2: text-3xl font-bold (30px)
h3: text-2xl font-bold (24px)
h4: text-xl font-semibold (20px)

/* Body */
body: text-base (16px)
small: text-sm (14px)
tiny: text-xs (12px)

/* Weights */
Regular: 400
Medium: 500
Semibold: 600
Bold: 700
```

### Text Hierarchy
```tsx
<h1 className="text-4xl font-bold text-[#1E3932]">Main Title</h1>
<h2 className="text-3xl font-bold text-[#1E3932]">Section Title</h2>
<p className="text-base text-[#6B5D52]">Body text</p>
<span className="text-sm text-[#9B8B7E]">Muted text</span>
```

---

## 🎭 Text Overflow Prevention

### Truncate Single Line
```tsx
<p className="truncate">Long text here...</p>
```

### Clamp Multiple Lines
```tsx
<p className="text-clamp-2">Long text that will show 2 lines max...</p>
<p className="text-clamp-3">Long text that will show 3 lines max...</p>
```

### CSS Classes
```css
.text-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## 📱 Responsive Design

### Mobile-First Approach
```tsx
<div className="
  p-4           /* Mobile: 16px padding */
  sm:p-6        /* Tablet: 24px padding */
  lg:p-8        /* Desktop: 32px padding */
">
  Content
</div>
```

### Grid Layouts
```tsx
/* Summary Cards */
<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
  {cards.map(card => <Card key={card.id} />)}
</div>

/* Section Grid */
<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
  {sections.map(section => <Section key={section.id} />)}
</div>
```

---

## ✨ Animations

### Entrance Animations
```tsx
<div className="animate-fade-in">Fade in</div>
<div className="animate-reveal-up">Reveal from bottom</div>
<div className="animate-scale-in">Scale in</div>
<div className="animate-slide-in-left">Slide from left</div>
```

### Stagger Delays
```tsx
{items.map((item, index) => (
  <div 
    key={item.id} 
    className={`animate-fade-in animate-delay-${index * 100}`}
  >
    {item.content}
  </div>
))}
```

### Hover Effects
```tsx
<div className="hover-lift">Lifts on hover</div>
<div className="hover-scale">Scales on hover</div>
```

---

## 🎨 Shadow System

### Elevation Levels
```css
/* Level 1 - Subtle */
shadow-sm: 0 1px 2px rgba(30, 57, 50, 0.05)

/* Level 2 - Default */
shadow-md: 0 4px 6px rgba(30, 57, 50, 0.1)

/* Level 3 - Elevated */
shadow-lg: 0 10px 15px rgba(30, 57, 50, 0.1)

/* Level 4 - High */
shadow-xl: 0 20px 25px rgba(30, 57, 50, 0.15)

/* Level 5 - Highest */
shadow-2xl: 0 25px 50px rgba(30, 57, 50, 0.25)
```

### Usage
```tsx
<div className="shadow-md hover:shadow-xl transition-shadow">
  Card with shadow
</div>
```

---

## 🔄 Transitions

### Standard Transitions
```css
transition-all duration-300 ease-in-out
```

### Custom Cubic Bezier
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Transform Transitions
```tsx
<button className="transition-transform hover:scale-105">
  Scale on hover
</button>
```

---

## 📦 Component Examples

### Summary Card
```tsx
<Card className="starbucks-card">
  <div className="space-y-3">
    <p className="text-sm font-medium text-[#6B5D52]">Gross Sales</p>
    <h3 className="text-4xl font-bold text-[#1E3932]">Rp 5,000,000</h3>
    <p className="text-sm text-[#6B5D52] text-clamp-2">
      150 orders recorded for all branches
    </p>
    <p className="text-xs font-semibold uppercase tracking-wider text-[#9B8B7E]">
      Data order live
    </p>
  </div>
</Card>
```

### Order Kanban Column
```tsx
<div className="starbucks-card p-4">
  <div className="mb-3 flex items-center justify-between">
    <h4 className="text-sm font-semibold text-[#1E3932]">Kitchen</h4>
    <Badge>5</Badge>
  </div>
  <div className="space-y-3 max-h-[400px] overflow-y-auto">
    {orders.map(order => (
      <div key={order.id} className="rounded-xl border border-[#D4C5B9]/30 bg-white p-3">
        <p className="font-semibold text-[#1E3932] truncate">{order.table}</p>
        <p className="text-sm text-[#6B5D52] truncate">{order.customer}</p>
      </div>
    ))}
  </div>
</div>
```

### Empty State
```tsx
<div className="starbucks-card text-center p-8">
  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8DDD3] mx-auto">
    <Icon className="h-8 w-8 text-[#00704A]" />
  </div>
  <h3 className="text-lg font-semibold text-[#1E3932]">No orders yet</h3>
  <p className="mt-2 text-sm text-[#6B5D52]">
    Orders will appear here once customers place them
  </p>
  <button className="starbucks-button mt-4">
    View Menu
  </button>
</div>
```

---

## 🎯 Best Practices

### 1. Spacing
- Use consistent spacing: 4, 8, 12, 16, 24, 32, 48px
- Maintain whitespace for breathing room
- Use `space-y-*` for vertical spacing
- Use `gap-*` for grid/flex spacing

### 2. Colors
- Stick to the defined palette
- Use green sparingly as accent
- White for cards, cream for background
- Dark green-brown for text

### 3. Typography
- Clear hierarchy (h1 > h2 > h3 > p)
- Consistent font weights
- Readable line heights (1.5-1.75)
- Proper letter spacing for uppercase

### 4. Interactions
- Smooth transitions (300ms)
- Subtle hover effects
- Clear focus states
- Accessible touch targets (min 44px)

### 5. Responsiveness
- Mobile-first approach
- Test on all breakpoints
- Stack on mobile, grid on desktop
- Hide/show elements appropriately

---

## 🚀 Quick Start Checklist

- [ ] Update `app/globals.css` with Starbucks colors
- [ ] Update `AppShell` background
- [ ] Update all `Card` components to use `starbucks-card`
- [ ] Update all buttons to use `starbucks-button`
- [ ] Update all inputs to use `starbucks-input`
- [ ] Add `truncate` or `text-clamp-*` to all text
- [ ] Update sidebar with dark green-brown
- [ ] Update topbar styling
- [ ] Test responsive layouts
- [ ] Add hover effects
- [ ] Test animations
- [ ] Verify color contrast (WCAG AA)

---

## 📊 Component Inventory

### Updated Components
1. ✅ `app/globals.css` - Base styles
2. ✅ `components/layout/app-shell.tsx` - Background
3. ✅ `components/dashboard/summary-card.tsx` - Cards
4. ✅ `components/pages/dashboard-page.tsx` - Layout
5. ⏳ `components/dashboard/order-kanban.tsx` - Needs update
6. ⏳ `components/dashboard/section-grid.tsx` - Needs update
7. ⏳ `components/dashboard/sales-chart.tsx` - Needs update
8. ⏳ `components/dashboard/customer-reviews.tsx` - Needs update
9. ⏳ `components/ui/carousel.tsx` - Needs update
10. ⏳ Sidebar components - Needs update

---

## 🎨 Design Inspiration

### Starbucks Design Principles
1. **Clean & Minimal** - No clutter, focus on content
2. **Warm & Welcoming** - Cream and beige tones
3. **Premium Feel** - Quality shadows and spacing
4. **Modern** - Rounded corners, smooth animations
5. **Accessible** - High contrast, clear hierarchy

### Visual References
- Starbucks website
- Starbucks mobile app
- Premium coffee shop websites
- Modern SaaS dashboards

---

## 📝 Next Steps

1. Update remaining dashboard components
2. Update sidebar navigation
3. Update public-facing pages
4. Add loading states
5. Implement empty states
6. Test on real devices
7. Optimize performance
8. Add dark mode (optional)

---

## 🔗 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Starbucks Brand Guidelines](https://creative.starbucks.com/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)

---

**Last Updated:** $(date)
**Version:** 1.0.0
**Status:** In Progress
