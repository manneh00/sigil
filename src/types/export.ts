/**
 * Export Data Types
 */

import type { BoundingBox } from './canvas';

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
