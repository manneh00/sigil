/**
 * Integration Test: Export mask data
 *
 * User Story: User exports project data including mask information.
 * Expected: Export returns structured data with masks array and metadata fields.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

// These components/providers are referenced by other integration tests in this repo.
// They may not be implemented yet; per TDD this test should fail until implemented.
import { Canvas } from '@/src/components/Canvas/Canvas';
import { CanvasProvider } from '@/src/lib/state/context';

describe('Integration: Export Mask Data', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should export data with at least one mask and metadata', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    // Load an image to enable drawing and exporting
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/load image/i);
    await user.upload(input, file);

    // Draw something to ensure a mask exists
    const brushButton = screen.getByRole('button', { name: /brush/i });
    await user.click(brushButton);
    const canvas = screen.getByRole('canvas');
    await user.pointer([
      { target: canvas, coords: { x: 50, y: 50 } },
      { target: canvas, coords: { x: 100, y: 100 } },
    ]);

    // Trigger export via an export button in the UI, or fall back to API exposed by Canvas
    // Prefer a button to simulate real user flow if available
    let exportButton: HTMLElement | null = null;
    try {
      exportButton = screen.getByRole('button', { name: /export/i });
    } catch {
      // noop - button may not exist yet in early phases
    }

    let exportData: any;
    if (exportButton) {
      await user.click(exportButton);
      // If the UI downloads a file, it might not expose data directly.
      // In early phases, we assume Canvas component exposes a testing hook.
    }

    // Try to access a testing hook on the Canvas component if available.
    // We look for a role or test-id that provides export JSON for tests.
    const exportOutput = screen.queryByTestId('export-json');
    if (exportOutput) {
      exportData = JSON.parse(exportOutput.textContent || '{}');
    } else {
      // As a fallback for early design: call a global/testing handle if present.
      // @ts-ignore
      const testingApi = (window as any).__CANVAS_TESTING_API__;
      if (testingApi && typeof testingApi.exportData === 'function') {
        exportData = testingApi.exportData();
      }
    }

    // Validate export shape. Until implementation exists, this will fail (TDD expected).
    await waitFor(() => {
      expect(exportData).toBeDefined();
      expect(typeof exportData.version).toBe('string');
      expect(exportData.image).toBeDefined();
      expect(typeof exportData.image.width).toBe('number');
      expect(typeof exportData.image.height).toBe('number');
      expect(typeof exportData.image.fileName).toBe('string');

      expect(Array.isArray(exportData.masks)).toBe(true);
      expect(exportData.masks.length).toBeGreaterThan(0);

      const firstMask = exportData.masks[0];
      expect(typeof firstMask.id).toBe('string');
      expect(typeof firstMask.name).toBe('string');
      expect(typeof firstMask.color).toBe('string');
      expect(typeof firstMask.maskData).toBe('string');
      expect(firstMask.bounds).toBeDefined();
      expect(typeof firstMask.zIndex).toBe('number');

      expect(exportData.metadata).toBeDefined();
      expect(typeof exportData.metadata.exportedAt).toBe('string');
      expect(typeof exportData.metadata.layerCount).toBe('number');
    });
  });
});

