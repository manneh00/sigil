# Data Model: AI Image Editing Canvas Library

**Phase**: 1 (Design & Contracts)
**Date**: 2025-10-02

## Core Entities

### 1. Image

Represents the base image loaded onto the canvas for editing.

**Fields**:
- `id`: string (unique identifier)
- `data`: ImageData (raw pixel data from canvas)
- `dimensions`: { width: number, height: number }
- `fileSize`: number (bytes)
- `fileName`: string
- `format`: 'png' | 'jpg' | 'webp'
- `loadedAt`: Date

**Validation Rules**:
- `fileSize` MUST NOT exceed 20MB (20,971,520 bytes)
- `dimensions.width` and `dimensions.height` MUST be positive integers
- `format` MUST be supported image format

**State Transitions**:
```
[Empty] -> [Loading] -> [Loaded] -> [Error]
                   \-> [Error]
```

---

### 2. Layer

Represents an individual mask layer with drawing operations.

**Fields**:
- `id`: string (UUID)
- `name`: string (user-editable, default: "Layer {n}")
- `maskData`: ImageData (alpha channel represents mask)
- `color`: string (hex color, e.g., "#FF0000")
- `opacity`: number (0-1, default: 1)
- `visible`: boolean (default: true)
- `zIndex`: number (stacking order)
- `bounds`: { x: number, y: number, width: number, height: number }
- `thumbnail`: string (base64 data URL, 80x80px)
- `createdAt`: Date
- `modifiedAt`: Date

