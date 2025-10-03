/**
 * Integration Test: Layer Reordering and Visibility
 *
 * User Story: User can reorder layers (up/down/top/bottom) and toggle visibility.
 * Expected: Reorder controls adjust the visual/DOM order; visibility toggles reflect state.
 * Notes: Structure mirrors other integration tests and may use placeholder assertions
 *        until implementation is available.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { LayerPanel } from '@/src/components/LayerPanel/LayerPanel';
import { CanvasProvider } from '@/src/lib/state/context';

describe('Integration: Layer Reordering and Visibility', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should reorder layers using move up/down controls', async () => {
    render(
      <CanvasProvider>
        <LayerPanel />
      </CanvasProvider>
    );

    const addButton = screen.getByRole('button', { name: /new layer/i });
    await user.click(addButton);
    await user.click(addButton);
    await user.click(addButton);

    // Move the first layer up twice; expect its position to change relative to others
    const moveUpButtons = screen.getAllByRole('button', { name: /move up/i });
    // Click move up on the first listed layer twice
    await user.click(moveUpButtons[0]);
    await user.click(moveUpButtons[0]);

    // Assert ordering via the sequence of layer labels in the DOM
    const labels = screen.getAllByText(/layer\s*\d+/i);
    const indexOfLayer1 = labels.findIndex((el) => /layer\s*1/i.test(el.textContent || ''));
    const indexOfLayer3 = labels.findIndex((el) => /layer\s*3/i.test(el.textContent || ''));

    expect(indexOfLayer1).toBeGreaterThanOrEqual(0);
    expect(indexOfLayer3).toBeGreaterThanOrEqual(0);
    // After moving up, Layer 1 should appear before Layer 3 in the list
    expect(indexOfLayer1).toBeLessThan(indexOfLayer3);
  });

  it('should toggle visibility for individual layers', async () => {
    render(
      <CanvasProvider>
        <LayerPanel />
      </CanvasProvider>
    );

    const addButton = screen.getByRole('button', { name: /new layer/i });
    await user.click(addButton);
    await user.click(addButton);

    // Toggle visibility on the first layer's control
    const visibilityButtons = screen.getAllByRole('button', { name: /visibility/i });
    const firstVisibilityBtn = visibilityButtons[0];
    await user.click(firstVisibilityBtn);

    // Expect aria-pressed to reflect toggled off state
    expect(firstVisibilityBtn).toHaveAttribute('aria-pressed', 'false');

    // Toggle back on
    await user.click(firstVisibilityBtn);
    expect(firstVisibilityBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('should move a layer to top/bottom', async () => {
    render(
      <CanvasProvider>
        <LayerPanel />
      </CanvasProvider>
    );

    const addButton = screen.getByRole('button', { name: /new layer/i });
    await user.click(addButton); // Layer 1
    await user.click(addButton); // Layer 2
    await user.click(addButton); // Layer 3

    // Move the last layer (Layer 3) to bottom
    const moveToBottomButtons = screen.getAllByRole('button', { name: /move to bottom/i });
    await user.click(moveToBottomButtons[moveToBottomButtons.length - 1]);

    // Now move Layer 1 to the top
    const moveToTopButtons = screen.getAllByRole('button', { name: /move to top/i });
    await user.click(moveToTopButtons[0]);

    const labels = screen.getAllByText(/layer\s*\d+/i);
    const firstText = labels[0]?.textContent || '';
    const lastText = labels[labels.length - 1]?.textContent || '';

    // Expect the first to be Layer 1 after moving to top, and one of the others at bottom
    expect(firstText.toLowerCase()).toMatch(/layer\s*1/);
    expect(lastText.toLowerCase()).toMatch(/layer\s*(2|3)/);
  });
});

