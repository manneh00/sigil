/**
 * Tool System Contract
 *
 * Defines the interface for drawing tools including brush, eraser,
 * magnetic brush, and outline tools.
 */

import type { Point, ToolType, BoundingBox } from './CanvasAPI';

// ============================================================================
// Base Tool Interface
// ============================================================================

export interface Tool {
  readonly type: ToolType;
  readonly name: string;
  readonly icon: string; // Icon identifier
  readonly cursor: string; // CSS cursor value

  // Lifecycle
  activate(): void;
  deactivate(): void;
  isActive(): boolean;

  // Input Handling
  onMouseDown(point: Point, context: ToolContext): void;
  onMouseMove(point: Point, context: ToolContext): void;
  onMouseUp(point: Point, context: ToolContext): void;
  onKeyDown(key: string, context: ToolContext): void;
  onKeyUp(key: string, context: ToolContext): void;

  // Rendering
  renderPreview(context: CanvasRenderingContext2D): void; // For cursor preview
  renderOverlay(context: CanvasRenderingContext2D): void; // For guides/overlays

  // Settings
  getSettings(): ToolSettings;
  updateSettings(settings: Partial<ToolSettings>): void;
}

// ============================================================================
// Tool Context
// ============================================================================

export interface ToolContext {
  // Canvas State
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  activeLayerId: string | null;
  imageData: ImageData | null;

  // Viewport State
  zoom: number;
  pan: Point;

  // Modifiers
  isShiftPressed: boolean;
  isCtrlPressed: boolean;
  isAltPressed: boolean;

  // Methods
  getLayerContext(layerId: string): CanvasRenderingContext2D | null;
  commitDrawing(): void;
  requestRender(): void;
}

// ============================================================================
// Brush Tool
// ============================================================================

export interface BrushTool extends Tool {
  readonly type: 'BRUSH';

  // Brush-specific settings
  setSize(size: number): void;
  getSize(): number;
  setSmoothing(smoothing: number): void;
  getSmoothing(): number;

  // Drawing operations
  startStroke(point: Point, context: ToolContext): void;
  continueStroke(point: Point, context: ToolContext): void;
  endStroke(point: Point, context: ToolContext): void;

  // Stroke data
  getCurrentStroke(): Point[];
  getStrokeBounds(): BoundingBox | null;
}

export interface BrushSettings {
  size: number; // 5-100px
  smoothing: number; // 0-1 (higher = smoother curves)
  color: string; // Inherited from active layer
  opacity: number; // Inherited from active layer
}

// ============================================================================
// Eraser Tool
// ============================================================================

export interface EraserTool extends Tool {
  readonly type: 'ERASER';

  // Eraser-specific settings
  setSize(size: number): void;
  getSize(): number;

  // Erasing operations
  startErase(point: Point, context: ToolContext): void;
  continueErase(point: Point, context: ToolContext): void;
  endErase(point: Point, context: ToolContext): void;

  // Erase data
  getErasedBounds(): BoundingBox | null;
}

export interface EraserSettings {
  size: number; // 5-100px
}

// ============================================================================
// Magnetic Brush Tool
// ============================================================================

export interface MagneticBrushTool extends Tool {
  readonly type: 'MAGNETIC_BRUSH';

  // Model management
  isModelLoaded(): boolean;
  loadModel(): Promise<void>;
  unloadModel(): void;

  // Settings
  setThreshold(threshold: number): void;
  getThreshold(): number;

  // Segmentation
  segment(point: Point, context: ToolContext): Promise<SegmentationResult>;
  applySegmentation(result: SegmentationResult, context: ToolContext): void;

  // Status
  getLoadingProgress(): number; // 0-1
  getLastInferenceTime(): number; // ms
}

export interface MagneticBrushSettings {
  threshold: number; // 0-1 (edge detection sensitivity)
  isModelLoaded: boolean;
  modelPath: string;
  maxInferenceTime: number; // 2000ms
}

export interface SegmentationResult {
  mask: ImageData;
  bounds: BoundingBox;
  confidence: number; // 0-1
  inferenceTime: number; // ms
}

// ============================================================================
// Outline Tool
// ============================================================================

export interface OutlineTool extends Tool {
  readonly type: 'OUTLINE';

  // Point management
  addPoint(point: Point, context: ToolContext): void;
  removeLastPoint(): void;
  clearPoints(): void;
  closePolygon(context: ToolContext): void;

  // Point data
  getPoints(): Point[];
  getPointCount(): number;
  isPolygonClosed(): boolean;

  // Validation
  canClose(): boolean; // True if >= 3 points
  getPolygonBounds(): BoundingBox | null;
}

export interface OutlineSettings {
  points: Point[];
  isClosed: boolean;
  lineWidth: number; // Guide line width
  handleSize: number; // Point handle size in pixels
}

// ============================================================================
// Pan Tool
// ============================================================================

export interface PanTool extends Tool {
  readonly type: 'PAN';

  // Pan operations
  startPan(point: Point): void;
  continuePan(point: Point): void;
  endPan(): void;

  // Pan data
  getTotalDelta(): Point;
}

// ============================================================================
// Zoom Tool
// ============================================================================

export interface ZoomTool extends Tool {
  readonly type: 'ZOOM';

  // Zoom operations
  zoomIn(center: Point): void;
  zoomOut(center: Point): void;
  zoomTo(level: number, center: Point): void;
  zoomToFit(): void;
  zoomToActual(): void; // 100%

