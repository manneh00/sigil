/**
 * Integration Test: Load image and draw mask
 *
 * User Story: User loads an image and draws a mask using the brush tool.
 * Expected: Canvas displays image, brush creates visible mask on active layer.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Canvas } from '@/src/components/Canvas/Canvas';
import { CanvasProvider } from '@/src/lib/state/context';

describe('Integration: Load Image and Draw Mask', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should load an image file and display on canvas', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    // Create a mock image file
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/load image/i);

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  it('should create a new layer when drawing starts', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    // Load image first
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/load image/i);
    await user.upload(input, file);

    // Select brush tool
    const brushButton = screen.getByRole('button', { name: /brush/i });
    await user.click(brushButton);

    // Draw on canvas
    const canvas = screen.getByRole('canvas');
    await user.pointer([
      { target: canvas, coords: { x: 100, y: 100 } },
      { target: canvas, coords: { x: 150, y: 150 } },
    ]);

    // Verify layer was created
    await waitFor(() => {
      expect(screen.getByText(/layer 1/i)).toBeInTheDocument();
    });
  });

  it('should display mask overlay with default red color', async () => {
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

    const canvas = screen.getByRole('canvas');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');

    await user.pointer([
      { target: canvas, coords: { x: 100, y: 100 } },
    ]);

    await waitFor(() => {
      const imageData = ctx?.getImageData(100, 100, 1, 1);
      // Expect red color (255, 0, 0) with some alpha
      expect(imageData?.data[0]).toBeGreaterThan(200); // Red channel
    });
  });

  it('should show error for oversized images', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    // Create a file larger than 20MB
    const largeFile = new File(['x'.repeat(21 * 1024 * 1024)], 'large.png', {
      type: 'image/png',
    });
    const input = screen.getByLabelText(/load image/i);

    await user.upload(input, largeFile);

    await waitFor(() => {
      expect(screen.getByText(/image too large/i)).toBeInTheDocument();
    });
  });
});
