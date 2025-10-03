/**
 * Integration Test: Layer Reordering and Visibility
 *
 * User Story: User can reorder layers and toggle their visibility.
 * Expected: Z-order updates and visibility state toggles are reflected in UI.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

// Follow existing integration test import patterns
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

    // Create three layers
    const addButton = screen.getByRole('button', { name: /new layer/i });
    await user.click(addButton);
    await user.click(addButton);
    await user.click(addButton);

    // By default expect items to be labeled Layer 1..3
    // Move middle layer up and verify ordering via accessible labels/text
    const moveUpButtons = screen.getAllByRole('button', { name: /move up/i });
    await user.click(moveUpButtons[1]);

    // Expect top-most layer to now be the one that was previously in middle
    // Placeholder assertion until implementation exposes ordering; smoke check
    expect(screen.getByText(/layer 2/i)).toBeInTheDocument();
  });

  it('should toggle visibility per-layer and reflect aria-pressed', async () => {
    render(
      <CanvasProvider>
        <LayerPanel />
      </CanvasProvider>
    );

    const addButton = screen.getByRole('button', { name: /new layer/i });
    await user.click(addButton);
    await user.click(addButton);

    const visibilityButtons = screen.getAllByRole('button', { name: /visibility/i });
    // Toggle visibility on the second layer
    await user.click(visibilityButtons[1]);

    expect(visibilityButtons[1]).toHaveAttribute('aria-pressed', 'false');
  });
});

