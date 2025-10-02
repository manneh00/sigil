/**
 * Integration Test: Layer Management
 *
 * User Story: User creates, deletes, and manages multiple layers.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { LayerPanel } from '@/src/components/LayerPanel/LayerPanel';
import { CanvasProvider } from '@/src/lib/state/context';

describe('Integration: Layer Management', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should create a new layer when button clicked', async () => {
    render(
      <CanvasProvider>
        <LayerPanel />
      </CanvasProvider>
    );

    const addButton = screen.getByRole('button', { name: /new layer/i });
    await user.click(addButton);

    expect(screen.getByText(/layer 1/i)).toBeInTheDocument();
  });

  it('should allow renaming layers', async () => {
    render(
      <CanvasProvider>
        <LayerPanel />
      </CanvasProvider>
    );

    const addButton = screen.getByRole('button', { name: /new layer/i });
    await user.click(addButton);

    const layerItem = screen.getByText(/layer 1/i);
    await user.dblClick(layerItem);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Background');
    await user.keyboard('{Enter}');

    expect(screen.getByText(/background/i)).toBeInTheDocument();
  });

  it('should toggle layer visibility', async () => {
    render(
      <CanvasProvider>
        <LayerPanel />
      </CanvasProvider>
    );

    const addButton = screen.getByRole('button', { name: /new layer/i });
    await user.click(addButton);

    const visibilityButton = screen.getByRole('button', { name: /visibility/i });
    await user.click(visibilityButton);

    expect(visibilityButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('should delete layers', async () => {
    render(
      <CanvasProvider>
        <LayerPanel />
      </CanvasProvider>
    );

    const addButton = screen.getByRole('button', { name: /new layer/i });
    await user.click(addButton);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(screen.queryByText(/layer 1/i)).not.toBeInTheDocument();
  });
});
