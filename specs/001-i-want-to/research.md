# Research: AI Image Editing Canvas Library

**Phase**: 0 (Outline & Research)
**Date**: 2025-10-02

## Research Areas

### 1. Canvas Rendering Strategy

**Decision**: Use HTML5 Canvas API with offscreen canvases for layer composition

**Rationale**:
- Native performance for pixel manipulation (60fps requirement)
- Offscreen canvases enable non-blocking rendering for multiple layers
- Well-supported across modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Direct pixel access needed for mask generation and export

**Alternatives Considered**:
- **SVG-based rendering**: Rejected - poor performance with complex shapes at scale, not suitable for pixel-level mask data
- **WebGL with Three.js/PixiJS**: Rejected - unnecessary complexity for 2D operations, larger bundle size
- **Canvas libraries (Fabric.js, Konva.js)**: Rejected - adds abstractions that complicate pixel-perfect mask generation, increases bundle size

**Implementation Notes**:
- Use separate canvases for base image, each mask layer, and composite view
- RequestAnimationFrame for smooth drawing operations
- Canvas context settings: `imageSmoothingEnabled: false` for lossless zoom

---

### 2. State Management Architecture

**Decision**: React Context + useReducer for global state, with immer for immutability

**Rationale**:
- Lightweight solution (no Redux overhead for single-page app)
- useReducer provides predictable state transitions for undo/redo
- Immer simplifies immutable updates for complex nested layer state
- React Context sufficient for component tree (no prop drilling)

**Alternatives Considered**:
- **Redux Toolkit**: Rejected - overkill for single-page app, adds bundle size
- **Zustand**: Considered - simpler than Redux but Context+useReducer sufficient for scope
- **Jotai/Recoil**: Rejected - atomic state not needed, prefer colocated state

**State Structure**:
```typescript
{
  image: { data: ImageData, dimensions: { width, height } },
  layers: Layer[],
  activeLayerId: string,
  activeTool: ToolType,
  history: { past: State[], future: State[] },
  viewport: { zoom: number, pan: { x, y } }
}
```

---

### 3. Magnetic Brush (SAM Integration)

**Decision**: Use ONNX Runtime Web with SAM (Segment Anything Model) quantized model

**Rationale**:
- Client-side inference (no backend requirement met)
- ONNX Runtime Web provides WebAssembly acceleration
- Quantized SAM model (~40MB) balances quality vs load time
- Meets 2-second inference requirement on modern hardware

**Alternatives Considered**:
- **Cloud API (Meta SAM API)**: Rejected - requires backend, latency unpredictable
- **TensorFlow.js**: Considered - larger runtime, slower inference than ONNX
- **MediaPipe**: Rejected - limited segmentation control, not mask-optimized

**Implementation Notes**:
- Lazy load ONNX model on first magnetic brush use
- Show loading indicator during model download
- Cache model in IndexedDB for subsequent sessions
- Fallback: if model fails to load, disable magnetic brush with error message

---

### 4. Undo/Redo Implementation

**Decision**: Command pattern with immutable state snapshots

**Rationale**:
- Clean separation of concerns (each action is a command)
- Works naturally with useReducer architecture
- Immutable snapshots enable efficient time-travel debugging
- Supports granular undo for all operations (draw, erase, layer ops)

**Alternatives Considered**:
- **Canvas snapshot diffing**: Rejected - memory intensive, slow for large images
- **Event sourcing**: Rejected - overcomplicated for client-side app
- **Operational transformation**: Rejected - no collaboration requirement

**Implementation Notes**:
- Limit history stack to 50 actions (memory management)
- Debounce rapid drawing actions (group strokes within 500ms)
- Clear future stack on new action after undo
- Keyboard shortcuts: Cmd/Ctrl+Z (undo), Cmd/Ctrl+Shift+Z (redo)

---

### 5. Zoom and Pan Strategy

**Decision**: CSS transforms for viewport, maintain canvas resolution at 100%

**Rationale**:
- CSS `transform: scale()` provides GPU-accelerated zoom without re-rendering
- Keep canvas at native resolution prevents quality loss
- Pan via `transform: translate()` is performant
- Meets <100ms zoom requirement

**Alternatives Considered**:
- **Re-render canvas at zoom level**: Rejected - expensive, causes flicker
- **Multiple resolution canvases (mipmap)**: Rejected - memory overhead, complexity

**Implementation Notes**:
- Clamp zoom range: 10% to 1000%
- Mouse wheel for zoom (centered on cursor position)
- Pinch gesture support for trackpad/touch
- Pan with space+drag or middle mouse button

---

### 6. Layer Thumbnail Generation

**Decision**: Downsample layer canvas to 80x80px thumbnails using canvas.drawImage

**Rationale**:
- Native canvas scaling provides fast, good-quality thumbnails
- 80x80px balances visibility vs performance
- Update thumbnails on layer change (debounced 300ms)

**Alternatives Considered**:
- **CSS-only scaling**: Rejected - still renders full layer, slow with many layers
- **Offscreen canvas workers**: Considered - added complexity not justified for thumbnail generation

---

### 7. Export Format

**Decision**: JSON structure with base64-encoded PNG for masks, ImageData reference

