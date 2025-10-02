# Quickstart: AI Image Editing Canvas Library

**Target Time**: < 5 minutes from clone to working demo
**Audience**: Developers integrating the canvas library

## Prerequisites

- Node.js 18+ and npm 9+
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Basic React/TypeScript knowledge

## Quick Setup

### 1. Install Dependencies (1 minute)

```bash
npm install
```

### 2. Run Development Server (30 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Verify Installation (30 seconds)

You should see:
- Canvas area in the center
- Toolbar at the top with tool icons (brush, eraser, outline, magnetic brush)
- Layer panel on the right side
- "Load Image" button

## Basic Usage Examples

### Example 1: Load Image and Draw Mask (2 minutes)

**Steps**:
1. Click "Load Image" button
2. Select an image file (< 20MB, PNG/JPG/WebP)
3. Wait for image to load on canvas
4. Select brush tool (or press `B` key)
5. Draw on the canvas to create a mask
6. Observe new layer created in right panel

**Expected Result**:
- Image displayed on canvas
- Red mask overlay where you drew (default color)
- Layer named "Layer 1" in layer panel with thumbnail

**Code Equivalent**:
```typescript
import { useCanvas } from '@/hooks/useCanvas';

function MyComponent() {
  const { api, state } = useCanvas();

  const handleImageLoad = async (file: File) => {
    await api.loadImage(file);
  };

  const handleDraw = (point: Point) => {
    api.setActiveTool('BRUSH');
    api.startDrawing(point);
  };

  return (
    <CanvasEditor
      onImageLoad={handleImageLoad}
      onDraw={handleDraw}
    />
  );
}
```

---

### Example 2: Create Multiple Layers (1 minute)

**Steps**:
1. After drawing first mask (from Example 1)
2. Click "+ New Layer" button in layer panel
3. Select different color from color picker
4. Draw another mask on canvas
5. Toggle visibility of layers using eye icon

**Expected Result**:
- Two layers in panel: "Layer 1" and "Layer 2"
- Each layer has different color
- Toggling visibility shows/hides respective masks

**Code Equivalent**:
```typescript
const handleCreateLayer = () => {
  const newLayer = api.createLayer('Background');
  api.setLayerColor(newLayer.id, '#00FF00'); // Green
  api.setActiveLayer(newLayer.id);
};

const handleToggleVisibility = (layerId: string) => {
  const layer = api.getLayer(layerId);
  if (layer) {
    api.setLayerVisibility(layerId, !layer.visible);
  }
};
```

---

### Example 3: Zoom and Pan (30 seconds)

**Steps**:
1. Use mouse wheel to zoom in/out (or press `+`/`-`)
2. Hold spacebar and drag to pan
3. Press `0` to fit canvas to screen
4. Press `1` for 100% zoom

**Expected Result**:
- Canvas zooms smoothly without quality loss
- Pan moves viewport
- Image remains sharp at all zoom levels

**Code Equivalent**:
```typescript
const handleZoom = (delta: number) => {
  if (delta > 0) {
    api.zoomIn();
  } else {
    api.zoomOut();
  }
};

const handlePan = (delta: Point) => {
  api.panViewport(delta);
};
```

---

### Example 4: Undo/Redo (15 seconds)

**Steps**:
1. Draw a mask on canvas
2. Press `Cmd+Z` (Mac) or `Ctrl+Z` (Windows/Linux) to undo
3. Press `Cmd+Shift+Z` or `Ctrl+Shift+Z` to redo

**Expected Result**:
- Drawing disappears on undo
- Drawing reappears on redo
- Undo/redo buttons in UI reflect available history

**Code Equivalent**:
```typescript
const handleUndo = () => {
  if (api.canUndo()) {
    api.undo();
  }
};

const handleRedo = () => {
  if (api.canRedo()) {
    api.redo();
  }
};
```

---

### Example 5: Export Mask Data (30 seconds)

**Steps**:
1. After creating masks
2. Click "Export" button
3. Open browser console (F12)
4. Observe exported JSON structure

**Expected Result**:
```json
{
  "version": "1.0",
  "image": {
    "width": 1024,
    "height": 768,
    "fileName": "example.jpg"
  },
  "masks": [
    {
      "id": "layer-abc123",
      "name": "Layer 1",
      "color": "#FF0000",
      "maskData": "data:image/png;base64,iVBORw0KG...",
      "bounds": { "x": 100, "y": 100, "width": 200, "height": 150 },
      "zIndex": 0
    }
  ],
  "metadata": {
    "exportedAt": "2025-10-02T14:30:00Z",
    "layerCount": 1,
    "canvasVersion": "1.0.0"
  }
}
```

