/**
 * Canvas API Contract
 *
 * Defines the public interface for the AI Image Editing Canvas library.
 * This contract ensures type safety and documents the expected behavior
 * for all canvas operations.
 */

// ============================================================================
// Core Types
// ============================================================================

export type ToolType = 'BRUSH' | 'MAGNETIC_BRUSH' | 'OUTLINE' | 'ERASER' | 'PAN' | 'ZOOM';

export type ImageFormat = 'png' | 'jpg' | 'webp';

export type ActionType =
  | 'DRAW'
  | 'ERASE'
  | 'LAYER_ADD'
  | 'LAYER_DELETE'
  | 'LAYER_REORDER'
  | 'LAYER_RENAME'
  | 'LAYER_COLOR'
  | 'VIEWPORT_CHANGE';

// ============================================================================
// Entities
// ============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasImage {
  id: string;
  data: ImageData;
  dimensions: Dimensions;
  fileSize: number;
  fileName: string;
  format: ImageFormat;
  loadedAt: Date;
}

export interface Layer {
  id: string;
  name: string;
  maskData: ImageData;
  color: string; // Hex color (#RRGGBB or #RRGGBBAA)
  opacity: number; // 0-1
  visible: boolean;
  zIndex: number;
  bounds: BoundingBox;
  thumbnail: string; // Base64 data URL
  createdAt: Date;
  modifiedAt: Date;
}

export interface Viewport {
  zoom: number; // 0.1 to 10
  pan: Point;
  canvasDimensions: Dimensions;
  viewportDimensions: Dimensions;
}

export interface HistoryState {
  past: CanvasState[];
  present: CanvasState;
  future: CanvasState[];
}

export interface UIState {
  isDrawing: boolean;
  isPanning: boolean;
  isLoading: boolean;
  error: string | null;
  selectedLayerId: string | null;
  toolPanelOpen: boolean;
  layerPanelOpen: boolean;
}

export interface CanvasState {
  image: CanvasImage | null;
  layers: Layer[];
  activeLayerId: string | null;
  activeTool: ToolType;
  viewport: Viewport;
  history: HistoryState;
  ui: UIState;
}

// ============================================================================
// Tool Settings
// ============================================================================

export interface BrushSettings {
  size: number; // 5-100px
  smoothing: number; // 0-1
}

export interface MagneticBrushSettings {
  threshold: number; // 0-1, edge detection sensitivity
  isModelLoaded: boolean;
}

export interface OutlineSettings {
  points: Point[];
  isClosed: boolean;
}

export interface EraserSettings {
  size: number; // 5-100px
}

export type ToolSettings =
  | BrushSettings
  | MagneticBrushSettings
  | OutlineSettings
  | EraserSettings;

// ============================================================================
// Export Format
// ============================================================================

export interface MaskExport {
  id: string;
  name: string;
  color: string;
  maskData: string; // Base64-encoded PNG
  bounds: BoundingBox;
  zIndex: number;
}

export interface ExportMetadata {
  exportedAt: string; // ISO 8601
  layerCount: number;
  canvasVersion: string;
}

export interface ExportData {
  version: string;
  image: {
    width: number;
    height: number;
    fileName: string;
  };
  masks: MaskExport[];
  metadata: ExportMetadata;
}

// ============================================================================
// Canvas API Methods
// ============================================================================

export interface CanvasAPI {
  // Image Operations
  loadImage(file: File): Promise<void>;
  clearImage(): void;
  getImage(): CanvasImage | null;

  // Layer Operations
  createLayer(name?: string): Layer;
  deleteLayer(layerId: string): void;
  renameLayer(layerId: string, newName: string): void;
  setLayerColor(layerId: string, color: string): void;
  setLayerOpacity(layerId: string, opacity: number): void;
  setLayerVisibility(layerId: string, visible: boolean): void;
  reorderLayer(layerId: string, direction: 'up' | 'down'): void;
  getLayer(layerId: string): Layer | null;
  getAllLayers(): Layer[];
  setActiveLayer(layerId: string): void;

  // Drawing Operations
  startDrawing(point: Point): void;
  continueDrawing(point: Point): void;
  endDrawing(): void;
  erase(point: Point): void;
  applyMagneticBrush(point: Point): Promise<void>;
  addOutlinePoint(point: Point): void;
  closeOutline(): void;

  // Tool Operations
  setActiveTool(tool: ToolType): void;
  getActiveTool(): ToolType;
  setBrushSize(size: number): void;
  setEraserSize(size: number): void;

  // Viewport Operations
  zoomIn(): void;
  zoomOut(): void;
  setZoom(zoom: number): void;
  panViewport(delta: Point): void;
  resetViewport(): void;
  fitToScreen(): void;

  // History Operations
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;

  // Export Operations
  exportData(): ExportData;
  exportMaskPNG(layerId: string): Promise<Blob>;
  exportAllMasksPNG(): Promise<Blob[]>;

  // State Access
  getState(): CanvasState;
  subscribe(callback: (state: CanvasState) => void): () => void;
}

// ============================================================================
// Error Types
// ============================================================================

export class CanvasError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'CanvasError';
  }
}

export class ImageLoadError extends CanvasError {
  constructor(message: string, details?: unknown) {
    super(message, 'IMAGE_LOAD_ERROR', details);
    this.name = 'ImageLoadError';
  }
}

export class LayerError extends CanvasError {
  constructor(message: string, details?: unknown) {
    super(message, 'LAYER_ERROR', details);
    this.name = 'LayerError';
  }
}

export class ToolError extends CanvasError {
  constructor(message: string, details?: unknown) {
    super(message, 'TOOL_ERROR', details);
    this.name = 'ToolError';
  }
}

export class ExportError extends CanvasError {
  constructor(message: string, details?: unknown) {
    super(message, 'EXPORT_ERROR', details);
    this.name = 'ExportError';
  }
}

// ============================================================================
// Validation Constants
// ============================================================================

export const VALIDATION = {
  MAX_IMAGE_SIZE: 20 * 1024 * 1024, // 20MB in bytes
  MAX_LAYERS: 100,
  MIN_LAYER_NAME_LENGTH: 1,
  MAX_LAYER_NAME_LENGTH: 50,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 10,
  MIN_BRUSH_SIZE: 5,
  MAX_BRUSH_SIZE: 100,
  MIN_OPACITY: 0,
  MAX_OPACITY: 1,
  HISTORY_LIMIT: 50,
  THUMBNAIL_SIZE: 80, // 80x80px
  MAGNETIC_BRUSH_TIMEOUT: 2000, // 2 seconds
} as const;

// ============================================================================
// React Hook Type (for components)
// ============================================================================

export interface UseCanvasReturn {
  state: CanvasState;
  api: CanvasAPI;
  isReady: boolean;
  error: string | null;
}
