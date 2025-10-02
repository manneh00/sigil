/**
 * Integration Test: Zoom and Pan Operations
 *
 * User Story: User can zoom in/out and pan the canvas viewport.
 * Expected: Zoom updates scale within bounds, pan updates translate offset, reset restores defaults.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Canvas } from '@/src/components/Canvas/Canvas';
import { CanvasProvider } from '@/src/lib/state/context';

describe('Integration: Viewport - Zoom and Pan', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should zoom in and out updating zoom value and control states', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    const zoomInBtn = screen.getByRole('button', { name: /zoom in/i });
    const zoomOutBtn = screen.getByRole('button', { name: /zoom out/i });
    const resetBtn = screen.getByRole('button', { name: /reset view/i });

    expect(zoomInBtn).toBeEnabled();
    expect(zoomOutBtn).toBeEnabled();
    expect(resetBtn).toBeEnabled();

    await user.click(zoomInBtn);
    await user.click(zoomInBtn);

    // Zoom display should reflect >1x
    const zoomDisplay = screen.getByText(/zoom:\s*\d+(\.\d+)?x/i);
    expect(zoomDisplay).toBeInTheDocument();

    await user.click(zoomOutBtn);
    await user.click(zoomOutBtn);

    // After zooming out twice from default, ensure clamped at minimum or <=1x
    const zoomText = screen.getByText(/zoom:\s*([0-9]+(\.[0-9]+)?)x/i).textContent || '';
    const match = zoomText.match(/([0-9]+(\.[0-9]+)?)x/i);
    const numeric = match ? parseFloat(match[1]) : NaN;
    expect(Number.isNaN(numeric)).toBe(false);
    expect(numeric).toBeGreaterThan(0.09);

    await user.click(resetBtn);
    expect(screen.getByText(/zoom:\s*1x/i)).toBeInTheDocument();
  });

  it('should pan when dragging with space modifier held', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    const canvas = screen.getByRole('canvas');

    // Hold space to activate pan, then drag
    await user.keyboard('{Space>}');
    await user.pointer([
      { target: canvas, coords: { x: 200, y: 200 }, keys: '[Space]' },
      { target: canvas, coords: { x: 150, y: 150 }, keys: '[Space]' },
    ]);
    await user.keyboard('{/Space}');

    // Expect pan readout to change from 0,0 to some non-zero translate
    const panDisplay = screen.getByText(/pan:\s*-?\d+\s*,\s*-?\d+/i);
    expect(panDisplay).toBeInTheDocument();
    const text = panDisplay.textContent || '';
    const numbers = text.match(/-?\d+/g) || [];
    expect(numbers.length).toBeGreaterThanOrEqual(2);
    const dx = parseInt(numbers[0] || '0', 10);
    const dy = parseInt(numbers[1] || '0', 10);
    expect(Math.abs(dx) + Math.abs(dy)).toBeGreaterThan(0);
  });
});

