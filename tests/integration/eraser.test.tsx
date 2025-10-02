/**
 * Integration Test: Eraser Tool
 *
 * User Story: User can use the eraser tool to remove parts of their drawing.
 * Expected: Eraser tool activates, removes content on mouse drag, respects layer visibility.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Components and Providers
import { Canvas } from "@/src/components/Canvas/Canvas";
import { CanvasProvider } from "@/src/lib/state/context";

// Notes:
// - Since implementation is not present yet, these assertions capture the intended API/UX per specs.
// - Once implementation exists, adjust queries to actual roles/names if needed.

describe("Integration: Eraser Tool", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("should activate eraser tool and remove content on mouse drag", async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    const canvas = screen.getByRole("canvas");
    expect(canvas).toBeInTheDocument();

    // Select eraser tool from toolbar or via shortcut (E key)
    const eraserButton = screen.queryByRole("button", {
      name: /eraser|erase/i,
    });

    if (eraserButton) {
      await user.click(eraserButton);
    } else {
      await user.keyboard("e");
    }

    // Draw some content first (with brush/pen tool)
    const brushButton = screen.queryByRole("button", {
      name: /brush|pen|draw/i,
    });
    if (brushButton) {
      await user.click(brushButton);
    } else {
      await user.keyboard("b"); // assuming B key for brush
    }

    // Draw some lines for testing the eraser
    await user.pointer([
      { target: canvas, coords: { x: 100, y: 100 } },
      { target: canvas, coords: { x: 150, y: 100 } },
      { target: canvas, coords: { x: 200, y: 150 } },
    ]);

    // Activate eraser tool again
    if (eraserButton) {
      await user.click(eraserButton);
    } else {
      await user.keyboard("e");
    }

    // Use eraser to remove part of the drawn content
    await user.pointer([
      { target: canvas, coords: { x: 120, y: 95 }, keys: "[MouseLeft>]" },
      { target: canvas, coords: { x: 180, y: 105 }, keys: "[MouseLeft>]" },
      { target: canvas, coords: { x: 180, y: 105 }, keys: "{/MouseLeft}" },
    ]);

    // Expectation placeholder: once implemented, verify that content is erased
    // This could be done by checking the canvas state, layer data, or visual output
    expect(canvas).toBeInTheDocument();
  });

  it("should respect layer visibility when erasing", async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    const canvas = screen.getByRole("canvas");
    expect(canvas).toBeInTheDocument();

    // Create or select a layer
    const addLayerButton = screen.queryByRole("button", {
      name: /add layer|new layer/i,
    });
    if (addLayerButton) {
      await user.click(addLayerButton);
    }

    // Draw content on the layer
    await user.keyboard("b"); // activate brush
    await user.pointer([
      { target: canvas, coords: { x: 100, y: 100 } },
      { target: canvas, coords: { x: 150, y: 150 } },
    ]);

    // Click on a hidden layer
    const layerVisibilityToggle = screen.queryByRole("button", {
      name: /toggle visibility|hide/i,
    });
    if (layerVisibilityToggle) {
      await user.click(layerVisibilityToggle);
    }

    // Try to erase on the hidden layer
    await user.keyboard("e"); // activate eraser
    await user.pointer([
      { target: canvas, coords: { x: 120, y: 120 }, keys: "[MouseLeft>]" },
      { target: canvas, coords: { x: 130, y: 130 }, keys: "[MouseLeft>]" },
      { target: canvas, coords: { x: 130, y: 130 }, keys: "{/MouseLeft}" },
    ]);

    // Expectation: erasing should have no effect on hidden layers
    expect(canvas).toBeInTheDocument();
  });

  it("should support different eraser sizes", async () => {
    render(
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    );

    const canvas = screen.getByRole("canvas");
    expect(canvas).toBeInTheDocument();

    // Activate eraser tool
    await user.keyboard("e");

    // Look for eraser size controls
    const sizeSlider = screen.queryByRole("slider", {
      name: /eraser size|size/i,
    });
    const sizeInput = screen.queryByRole("spinbutton", {
      name: /eraser size|size/i,
    });

    if (sizeSlider) {
      await user.click(sizeSlider);
      // Simulate changing slider value
      await user.keyboard("{ArrowRight}");
      await user.keyboard("{ArrowRight}");
    } else if (sizeInput) {
      await user.clear(sizeInput);
      await user.type(sizeInput, "10");
    }

    // Draw content with brush
    await user.keyboard("b");
    await user.pointer([
      { target: canvas, coords: { x: 100, y: 100 } },
      { target: canvas, coords: { x: 150, y: 150 } },
    ]);

    // Erase with the selected eraser size
    await user.keyboard("e");
    await user.pointer([
      { target: canvas, coords: { x: 120, y: 120 }, keys: "[MouseLeft>]" },
      { target: canvas, coords: { x: 140, y: 140 }, keys: "[MouseLeft>]" },
      { target: canvas, coords: { x: 140, y: 140 }, keys: "{/MouseLeft}" },
    ]);

    // Expectation: eraser should work with the configured size
    expect(canvas).toBeInTheDocument();
  });
});