**Validation Rules**:
- `name` MUST be 1-50 characters
- `color` MUST be valid hex color (#RRGGBB or #RRGGBBAA)
- `opacity` MUST be between 0 and 1
- `zIndex` MUST be unique per layer within canvas
- `bounds` MUST be within canvas dimensions

**Relationships**:
- Belongs to Canvas (composition)
- Ordered by `zIndex` (lower values rendered first)

**Operations**:
- Create: New layer with empty maskData
- Update: Modify name, color, opacity, visibility
- Delete: Remove from layers array, update z-indices
- Reorder: Swap z-index with adjacent layer
- Draw: Update maskData at specific coordinates
- Erase: Clear maskData at specific coordinates

---

### 3. Tool

Represents a drawing tool with specific behavior.

**Types** (enum):
- `BRUSH`: Freehand drawing tool
- `MAGNETIC_BRUSH`: AI-assisted edge detection
- `OUTLINE`: Polygon drawing with point placement
- `ERASER`: Removes mask regions
- `PAN`: Canvas navigation (space key)
- `ZOOM`: Canvas zoom (mouse wheel)

**Fields**:
- `type`: ToolType
- `isActive`: boolean
- `settings`: ToolSettings (tool-specific configuration)

**ToolSettings by Type**:
```typescript
BrushSettings {
  size: number (5-100px, default: 20)
  smoothing: number (0-1, default: 0.5)
}

MagneticBrushSettings {
  threshold: number (0-1, default: 0.7) // Edge detection sensitivity
  isModelLoaded: boolean
}

OutlineSettings {
  points: Point[] // Temporary points during drawing
  isClosed: boolean
}

EraserSettings {
  size: number (5-100px, default: 20)
}
```

**State Transitions**:
```
[Inactive] -> [Active] -> [Inactive]
            -> [Loading] (magnetic brush model) -> [Active]
                        -> [Error] -> [Inactive]
```

---

### 4. Viewport

Represents the canvas view transformation state.

**Fields**:
- `zoom`: number (0.1 to 10, default: 1)
- `pan`: { x: number, y: number } (offset in pixels)
- `canvasDimensions`: { width: number, height: number }
- `viewportDimensions`: { width: number, height: number }

**Validation Rules**:
- `zoom` MUST be between 0.1 and 10
- Pan values MUST keep canvas visible (bounds checking)

**Operations**:
- Zoom in/out: Multiply zoom by 1.1 / 0.9
- Pan: Add delta to pan.x and pan.y
- Reset: zoom=1, pan={0,0}
- Fit to screen: Calculate zoom to fit canvas in viewport

---

### 5. History State

Represents undo/redo history for all operations.

**Fields**:
- `past`: State[] (max 50 entries)
- `present`: State
- `future`: State[]

**State Snapshot**:
```typescript
State {
  layers: Layer[]
  viewport: Viewport
  actionType: ActionType
  timestamp: Date
}
```

**Operations**:
- Push: Add present to past, update present, clear future
- Undo: Move present to future, pop from past
- Redo: Move present to past, pop from future
- Clear: Reset all to empty

**Action Types** (for debugging/UI):
- `DRAW`, `ERASE`, `LAYER_ADD`, `LAYER_DELETE`, `LAYER_REORDER`,
  `LAYER_RENAME`, `LAYER_COLOR`, `VIEWPORT_CHANGE`

---

### 6. Canvas State (Root)

The root application state containing all entities.

**Fields**:
- `image`: Image | null
- `layers`: Layer[]
- `activeLayerId`: string | null
- `activeTool`: Tool
- `viewport`: Viewport
- `history`: History
- `ui`: UIState

**UIState**:
```typescript
{
  isDrawing: boolean
  isPanning: boolean
  isLoading: boolean
  error: string | null
  selectedLayerId: string | null // For layer panel
  toolPanelOpen: boolean
  layerPanelOpen: boolean
}
```

**Invariants**:
- If `layers.length > 0`, at least one layer MUST have `visible: true`
- `activeLayerId` MUST reference existing layer or be null
- `layers` MUST have unique `zIndex` values (0 to layers.length - 1)
- When image is null, layers MUST be empty
- `history.present` MUST equal current state

---

## Relationships Diagram

```
CanvasState (root)
├── Image (1)
├── Layers (0..*)
│   └── Layer
│       ├── maskData: ImageData
│       ├── color: string
│       └── bounds: BoundingBox
├── ActiveTool (1)
│   └── Tool
│       └── settings: ToolSettings
├── Viewport (1)
│   ├── zoom: number
│   └── pan: Point
└── History (1)
    ├── past: State[]
    ├── present: State
    └── future: State[]
```

---

## State Update Patterns

### Drawing Operations

```typescript
// Brush stroke
1. Check activeLayerId exists
2. Get layer maskData
3. Apply brush pixels to maskData at cursor position
4. Update layer.modifiedAt
5. Debounce: After 500ms, push to history
6. Update thumbnail after drawing complete

// Eraser
1. Similar to brush, but clear pixels (set alpha to 0)

// Magnetic brush
1. Show loading indicator
2. Run SAM model inference (async, max 2s)
3. Convert segmentation to mask ImageData
4. Apply to activeLayer maskData
5. Push to history immediately
6. Update thumbnail
```

### Layer Operations

```typescript
// Add layer
1. Create new Layer with unique id, zIndex = layers.length
2. Append to layers array
3. Set as activeLayerId
4. Push to history

// Delete layer
1. Remove from layers array
2. Reindex remaining layers (zIndex 0 to n-1)
3. Set activeLayerId to previous layer or null
4. Push to history

// Reorder layer (move up)
1. Swap zIndex with layer above
2. Re-sort layers array
3. Push to history
4. Trigger re-render
```

### Viewport Operations

```typescript
// Zoom
1. Calculate new zoom (clamp to 0.1-10)
2. Adjust pan to keep cursor position constant
3. Update viewport state
4. Debounce: Push to history after 1s of no zoom changes

// Pan
1. Update pan.x and pan.y
2. Clamp to keep canvas in bounds
3. Debounce: Push to history after 1s of no pan changes
```

---

## Validation & Error Handling

### Image Loading
- **Error**: File > 20MB → Show error: "Image too large. Maximum size is 20MB."
- **Error**: Unsupported format → Show error: "Unsupported image format. Please use PNG, JPG, or WebP."
- **Error**: Corrupt file → Show error: "Unable to load image. File may be corrupted."

### Layer Operations
- **Error**: Max layers (100) reached → Show error: "Maximum number of layers (100) reached."
- **Warning**: Delete last visible layer → Confirm: "This is the last visible layer. Delete anyway?"

### Magnetic Brush
- **Error**: Model failed to load → Disable tool, show error: "Magnetic brush unavailable. Model failed to load."
- **Error**: Inference timeout (>2s) → Show error: "Detection timed out. Try a smaller region."
- **Warning**: No edges detected → Show message: "No objects detected. Try adjusting threshold."

### Export
- **Error**: No layers → Show error: "No masks to export. Create at least one layer."
- **Error**: Export failed → Show error: "Export failed. Please try again."

---

## Performance Considerations

### Memory Management
- **Image**: Store single ImageData, not multiple copies
- **Layers**: Use sparse representation (only store drawn pixels)
- **History**: Limit to 50 states, clear oldest when exceeded
- **Thumbnails**: 80x80px only, not full resolution

### Rendering Optimization
- **Dirty regions**: Only re-render changed layers
- **Offscreen canvases**: Composite layers in background
- **RequestAnimationFrame**: Batch all canvas operations per frame
- **Viewport culling**: Don't render layers outside viewport at high zoom

---

## Export Data Format

```typescript
ExportData {
  version: "1.0"
  image: {
    width: number
    height: number
    fileName: string
  }
  masks: MaskExport[]
  metadata: {
    exportedAt: string (ISO 8601)
    layerCount: number
    canvasVersion: string
  }
}

MaskExport {
  id: string
  name: string
  color: string
  maskData: string (base64 PNG)
  bounds: BoundingBox
  zIndex: number
}
```

**Usage Example** (for AI API):
```json
{
  "version": "1.0",
  "image": { "width": 1024, "height": 768, "fileName": "photo.jpg" },
  "masks": [
    {
      "id": "layer-1",
      "name": "Background",
      "color": "#FF0000",
      "maskData": "data:image/png;base64,iVBORw0KG...",
      "bounds": { "x": 0, "y": 0, "width": 1024, "height": 768 },
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

---

**Phase 1 Data Model Complete**: All entities defined with validation rules and relationships