**Code Equivalent**:
```typescript
const handleExport = () => {
  const exportData = api.exportData();
  console.log(JSON.stringify(exportData, null, 2));

  // Send to AI API
  fetch('https://api.example.com/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: exportData.image,
      masks: exportData.masks,
      prompt: 'Replace sky with sunset',
    }),
  });
};
```

---

## Advanced Usage

### Using Magnetic Brush (First Use: ~5 seconds for model load)

**Steps**:
1. Select magnetic brush tool (or press `M`)
2. Wait for model to load (first time only, ~40MB download)
3. Click near an object edge
4. Model automatically detects and traces boundary
5. Mask created around detected object

**Code Equivalent**:
```typescript
const handleMagneticBrush = async (point: Point) => {
  api.setActiveTool('MAGNETIC_BRUSH');
  try {
    await api.applyMagneticBrush(point);
  } catch (error) {
    console.error('Magnetic brush failed:', error);
  }
};
```

---

### Using Outline Tool

**Steps**:
1. Select outline tool (or press `O`)
2. Click to place points on canvas
3. Close polygon by clicking near first point or pressing Enter
4. Mask created within polygon bounds

**Code Equivalent**:
```typescript
const handleOutlinePoint = (point: Point) => {
  api.setActiveTool('OUTLINE');
  api.addOutlinePoint(point);
};

const handleCloseOutline = () => {
  api.closeOutline();
};
```

---

## Embedding in Your App

### Installation

```bash
npm install @your-org/ai-canvas-editor
```

### Basic Integration

```tsx
import { CanvasEditor } from '@your-org/ai-canvas-editor';
import '@your-org/ai-canvas-editor/styles.css';

export default function MyApp() {
  return (
    <CanvasEditor
      onExport={(data) => {
        console.log('Exported:', data);
      }}
      onError={(error) => {
        console.error('Canvas error:', error);
      }}
    />
  );
}
```

### Custom Configuration

```tsx
import { CanvasProvider, useCanvas } from '@your-org/ai-canvas-editor';

function MyCustomCanvas() {
  const { api, state } = useCanvas();

  return (
    <CanvasProvider
      config={{
        maxImageSize: 20 * 1024 * 1024,
        defaultBrushSize: 20,
        enableMagneticBrush: true,
        theme: 'dark',
      }}
    >
      <YourCustomUI api={api} state={state} />
    </CanvasProvider>
  );
}
```

---

## Testing the Integration

### Automated Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- canvas
npm test -- layers
npm test -- tools

# Run E2E tests
npm run test:e2e
```

### Manual Testing Checklist

- [ ] Load image < 20MB → Success
- [ ] Load image > 20MB → Error: "Image too large. Maximum size is 20MB."
- [ ] Draw with brush → New layer created
- [ ] Erase part of mask → Only erased region removed
- [ ] Create 5 layers → All layers visible in panel
- [ ] Reorder layers → Visual stacking order updates
- [ ] Zoom to 400% → Image remains sharp
- [ ] Undo 10 times → All actions reversed
- [ ] Redo 10 times → All actions restored
- [ ] Export with 3 layers → JSON contains 3 mask entries
- [ ] Close and reopen → State not persisted (expected)

---

## Performance Validation

### Expected Performance

- **Drawing latency**: < 200ms p95
- **Frame rate**: 60fps during drawing
- **Zoom latency**: < 100ms
- **Layer reorder**: < 50ms
- **Magnetic brush inference**: < 2 seconds
- **Export time**: < 1 second for typical image (1024x768, 3 layers)

### Performance Testing

```bash
# Run performance benchmarks
npm run bench

# Expected output:
# Drawing performance: 58fps avg (PASS)
# Zoom performance: 85ms avg (PASS)
# Layer reorder: 42ms avg (PASS)
```

---

## Troubleshooting

### Issue: Image won't load
- **Check**: File size < 20MB?
- **Check**: File format is PNG/JPG/WebP?
- **Check**: Browser console for errors

### Issue: Drawing is laggy
- **Check**: Browser hardware acceleration enabled?
- **Check**: Image resolution < 4096x4096?
- **Check**: < 20 layers?

### Issue: Magnetic brush not working
- **Check**: Internet connection for first model download?
- **Check**: Browser supports WebAssembly?
- **Check**: Console for model loading errors

### Issue: Undo/redo not working
- **Check**: Are you using the canvas API or direct DOM manipulation?
- **Check**: History limit (50 actions) not exceeded?

---

## Next Steps

- **Read full documentation**: [/docs/README.md](./docs/README.md)
- **Explore API reference**: [/docs/api.md](./docs/api.md)
- **View example apps**: [/examples](./examples)
- **Contribute**: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/ai-canvas-editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/ai-canvas-editor/discussions)
- **Email**: support@your-org.com

---

**Quickstart Complete** ✅

You should now have a working canvas editor and understand basic usage patterns. Total time: < 5 minutes.
