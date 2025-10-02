// @ts-nocheck
/**
 * Integration Test: Erase mask regions
 *
 * User Story: User draws a mask and then erases parts of it using the eraser tool.
 * Expected: Pixels where the eraser is applied should remove the red mask overlay.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Canvas } from '@/src/components/Canvas/Canvas';
import { CanvasProvider } from '@/src/lib/state/context';

describe('Integration: Erase Mask Regions', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should erase previously drawn mask at the target position', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    // Load an image so the canvas is initialized
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/load image/i);
    await user.upload(input, file);

    // Draw with brush
    const brushButton = screen.getByRole('button', { name: /brush/i });
    await user.click(brushButton);

    const canvas = screen.getByRole('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    await user.pointer([{ target: canvas, coords: { x: 120, y: 120 } }]);

    // Verify mask overlay applied (red component high)
    await waitFor(() => {
      const drawn = ctx?.getImageData(120, 120, 1, 1);
      expect(drawn?.data[0]).toBeGreaterThan(200);
    });

    // Select eraser and erase at same location
    const eraserButton = screen.getByRole('button', { name: /eraser/i });
    await user.click(eraserButton);
    await user.pointer([{ target: canvas, coords: { x: 120, y: 120 } }]);

    // Pixel should no longer be strongly red (mask removed)
    await waitFor(() => {
      const erased = ctx?.getImageData(120, 120, 1, 1);
      expect(erased?.data[0]).toBeLessThan(50);
    });
  });

  it('should not erase mask outside the eraser stroke region', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/load image/i);
    await user.upload(input, file);

    const brushButton = screen.getByRole('button', { name: /brush/i });
    await user.click(brushButton);

    const canvas = screen.getByRole('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // Draw two points
    await user.pointer([
      { target: canvas, coords: { x: 100, y: 100 } },
      { target: canvas, coords: { x: 150, y: 150 } },
    ]);

    // Ensure both points have mask applied
    await waitFor(() => {
      const a = ctx?.getImageData(100, 100, 1, 1);
      const b = ctx?.getImageData(150, 150, 1, 1);
      expect(a?.data[0]).toBeGreaterThan(200);
      expect(b?.data[0]).toBeGreaterThan(200);
    });

    // Erase only near first point
    const eraserButton = screen.getByRole('button', { name: /eraser/i });
    await user.click(eraserButton);
    await user.pointer([{ target: canvas, coords: { x: 100, y: 100 } }]);

    // First point should be cleared, second should remain
    await waitFor(() => {
      const a = ctx?.getImageData(100, 100, 1, 1);
      const b = ctx?.getImageData(150, 150, 1, 1);
      expect(a?.data[0]).toBeLessThan(50);
      expect(b?.data[0]).toBeGreaterThan(200);
    });
  });
});

