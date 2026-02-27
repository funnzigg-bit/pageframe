

## Shots.so-Style Mockup Editor

Transform the current basic mockup dialog into a full-featured mockup editor inspired by shots.so, with 3D perspective controls, rich background options, and a polished editing experience.

### What Changes

**1. Full-Screen Editor Layout (replaces dialog)**
- Convert from a cramped dialog to a full-screen overlay/page with a left sidebar for controls and a large center canvas for the live preview
- Sidebar sections: Device, Background, Position (tilt/rotate), Zoom, Padding, Shadow, Export

**2. 3D Perspective & Tilt Controls**
- Add `rotateX` and `rotateY` sliders (-30 to +30 degrees) that apply CSS `perspective` + `rotateX/rotateY` transforms to the device frame
- This creates the signature shots.so tilted mockup look
- Add a "Reset" button to snap back to flat (0, 0)
- The 3D transform wraps the entire device frame container, so the frame + screenshot tilt together

**3. Enhanced Background System**
- Expand from 4 presets to a richer set: solid colors (white, dark, black), multiple gradient presets (purple-blue, pink-orange, green-teal, etc.), and a subtle/transparent option
- Add a padding slider (16px to 120px) to control whitespace around the device in the canvas
- Background applies to the export canvas

**4. Screenshot Zoom & Pan (fix existing)**
- Keep the existing zoom slider (1x-3x) and drag-to-pan but ensure it works reliably by always enabling pan (not gating on zoom > 1) and using `transform-origin: top left` for predictable positioning
- Show a "Drag to reposition" hint when zoomed

**5. Shadow & Polish Controls**
- Add a shadow intensity slider (none, subtle, medium, dramatic) that adjusts the `box-shadow` on the device frame
- This enhances the floating-device aesthetic

**6. Export Improvements**
- Keep PNG export at 2x resolution
- Keep PDF export
- Add copy-to-clipboard option

### Technical Details

**File: `src/components/MockupDialog.tsx`** (major rewrite)

New state variables:
- `rotateX: number` (default 0, range -30 to 30)
- `rotateY: number` (default 0, range -30 to 30)  
- `padding: number` (default 64, range 16 to 120)
- `shadowLevel: "none" | "subtle" | "medium" | "dramatic"` (default "medium")

3D transform applied to the device wrapper:
```text
style={{
  perspective: "1200px",
  perspectiveOrigin: "center center"
}}
  -> child div:
  style={{
    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    transformStyle: "preserve-3d"
  }}
```

Layout structure:
```text
+--------------------------------------------------+
| Full-screen overlay                                |
|  +----------+  +------------------------------+   |
|  | Sidebar  |  |        Canvas Area           |   |
|  | - Device |  |                              |   |
|  | - BG     |  |    [Device Frame + Image]    |   |
|  | - Tilt   |  |                              |   |
|  | - Zoom   |  |                              |   |
|  | - Shadow |  +------------------------------+   |
|  | - Export |                                      |
|  +----------+                                      |
+--------------------------------------------------+
```

The sidebar uses the existing Slider component for all numeric controls. Device and background selectors use small clickable tiles/buttons.

**Backgrounds expanded** to ~8 presets with descriptive gradient strings, still using Tailwind classes where possible and inline styles for custom gradients.

**Export container** (`containerRef`) wraps only the canvas area (background + padded device) so `html-to-image` captures exactly what the user sees including the 3D perspective, background, and padding.

### Files Modified
- `src/components/MockupDialog.tsx` -- full rewrite to sidebar + canvas layout with new controls
- `src/pages/History.tsx` -- no changes needed (already passes correct props)

