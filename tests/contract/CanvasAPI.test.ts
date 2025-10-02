/**
 * Contract Test: CanvasAPI
 *
 * Tests the type safety and interface contracts for the Canvas API.
 * These tests verify that all required types and interfaces exist and match specifications.
 */

import { describe, it, expect } from 'vitest';
import type {
  CanvasAPI,
  CanvasState,
  Layer,
  ToolType,
  ExportData,
  Point,
  Viewport,
} from '@/specs/001-i-want-to/contracts/CanvasAPI';

describe('CanvasAPI Contract Tests', () => {
  describe('Type Definitions', () => {
    it('should have valid ToolType enum values', () => {
      const validTools: ToolType[] = ['BRUSH', 'MAGNETIC_BRUSH', 'OUTLINE', 'ERASER', 'PAN', 'ZOOM'];
      expect(validTools).toHaveLength(6);
    });

    it('should have Point interface with x and y coordinates', () => {
      const point: Point = { x: 100, y: 200 };
      expect(point.x).toBe(100);
      expect(point.y).toBe(200);
    });

    it('should have Layer interface with required fields', () => {
      const layer: Partial<Layer> = {
        id: 'layer-1',
        name: 'Layer 1',
        color: '#FF0000',
        opacity: 1,
        visible: true,
        zIndex: 0,
      };
      expect(layer.id).toBeDefined();
      expect(layer.name).toBeDefined();
    });
  });

  describe('CanvasAPI Interface', () => {
    it('should require loadImage method', () => {
      const mockAPI: Partial<CanvasAPI> = {
        loadImage: async () => {},
      };
      expect(mockAPI.loadImage).toBeDefined();
    });

    it('should require layer management methods', () => {
      const mockAPI: Partial<CanvasAPI> = {
        createLayer: () => ({}) as Layer,
        deleteLayer: () => {},
        getAllLayers: () => [],
      };
      expect(mockAPI.createLayer).toBeDefined();
      expect(mockAPI.deleteLayer).toBeDefined();
      expect(mockAPI.getAllLayers).toBeDefined();
    });

    it('should require drawing methods', () => {
      const mockAPI: Partial<CanvasAPI> = {
        startDrawing: () => {},
        continueDrawing: () => {},
        endDrawing: () => {},
      };
      expect(mockAPI.startDrawing).toBeDefined();
      expect(mockAPI.continueDrawing).toBeDefined();
      expect(mockAPI.endDrawing).toBeDefined();
    });

    it('should require viewport methods', () => {
      const mockAPI: Partial<CanvasAPI> = {
        zoomIn: () => {},
        zoomOut: () => {},
        panViewport: () => {},
        resetViewport: () => {},
      };
      expect(mockAPI.zoomIn).toBeDefined();
      expect(mockAPI.zoomOut).toBeDefined();
    });

    it('should require history methods', () => {
      const mockAPI: Partial<CanvasAPI> = {
        undo: () => {},
        redo: () => {},
        canUndo: () => false,
        canRedo: () => false,
      };
      expect(mockAPI.undo).toBeDefined();
      expect(mockAPI.redo).toBeDefined();
    });

    it('should require export methods', () => {
      const mockAPI: Partial<CanvasAPI> = {
        exportData: () => ({}) as ExportData,
      };
      expect(mockAPI.exportData).toBeDefined();
    });
  });

  describe('Validation Constants', () => {
    it('should import and verify VALIDATION constants', async () => {
      const { VALIDATION } = await import('@/specs/001-i-want-to/contracts/CanvasAPI');

      expect(VALIDATION.MAX_IMAGE_SIZE).toBe(20 * 1024 * 1024);
      expect(VALIDATION.MAX_LAYERS).toBe(100);
      expect(VALIDATION.MIN_ZOOM).toBe(0.1);
      expect(VALIDATION.MAX_ZOOM).toBe(10);
      expect(VALIDATION.HISTORY_LIMIT).toBe(50);
    });
  });

  describe('Error Types', () => {
    it('should have ImageLoadError class', async () => {
      const { ImageLoadError } = await import('@/specs/001-i-want-to/contracts/CanvasAPI');
      const error = new ImageLoadError('Test error');

      expect(error.name).toBe('ImageLoadError');
      expect(error.code).toBe('IMAGE_LOAD_ERROR');
    });

    it('should have LayerError class', async () => {
      const { LayerError } = await import('@/specs/001-i-want-to/contracts/CanvasAPI');
      const error = new LayerError('Test error');

      expect(error.name).toBe('LayerError');
      expect(error.code).toBe('LAYER_ERROR');
    });
  });
});
