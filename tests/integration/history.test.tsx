/**
 * Integration Test: Undo/Redo Functionality
 *
 * User Story: User can undo and redo drawing operations.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Canvas } from '@/src/components/Canvas/Canvas';
import { CanvasProvider } from '@/src/lib/state/context';

describe('Integration: Undo/Redo', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should undo a drawing action', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    // Draw something
    const canvas = screen.getByRole('canvas');
    await user.pointer([{ target: canvas, coords: { x: 100, y: 100 } }]);

    // Undo
    await user.keyboard('{Control>}z{/Control}');

    const undoButton = screen.getByRole('button', { name: /undo/i });
    expect(undoButton).toBeDisabled();
  });

  it('should redo an undone action', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    const canvas = screen.getByRole('canvas');
    await user.pointer([{ target: canvas, coords: { x: 100, y: 100 } }]);

    await user.keyboard('{Control>}z{/Control}');
    await user.keyboard('{Control>}{Shift>}z{/Shift}{/Control}');

    const redoButton = screen.getByRole('button', { name: /redo/i });
    expect(redoButton).toBeDisabled();
  });

  it('should maintain history limit of 50 actions', async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    const canvas = screen.getByRole('canvas');

    // Perform 51 actions
    for (let i = 0; i < 51; i++) {
      await user.pointer([{ target: canvas, coords: { x: 100 + i, y: 100 } }]);
    }

    // Undo 50 times
    for (let i = 0; i < 50; i++) {
      await user.keyboard('{Control>}z{/Control}');
    }

    const undoButton = screen.getByRole('button', { name: /undo/i });
    expect(undoButton).toBeDisabled();
  });
});
