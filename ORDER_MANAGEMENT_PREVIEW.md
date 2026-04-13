# 📋 Order Management - Visual Preview

## Component Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ORDER MANAGEMENT                                 │
│                                                                          │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐   │
│  │  ORDER MANAGEMENT            │  │  STATISTICS                  │   │
│  │  Manajemen Pesanan           │  │                              │   │
│  │                              │  │  Total Orders    Status      │   │
│  │  Pantau semua pesanan yang   │  │     150         Pending: 45  │   │
│  │  masuk, status pemrosesan,   │  │  Rp 15,000,000  Selesai: 105 │   │
│  │  dan detail pembayaran...    │  │                              │   │
│  └──────────────────────────────┘  └──────────────────────────────┘   │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  ORD-2024-001  [Dapur] [QRIS]                                  │   │
│  │                                                                 │   │
│  │  Customer: John Doe        Table: 07                           │   │
│  │  Branch: LP3I Cafe         Time: 13 Apr 2026, 14:30           │   │
│  │                                                                 │   │
│  │  ┌─────────────────────────────────────────────────┐          │   │
│  │  │ Items                                            │          │   │
│  │  │ 2x Cappuccino              Rp 50,000            │          │   │
│  │  │ 1x Croissant               Rp 25,000            │  Total   │   │
│  │  │ 1x Americano               Rp 30,000            │          │   │
│  │  │ +2 item lainnya                                 │ Rp 150K  │   │
│  │  └─────────────────────────────────────────────────┘          │   │
│  │                                                                 │   │
│  │  ┌─────────────────────────────────────────────────┐  [Lihat  │   │
│  │  │ Notes: Extra hot, no sugar                      │   Detail]│   │
│  │  └─────────────────────────────────────────────────┘          │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  [More order cards...]                                                  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │              [Lihat Semua Pesanan (150)]                       │   │
│  └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Color Scheme

### Header Cards
```
┌─────────────────────────────────┐
│ 🟢 ORDER MANAGEMENT             │  ← #00704A (Starbucks Green)
│ Manajemen Pesanan               │  ← #1E3932 (Dark Green-Brown)
│                                 │
│ Pantau semua pesanan...         │  ← #00704A/80 (Green 80%)
└─────────────────────────────────┘
   ↑ White background with shadow
```

### Order Card
```
┌─────────────────────────────────────────────┐
│ ORD-2024-001  [Dapur] [QRIS]               │
│    ↑             ↑       ↑                  │
│  #1E3932      Amber    Blue                 │
│  (clickable → #00704A on hover)             │
│                                             │
│ Customer: John Doe    Table: 07            │
│    ↑                     ↑                  │
│  #1E3932              #1E3932               │
│                                             │
│ ┌─────────────────────────────────┐        │
│ │ Items                           │        │
│ │ 2x Cappuccino    Rp 50,000     │        │
│ │    ↑                ↑           │        │
│ │  #1E3932        #00704A         │        │
│ └─────────────────────────────────┘        │
│    ↑ #F7F5F2 (Cream background)            │
│                                             │
│ ┌─────────────────────────────────┐        │
│ │ Notes: Extra hot, no sugar      │        │
│ └─────────────────────────────────┘        │
│    ↑ #E8DDD3/30 (Beige background)         │
└─────────────────────────────────────────────┘
   ↑ White card with #D4C5B9 border
```

---

## Status Badge Colors

### Visual Representation
```
[Pelayan]        → Blue badge    (#3B82F6)
[Dapur]          → Amber badge   (#F59E0B)
[Siap Diantar]   → Green badge   (#10B981)
[Selesai]        → Slate badge   (#64748B)
```

### Payment Method Badges
```
[Cash]   → Green badge  (#10B981)
[QRIS]   → Blue badge   (#3B82F6)
[Debit]  → Amber badge  (#F59E0B)
```

---

## Responsive Layouts

### Desktop (> 1024px)
```
┌─────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Order Info (flex-1)              │ Total & Actions          │ │
│ │                                  │                          │ │
│ │ ORD-2024-001 [Status] [Payment] │      Total               │ │
│ │                                  │   Rp 150,000             │ │
│ │ Customer | Table | Branch | Time │                          │ │
│ │                                  │  [Lihat Detail]          │ │
│ │ Items Preview                    │                          │ │
│ │ Notes                            │                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌───────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────┐ │
│ │ Order Info                                │ │
│ │                                           │ │
│ │ ORD-2024-001 [Status] [Payment]          │ │
│ │                                           │ │
│ │ Customer | Table                          │ │
│ │ Branch   | Time                           │ │
│ │                                           │ │
│ │ Items Preview                             │ │
│ │ Notes                                     │ │
│ │                                           │ │
│ │ ─────────────────────────────────────────│ │
│ │                                           │ │
│ │ Total: Rp 150,000    [Lihat Detail]      │ │
│ └───────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │ ORD-2024-001            │ │
│ │ [Status] [Payment]      │ │
│ │                         │ │
│ │ Customer: John Doe      │ │
│ │ Table: 07               │ │
│ │                         │ │
│ │ Branch: LP3I Cafe       │ │
│ │ Time: 13 Apr, 14:30     │ │
│ │                         │ │
│ │ ┌─────────────────────┐ │ │
│ │ │ Items               │ │ │
│ │ │ 2x Cappuccino       │ │ │
│ │ │ 1x Croissant        │ │ │
│ │ │ +2 item lainnya     │ │ │
│ │ └─────────────────────┘ │ │
│ │                         │ │
│ │ ┌─────────────────────┐ │ │
│ │ │ Notes: Extra hot... │ │ │
│ │ └─────────────────────┘ │ │
│ │                         │ │
│ │ ─────────────────────── │ │
│ │                         │ │
│ │ Total: Rp 150,000       │ │
│ │ [Lihat Detail]          │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## Empty State

```
┌─────────────────────────────────────────────┐
│                                             │
│              ┌─────────┐                    │
│              │   📋    │                    │
│              └─────────┘                    │
│                                             │
│     Belum ada pesanan yang tercatat.       │
│                                             │
│  Pesanan baru akan muncul di sini secara   │
│              otomatis.                      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Hover Effects