**Rationale**:
- JSON is universal, works with all AI APIs
- PNG masks preserve alpha channel (important for semi-transparent masks)
- Base64 encoding enables direct embedding in API requests
- Separate layers enable per-mask AI instructions

**Export Structure**:
```json
{
  "image": { "width": 1024, "height": 768, "format": "base64" },
  "masks": [
    {
      "id": "layer-1",
      "name": "Sky region",
      "color": "#FF0000",
      "maskData": "data:image/png;base64,...",
      "bounds": { "x": 0, "y": 0, "width": 1024, "height": 300 }
    }
  ],
  "version": "1.0"
}
```

---

### 8. Testing Strategy

**Decision**: Vitest for unit, React Testing Library for components, Playwright for E2E

**Rationale**:
- Vitest: Fast, native ESM support, Vite integration
- RTL: Best practice for React, tests user behavior not implementation
- Playwright: Reliable E2E, canvas interaction support, cross-browser

**Test Coverage Goals**:
- Unit tests: lib/canvas, lib/tools, lib/layers, lib/history (>80% coverage)
- Component tests: Canvas, Toolbar, LayerPanel interactions
- E2E tests: Full user workflows from spec acceptance scenarios
- Performance tests: Rendering benchmarks (60fps), zoom latency (<100ms)

---

### 9. Accessibility Strategy

**Decision**: WCAG 2.1 AA compliance via keyboard navigation, ARIA labels, focus management

**Rationale**:
- Constitutional requirement (Principle III)
- Keyboard-only users must access all functionality
- Screen readers need context for visual tools

**Implementation**:
- Tool selection: Arrow keys + Enter
- Layer navigation: Up/Down arrows in panel, Tab to navigate
- Canvas: Arrow keys for precise drawing (accessibility mode)
- ARIA labels: "Brush tool, currently selected", "Layer 1: Sky region"
- Focus indicators: High contrast outlines (visible focus)
- Keyboard shortcuts table: Accessible via "?" key

---

### 10. Performance Optimization Decisions

**Decision**: Multiple strategies for 60fps target

**Strategies**:
1. **RequestAnimationFrame batching**: Batch canvas updates per frame
2. **Layer compositing**: Only re-composite changed layers
3. **Viewport culling**: Don't render layers outside viewport
4. **Debounced thumbnails**: Update layer thumbnails 300ms after changes
5. **Web Worker for export**: Offload PNG encoding to worker thread

**Rationale**:
- 60fps = 16.67ms frame budget, need multiple optimizations
- Canvas operations are main performance bottleneck
- Profiling shows layer composition dominates render time

---

## Technology Dependencies

### Core
- **Next.js 14.x**: App Router, React Server Components
- **React 18.x**: Concurrent rendering, Suspense
- **TypeScript 5.x**: Type safety, interfaces for contracts

### UI
- **Tailwind CSS 3.x**: Utility-first styling
- **shadcn/ui**: Pre-built accessible components (Button, Slider, Tabs)
- **Radix UI** (via shadcn): Unstyled accessible primitives

### Canvas/Graphics
- **HTML5 Canvas API**: Native rendering
- **ONNX Runtime Web**: Magnetic brush AI inference

### Testing
- **Vitest**: Unit test runner
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **@testing-library/user-event**: User interaction simulation

### Development
- **ESLint**: Linting (TypeScript, React rules)
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit linting

---

## Open Questions & Decisions

### Resolved
- ✅ Maximum image size: 20MB (user specified)
- ✅ Magnetic brush latency: 2 seconds acceptable (user specified)
- ✅ Undo/redo required: Yes, for all actions (user specified)
- ✅ UI layout: Top toolbar + right sidebar (user specified)

### Future Considerations (Out of MVP Scope)
- Multiple brush sizes/shapes (MVP: single brush size)
- Custom layer opacity/blend modes (MVP: solid colors only)
- Collaborative editing (MVP: single-user only)
- Cloud save/load (MVP: local export only)

---

## Architecture Decision Records

### ADR-001: Why No Backend?
**Context**: AI image editing typically requires server processing
**Decision**: Client-side only with ONNX Runtime Web
**Rationale**: Simpler deployment, no server costs, privacy (images stay local), meets constitutional simplicity principle
**Consequences**: 20MB image limit, 2s inference latency, browser compatibility requirements

### ADR-002: Why Next.js for Library?
**Context**: User wants embeddable library, Next.js is app framework
**Decision**: Build as Next.js app, extract library to `src/lib/` for reusability
**Rationale**: Next.js provides dev experience, build tooling; library code is framework-agnostic
**Consequences**: Library users can import from `@/lib/canvas`, demo app shows integration

### ADR-003: Why Minimal Dependencies?
**Context**: User specified "minimal library installation"
**Decision**: Only essential deps (Next.js, React, Tailwind, shadcn/ui, ONNX)
**Rationale**: Smaller bundle, fewer security vulnerabilities, faster installs
**Consequences**: More custom code vs. off-the-shelf solutions (e.g., custom undo/redo vs. library)

---

**Research Complete**: All technical unknowns resolved, ready for Phase 1 (Design & Contracts)
