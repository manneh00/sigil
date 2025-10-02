/**
 * Layer Manager Contract
 *
 * Defines the interface for layer management operations including
 * creation, deletion, reordering, and rendering.
 */

import type { Layer, BoundingBox, Point } from './CanvasAPI';

// ============================================================================
// Layer Manager Interface
// ============================================================================

export interface LayerManager {
  // Layer Lifecycle
  create(name?: string, color?: string): Layer;
  delete(layerId: string): void;
  get(layerId: string): Layer | null;
  getAll(): Layer[];
  exists(layerId: string): boolean;

  // Layer Properties
  rename(layerId: string, newName: string): void;
  setColor(layerId: string, color: string): void;
  setOpacity(layerId: string, opacity: number): void;
  setVisibility(layerId: string, visible: boolean): void;

  // Layer Ordering
  reorder(layerId: string, newZIndex: number): void;
  moveUp(layerId: string): void;
  moveDown(layerId: string): void;
  moveToTop(layerId: string): void;
  moveToBottom(layerId: string): void;
  getZOrder(): string[]; // Returns layer IDs in z-order (bottom to top)

  // Mask Operations
  drawOnLayer(layerId: string, points: Point[], color: string): void;
  eraseFromLayer(layerId: string, points: Point[]): void;
  applyMaskData(layerId: string, maskData: ImageData, bounds: BoundingBox): void;
  getMaskData(layerId: string): ImageData | null;
  clearMask(layerId: string): void;

  // Thumbnail Operations
  generateThumbnail(layerId: string): Promise<string>; // Returns base64 data URL
  updateThumbnail(layerId: string): Promise<void>;

  // Batch Operations
  deleteMultiple(layerIds: string[]): void;
  setMultipleVisibility(layerIds: string[], visible: boolean): void;
  mergeDown(layerId: string): void; // Merge layer with layer below

  // Query Operations
  getVisibleLayers(): Layer[];
  getLayersByZRange(minZ: number, maxZ: number): Layer[];
  getLayerAt(point: Point): Layer | null; // Get topmost layer at point
  getLayersInBounds(bounds: BoundingBox): Layer[];

  // Validation
  validateLayerName(name: string): boolean;
  validateColor(color: string): boolean;
  canReorder(layerId: string, direction: 'up' | 'down'): boolean;
  canMergeDown(layerId: string): boolean;
}

// ============================================================================
// Layer Renderer Interface
// ============================================================================

export interface LayerRenderer {
  // Rendering
  renderLayer(layer: Layer, context: CanvasRenderingContext2D): void;
  renderAllLayers(layers: Layer[], context: CanvasRenderingContext2D): void;
  renderComposite(
    layers: Layer[],
    context: CanvasRenderingContext2D,
    bounds?: BoundingBox
  ): void;

  // Optimization
  shouldRenderLayer(layer: Layer, viewportBounds: BoundingBox): boolean;
  getDirtyRegion(layer: Layer): BoundingBox | null;
  markDirty(layerId: string, bounds: BoundingBox): void;
  clearDirty(layerId: string): void;

  // Performance
  getFrameTime(): number; // Last frame render time in ms
  getTargetFPS(): number; // Should return 60
  isPerformanceOptimal(): boolean; // Returns false if consistently below 60fps
}

// ============================================================================
// Layer Compositor Interface
// ============================================================================

export interface LayerCompositor {
  // Compositing
  compositeLayer(
    layer: Layer,
    targetCanvas: HTMLCanvasElement,
    blendMode?: BlendMode
  ): void;
  compositeLayers(
    layers: Layer[],
    targetCanvas: HTMLCanvasElement
  ): void;
  compositeVisible(
    layers: Layer[],
    targetCanvas: HTMLCanvasElement
  ): void;

  // Offscreen Rendering
  createOffscreenCanvas(width: number, height: number): OffscreenCanvas | HTMLCanvasElement;
  renderToOffscreen(
    layer: Layer,
    offscreen: OffscreenCanvas | HTMLCanvasElement
  ): void;

