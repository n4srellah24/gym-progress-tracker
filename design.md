# Apple Inspired Design System (DESIGN.md)

## Design System Analysis: Apple
- **Aesthetic**: Minimalist, clean, photographic, ultra-refined, typography-first, near-invisible UI chrome.
- **Core Philosophy**: UI chrome recedes so the content and interaction speak. No loud gradients or messy glowing borders. Confident typography with negative letter-spacing for titles, clean monochrome cards, and Apple's signature Action Blue (`#0071e3` / `#0066cc` / `#2997ff`) for interactive elements.

### 🎨 Color Palette
- **Canvas / Background**: `#000000` (Pure Dark / OLED Black) or `#0a0a0c` deep canvas
- **Surface Tiles / Cards**: `#161618` (System Tile / Card Surface), `#1c1c1e` (Secondary Tile), `#2c2c2e` (Elevated Tile / Input background)
- **Dividers & Hairlines**: `#262629` / `rgba(255, 255, 255, 0.08)`
- **Typography & Text**:
  - Primary / Body On Dark: `#f5f5f7` (Near White)
  - Secondary / Muted: `#86868b` (Apple Gray)
  - Subtle Muted: `#6e6e73`
- **Action & Accent**:
  - Apple Action Blue: `#0071e3`
  - Action Blue Hover: `#0077ed`
  - Action Blue On Dark: `#2997ff`
  - Apple Success / Completion: `#30d158` (iOS Emerald/Mint) or crisp `#34c759`
  - Apple Destructive: `#ff453a`

### 🔤 Typography (SF Pro Inspired)
- **Headlines / Display**: Clean, bold, tight tracking (`letterSpacing: -0.02em` to `-0.03em`), high legibility.
- **Body & Subtitles**: SF Pro / Inter font stack (`-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif`).
- **Data / Numbers**: Clean tabular figures (`font-variant-numeric: tabular-nums`).

### 🔘 Radii & Geometry
- **Cards / Containers**: `rounded-[20px]` or `rounded-[18px]` (Apple `rounded.lg` smooth squircle feel)
- **Input Fields & Chips**: `rounded-[12px]` or `rounded-[10px]`
- **Action Buttons & Badges**: `rounded-full` (Apple signature pill buttons)

### ✨ UI Components & Apple Patterns
1. **Frosted Glass Navigation**: Ultra-clean frosted glass top nav (`backdrop-blur-md bg-black/75 border-b border-white/10`).
2. **Apple Health / Fitness Style Cards**: Clean, dark monochrome surface tiles (`bg-[#161618]`), subtle `border border-white/5`, crisp typographic hierarchy.
3. **Pill Buttons & Segmented Chips**: Smooth pill-shaped action buttons (`bg-[#0071e3] text-white hover:bg-[#0077ed] transition-all active:scale-[0.98]`).
4. **Minimal Numeric Set Logging Rows**:
   - Clean tabular input boxes with subtle borders (`bg-[#1c1c1e] text-[#f5f5f7] border-white/10 focus:border-[#0071e3]`).
   - Clean mini steppers and "Same" quick duplicate badge.
5. **Floating Sticky Bottom Bar**: Frosted glass bottom dock with clean pill button and real-time set counter badge.
6. **Subtle Transitions**: Native iOS-like spring transitions, quiet feedback, high polish.
