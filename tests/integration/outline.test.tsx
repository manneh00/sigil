/**
 * Integration Test: Outline Tool - Polygon Drawing
 *
 * User Story: User places points with the outline tool to create a closed polygon mask.
 * Expected: After placing 3+ points, closing the polygon creates a new mask layer.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Canvas } from '@/src/components/Canvas/Canvas';
import { CanvasProvider } from '@/src/lib/state/context';

describe('Integration: Outline Tool - Polygon Drawing', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should create a polygon mask after placing points and pressing Enter', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    // Load an image first (mirrors other integration tests)
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/load image/i);
    await user.upload(input, file);

    // Select outline tool
    const outlineButton = screen.getByRole('button', { name: /outline/i });
    await user.click(outlineButton);

    // Place three points
    const canvas = screen.getByRole('canvas');
    await user.pointer([
      { target: canvas, coords: { x: 100, y: 100 } },
      { target: canvas, coords: { x: 160, y: 120 } },
      { target: canvas, coords: { x: 120, y: 160 } },
    ]);

    // Close polygon via Enter key
    await user.keyboard('{Enter}');

    // Expect a new layer to be created (consistent with other tests)
    await waitFor(() => {
      expect(screen.getByText(/layer 1/i)).toBeInTheDocument();
    });
  });

  it('should close the polygon when clicking near the first point', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/load image/i);
    await user.upload(input, file);

    const outlineButton = screen.getByRole('button', { name: /outline/i });
    await user.click(outlineButton);

    const canvas = screen.getByRole('canvas');

    // Place three points, then click near the first point to close
    await user.pointer([
      { target: canvas, coords: { x: 200, y: 200 } },
      { target: canvas, coords: { x: 260, y: 220 } },
      { target: canvas, coords: { x: 220, y: 260 } },
      { target: canvas, coords: { x: 202, y: 202 } }, // near first point
    ]);

    await waitFor(() => {
      expect(screen.getByText(/layer 1/i)).toBeInTheDocument();
    });
  });
});

