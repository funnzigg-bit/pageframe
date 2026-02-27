

## Mockup Dialog Enhancements

### 1. Portrait/Landscape Toggle for iPhone and iPad

Add an orientation toggle (portrait/landscape) that appears when iPhone or iPad is selected. When landscape is chosen:
- The device frames rotate visually -- the iPhone frame becomes wide and short, the iPad frame becomes wide and short
- Side buttons, Dynamic Island, camera, and home indicator reposition accordingly
- The image container adapts its aspect ratio

The toggle will be a small segmented control (Portrait | Landscape) shown inline next to the device picker, only visible when device is `iphone` or `ipad`.

### 2. Screenshot Cropping and Zoom Controls

Replace the simple `<img>` tag inside the device frame with an interactive image viewport that lets users:

- **Zoom**: A slider control (using the existing Slider component) ranging from 1x to 3x zoom, controlling CSS `transform: scale()` on the image
- **Pan/Position**: Click-and-drag on the image inside the device frame to reposition which part of the screenshot is visible (using `object-position` or `transform: translate()` within an `overflow: hidden` container)
- **Reset button**: Quick reset to default (1x zoom, centered)

The interaction area will be the image inside the frame -- the overflow is already hidden by the frame's container, so scaling and translating the image will naturally crop it to show only the desired portion.

During export, the zoom and position values are baked into the inline styles so `html-to-image` captures them correctly.

### Technical Details

**File changed:** `src/components/MockupDialog.tsx`

**New state variables:**
- `orientation`: `"portrait" | "landscape"` (default `"portrait"`)
- `zoom`: number (default `1`, range `1-3`)
- `panOffset`: `{ x: number, y: number }` for drag positioning
- `isDragging` + `dragStart` refs for mouse drag tracking

**Orientation handling:**
- Create `IPhoneLandscapeFrame` and `IPadLandscapeFrame` components with rotated layouts (buttons on top/bottom, Dynamic Island on side, wider aspect ratio)
- Frame selection logic: `device === "iphone" && orientation === "landscape"` picks the landscape variant
- Update `imageMaxWidths` to have landscape-specific widths

**Zoom and pan implementation:**
- Wrap the `<img>` in a div with `overflow: hidden` and fixed dimensions matching the device screen area
- Apply `transform: scale(${zoom}) translate(${panX}px, ${panY}px)` to the image
- `onMouseDown`/`onMouseMove`/`onMouseUp` handlers on the image container for drag-to-pan
- Touch events (`onTouchStart`/`onTouchMove`/`onTouchEnd`) for mobile support

**New UI controls (added below existing controls row):**
- Orientation toggle: two-button segmented control, only shown for iPhone/iPad
- Zoom slider with label showing current zoom level (e.g., "1.5x")
- Reset button to restore zoom to 1x and pan to center