### Card Hover
```
Before:
┌─────────────────────────────┐
│ Order Card                  │  shadow-lg
└─────────────────────────────┘

After (hover):
┌─────────────────────────────┐
│ Order Card                  │  shadow-2xl
└─────────────────────────────┘  translateY(-4px)
```

### Button Hover
```
Before:
┌──────────────────┐
│  Lihat Detail    │  bg-[#00704A]
└──────────────────┘

After (hover):
┌──────────────────┐
│  Lihat Detail    │  bg-[#00A862]
└──────────────────┘  translateY(-0.5px) + shadow-lg
```

### Link Hover
```
Before:
ORD-2024-001  (color: #1E3932)

After (hover):
ORD-2024-001  (color: #00704A)
```

---

## Statistics Card Detail

```
┌─────────────────────────────────────────┐
│  Total Orders          Status           │
│                                         │
│      150              Pending    45     │
│  Rp 15,000,000        Selesai   105    │
│      ↑                   ↑        ↑     │
│   3xl bold          xs gray   sm bold   │
│   #1E3932          #1E3932/70 #1E3932  │
│                                         │
│  xs #00704A/60                          │
└─────────────────────────────────────────┘
```

---

## Order Items Preview Detail

```
┌─────────────────────────────────────────┐
│ Items                                   │  ← xs uppercase #00704A/70
│                                         │
│ 2x Cappuccino              Rp 50,000   │
│ ↑                          ↑            │
│ #1E3932 truncate          #00704A bold │
│                                         │
│ 1x Croissant               Rp 25,000   │
│ 1x Americano               Rp 30,000   │
│                                         │
│ +2 item lainnya                         │  ← xs italic #00704A/60
└─────────────────────────────────────────┘
   ↑ bg-[#F7F5F2] border-[#D4C5B9]/30
```

---

## Notes Section Detail

```
┌─────────────────────────────────────────┐
│ Notes                                   │  ← xs uppercase #00704A/70
│ Extra hot, no sugar, less ice          │  ← sm #1E3932/80
│                                         │     line-clamp-2
└─────────────────────────────────────────┘
   ↑ bg-[#E8DDD3]/30 border-[#D4C5B9]/30
```

---

## View All Button

```
┌─────────────────────────────────────────┐
│                                         │
│   ┌───────────────────────────────┐    │
│   │ Lihat Semua Pesanan (150)     │    │
│   └───────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
     ↑ border-2 border-[#00704A]
       text-[#00704A]
       hover: bg-[#00704A] text-white
```

---

## Integration in Dashboard

```
Dashboard Layout:
┌─────────────────────────────────────────┐
│  Branch Filter                          │
├─────────────────────────────────────────┤
│  Summary Cards (6 cards)                │
├─────────────────────────────────────────┤
│  Sales Chart  │  Order Kanban           │
├─────────────────────────────────────────┤
│  ORDER MANAGEMENT (NEW!)                │  ← Added here
│  - Statistics                           │
│  - Order List (10 recent)               │
│  - View All Link                        │
├─────────────────────────────────────────┤
│  Customer Reviews                       │
├─────────────────────────────────────────┤
│  Section Grid (4 cards)                 │
└─────────────────────────────────────────┘
```

---

## Animation Timeline

```
Component Mount:
0ms   → Statistics cards fade in
100ms → First order card slides in
150ms → Second order card slides in
200ms → Third order card slides in
...

Hover:
0ms   → Card shadow increases
0ms   → Card translates up 4px
300ms → Animation complete

Button Hover:
0ms   → Background color changes
0ms   → Shadow increases
0ms   → Translates up 0.5px
300ms → Animation complete
```

---

## Accessibility Features

### Keyboard Navigation
- All links and buttons are keyboard accessible
- Focus states visible with outline
- Tab order logical (top to bottom)

### Screen Readers
- Semantic HTML structure
- Proper heading hierarchy
- Descriptive link text
- Badge content readable

### Color Contrast
- All text meets WCAG AA standards
- Status badges have sufficient contrast
- Hover states clearly visible

---

## Performance Considerations

### Optimizations
1. **Slice to 10 orders** - Only render recent orders
2. **Memoization** - Statistics calculated once
3. **Conditional rendering** - Items/notes only if exist
4. **CSS transitions** - GPU-accelerated transforms
5. **Lazy loading** - Images (if added) lazy loaded

### Bundle Size
- Component size: ~5KB (minified)
- No external dependencies
- Uses existing UI components

---

## Browser Compatibility

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

**Preview Version**: 1.0.0
**Last Updated**: Context Transfer Session