  // Zoom data
  getCurrentZoom(): number;
  getZoomRange(): { min: number; max: number };
}

// ============================================================================
// Tool Manager
// ============================================================================

export interface ToolManager {
  // Tool Registration
  registerTool(tool: Tool): void;
  unregisterTool(toolType: ToolType): void;
  getTool(toolType: ToolType): Tool | null;
  getAllTools(): Tool[];

  // Active Tool
  setActiveTool(toolType: ToolType): void;
  getActiveTool(): Tool | null;
  getActiveToolType(): ToolType | null;

  // Tool State
  isToolActive(toolType: ToolType): boolean;
  canActivateTool(toolType: ToolType): boolean;

  // Shortcuts
  registerShortcut(key: string, toolType: ToolType): void;
  getShortcut(key: string): ToolType | null;
  getToolShortcut(toolType: ToolType): string | null;
}

// ============================================================================
// Tool Settings
// ============================================================================

export type ToolSettings =
  | BrushSettings
  | EraserSettings
  | MagneticBrushSettings
  | OutlineSettings;

export interface ToolSettingsManager {
  // Settings Management
  getSettings(toolType: ToolType): ToolSettings;
  updateSettings(toolType: ToolType, settings: Partial<ToolSettings>): void;
  resetSettings(toolType: ToolType): void;
  saveSettings(): void; // Persist to localStorage
  loadSettings(): void; // Load from localStorage

  // Presets
  savePreset(toolType: ToolType, presetName: string): void;
  loadPreset(toolType: ToolType, presetName: string): void;
  deletePreset(toolType: ToolType, presetName: string): void;
  getPresets(toolType: ToolType): string[];
}

// ============================================================================
// Drawing Operations
// ============================================================================

export interface DrawingOperation {
  // Basic drawing
  drawLine(
    from: Point,
    to: Point,
    context: CanvasRenderingContext2D,
    style: DrawStyle
  ): void;
  drawCircle(
    center: Point,
    radius: number,
    context: CanvasRenderingContext2D,
    style: DrawStyle
  ): void;
  drawPolygon(
    points: Point[],
    context: CanvasRenderingContext2D,
    style: DrawStyle
  ): void;

  // Stroke smoothing
  smoothStroke(points: Point[], smoothing: number): Point[];
  simplifyStroke(points: Point[], tolerance: number): Point[];

  // Bounds calculation
  calculateStrokeBounds(points: Point[], strokeWidth: number): BoundingBox;
  calculatePolygonBounds(points: Point[]): BoundingBox;

  // Flood fill
  floodFill(
    startPoint: Point,
    fillColor: string,
    imageData: ImageData,
    tolerance: number
  ): ImageData;
}

export interface DrawStyle {
  color: string;
  lineWidth: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
  opacity: number;
}

// ============================================================================
// Cursor Manager
// ============================================================================

export interface CursorManager {
  // Cursor operations
  setCursor(cursor: string): void;
  setCustomCursor(dataUrl: string, hotspot: Point): void;
  resetCursor(): void;

  // Cursor rendering
  renderBrushCursor(size: number, color: string): string; // Returns data URL
  renderEraserCursor(size: number): string;
  renderCrosshairCursor(): string;
}

// ============================================================================
// Tool Validation
// ============================================================================

export interface ToolValidation {
  // Brush validation
  isValidBrushSize(size: number): boolean;
  isValidSmoothing(smoothing: number): boolean;

  // Eraser validation
  isValidEraserSize(size: number): boolean;

  // Magnetic brush validation
  isValidThreshold(threshold: number): boolean;
  canUseMagneticBrush(): boolean; // Check if model loaded and image present

  // Outline validation
  canCloseOutline(points: Point[]): boolean;
  isValidPolygon(points: Point[]): boolean;

  // Error messages
  getBrushSizeError(size: number): string | null;
  getThresholdError(threshold: number): string | null;
}

// ============================================================================
// Constants
// ============================================================================

export const TOOL_CONSTANTS = {
  MIN_BRUSH_SIZE: 5,
  MAX_BRUSH_SIZE: 100,
  DEFAULT_BRUSH_SIZE: 20,
  MIN_ERASER_SIZE: 5,
  MAX_ERASER_SIZE: 100,
  DEFAULT_ERASER_SIZE: 20,
  MIN_THRESHOLD: 0,
  MAX_THRESHOLD: 1,
  DEFAULT_THRESHOLD: 0.7,
  MIN_SMOOTHING: 0,
  MAX_SMOOTHING: 1,
  DEFAULT_SMOOTHING: 0.5,
  MIN_OUTLINE_POINTS: 3,
  OUTLINE_HANDLE_SIZE: 8,
  OUTLINE_LINE_WIDTH: 2,
} as const;

export const TOOL_SHORTCUTS = {
  BRUSH: 'b',
  ERASER: 'e',
  MAGNETIC_BRUSH: 'm',
  OUTLINE: 'o',
  PAN: ' ', // Space
  ZOOM: 'z',
} as const;

export const CURSOR_STYLES = {
  BRUSH: 'crosshair',
  ERASER: 'crosshair',
  MAGNETIC_BRUSH: 'crosshair',
  OUTLINE: 'crosshair',
  PAN: 'grab',
  ZOOM: 'zoom-in',
} as const;
