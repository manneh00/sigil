/**
 * Integration Test: Erase mask regions
 *
 * User Story: User erases part of an existing mask using the eraser tool.
 * Expected: Only the erased region is removed from the active layer; undo restores it.
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

  it('should erase part of a drawn mask on the active layer', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    // Load an image so drawing is enabled
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/load image/i);
    await user.upload(input, file);

    // Draw with brush first to create a mask area
    const brushButton = screen.getByRole('button', { name: /brush/i });
    await user.click(brushButton);

    const canvas = screen.getByRole('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // Draw mask at (120, 120)
    await user.pointer([
      { target: canvas, coords: { x: 120, y: 120 } },
      { target: canvas, coords: { x: 125, y: 120 } },
    ]);

    // Verify mask pixel is drawn (red-ish overlay expected per defaults)
    await waitFor(() => {
      const imageData = ctx?.getImageData(120, 120, 1, 1);
      expect(imageData?.data[0]).toBeGreaterThan(150); // Red channel > 150
    });

    // Switch to eraser and erase the previously drawn pixel
    const eraserButton = screen.getByRole('button', { name: /eraser/i });
    await user.click(eraserButton);

    await user.pointer([
      { target: canvas, coords: { x: 120, y: 120 } },
    ]);

    // Expect the mask at (120,120) to be cleared (red reduced significantly)
    await waitFor(() => {
      const imageData = ctx?.getImageData(120, 120, 1, 1);
      expect(imageData?.data[0]).toBeLessThan(50); // Red channel reduced
    });

    // Undo should restore erased mask
    await user.keyboard('{Control>}z{/Control}');

    await waitFor(() => {
      const imageData = ctx?.getImageData(120, 120, 1, 1);
      expect(imageData?.data[0]).toBeGreaterThan(150);
    });
  });
});