  // Alpha Blending
  applyAlpha(
    sourceCanvas: HTMLCanvasElement,
    alpha: number,
    targetCanvas: HTMLCanvasElement
  ): void;
  blendLayers(
    bottomLayer: Layer,
    topLayer: Layer,
    blendMode: BlendMode
  ): ImageData;
}

// ============================================================================
// Supporting Types
// ============================================================================

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';

export interface LayerBounds {
  layerId: string;
  bounds: BoundingBox;
  isDirty: boolean;
}

export interface LayerMetrics {
  layerId: string;
  pixelCount: number; // Number of non-transparent pixels
  memorySize: number; // Estimated memory in bytes
  lastModified: Date;
  renderTime: number; // Average render time in ms
}

// ============================================================================
// Layer Events
// ============================================================================

export type LayerEventType =
  | 'layer:created'
  | 'layer:deleted'
  | 'layer:renamed'
  | 'layer:reordered'
  | 'layer:modified'
  | 'layer:visibility_changed';

export interface LayerEvent {
  type: LayerEventType;
  layerId: string;
  timestamp: Date;
  payload?: unknown;
}

export type LayerEventCallback = (event: LayerEvent) => void;

export interface LayerEventEmitter {
  on(eventType: LayerEventType, callback: LayerEventCallback): void;
  off(eventType: LayerEventType, callback: LayerEventCallback): void;
  emit(event: LayerEvent): void;
}

// ============================================================================
// Layer Validation
// ============================================================================

export interface LayerValidation {
  // Validation Rules
  isValidName(name: string): boolean;
  isValidColor(color: string): boolean;
  isValidOpacity(opacity: number): boolean;
  isValidZIndex(zIndex: number, totalLayers: number): boolean;
  isValidBounds(bounds: BoundingBox, canvasDimensions: { width: number; height: number }): boolean;

  // Error Messages
  getNameError(name: string): string | null;
  getColorError(color: string): string | null;
  getOpacityError(opacity: number): string | null;
}

// ============================================================================
// Layer Factory
// ============================================================================

export interface LayerFactory {
  // Creation Methods
  createEmpty(name?: string, color?: string): Layer;
  createFromImageData(imageData: ImageData, name?: string, color?: string): Layer;
  createFromFile(file: File): Promise<Layer>;
  clone(layer: Layer, newName?: string): Layer;

  // Template Layers
  createRectangleMask(bounds: BoundingBox, color: string): Layer;
  createEllipseMask(bounds: BoundingBox, color: string): Layer;
  createPolygonMask(points: Point[], color: string): Layer;
}

// ============================================================================
// Performance Monitoring
// ============================================================================

export interface LayerPerformanceMonitor {
  startFrame(): void;
  endFrame(): void;
  recordLayerRender(layerId: string, duration: number): void;
  getMetrics(layerId: string): LayerMetrics | null;
  getAllMetrics(): LayerMetrics[];
  isPerformanceCritical(): boolean; // True if render time > 16.67ms
  getAverageFrameTime(): number;
  getDroppedFrames(): number;
}

// ============================================================================
// Constants
// ============================================================================

export const LAYER_CONSTANTS = {
  DEFAULT_COLOR: '#FF0000',
  DEFAULT_NAME_PREFIX: 'Layer',
  DEFAULT_OPACITY: 1,
  DEFAULT_VISIBILITY: true,
  THUMBNAIL_SIZE: 80,
  MAX_LAYERS: 100,
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 50,
} as const;

export const PERFORMANCE_THRESHOLDS = {
  TARGET_FPS: 60,
  FRAME_BUDGET_MS: 16.67, // 1000ms / 60fps
  MAX_RENDER_TIME_MS: 14, // Leave buffer for browser overhead
  SLOW_FRAME_THRESHOLD: 20,
} as const;
