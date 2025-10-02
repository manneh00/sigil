# Tasks: AI Image Editing Canvas Library

**Input**: Design documents from `/Users/manny/alchemic-transmutation/specs/001-i-want-to/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single Next.js project

## Phase 3.1: Setup

- [x] T001 Create Next.js project structure with TypeScript and App Router at repository root
- [x] T002 Install core dependencies: Next.js 14.x, React 18.x, TypeScript 5.x, Tailwind CSS 3.x
- [ ] T003 [P] Install shadcn/ui CLI and initialize components in src/components/ui/
- [x] T004 [P] Install testing dependencies: Vitest, React Testing Library, Playwright, @testing-library/user-event
- [x] T005 [P] Install development tools: ESLint with TypeScript/React rules, Prettier, Husky for git hooks
- [x] T006 [P] Configure Tailwind CSS with custom theme in tailwind.config.ts
- [x] T007 [P] Configure Vitest with React support in vitest.config.ts
- [x] T008 [P] Configure Playwright for E2E tests in playwright.config.ts
- [x] T009 [P] Set up ESLint and Prettier configuration files (.eslintrc.json, .prettierrc)
- [x] T010 Create project directory structure: src/{components,lib,types,hooks,app}/, tests/{contract,integration,unit}/

## Phase 3.2: Tests First (TDD) ⚠️ CONSTITUTIONAL REQUIREMENT

**NON-NEGOTIABLE (Constitution I): Tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (Type Safety)

- [x] T011 [P] Contract test for CanvasAPI types in tests/contract/CanvasAPI.test.ts
- [x] T012 [P] Contract test for LayerManager types in tests/contract/LayerManager.test.ts
- [x] T013 [P] Contract test for ToolSystem types in tests/contract/ToolSystem.test.ts

**Verification Required:**
- Run `npm test -- contract` to confirm tests FAIL (no implementation yet)
- Document failure output before proceeding to Phase 3.3

### Integration Tests (User Stories)

- [x] T014 [P] Integration test: Load image and draw mask in tests/integration/draw-mask.test.tsx
- [x] T015 [P] Integration test: Create multiple layers in tests/integration/layer-management.test.tsx
- [ ] T016 [P] Integration test: Zoom and pan operations in tests/integration/viewport.test.tsx
- [x] T017 [P] Integration test: Undo/redo functionality in tests/integration/history.test.tsx
- [ ] T018 [P] Integration test: Export mask data in tests/integration/export.test.tsx
- [ ] T019 [P] Integration test: Erase mask regions in tests/integration/eraser.test.tsx
- [ ] T020 [P] Integration test: Outline tool polygon drawing in tests/integration/outline.test.tsx
- [ ] T021 [P] Integration test: Layer reordering and visibility in tests/integration/layer-reorder.test.tsx

**Verification Required:**
- Run `npm test -- integration` to confirm all tests FAIL
- Document expected behaviors from test assertions

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Type Definitions

- [x] T022 [P] Create base types from CanvasAPI contract in src/types/canvas.ts
- [x] T023 [P] Create layer types from LayerManager contract in src/types/layer.ts
- [x] T024 [P] Create tool types from ToolSystem contract in src/types/tool.ts
- [x] T025 [P] Create export data types in src/types/export.ts

### Core Library - Canvas

- [ ] T026 Create canvas initialization module in src/lib/canvas/init.ts
- [ ] T027 Create canvas rendering engine in src/lib/canvas/renderer.ts
- [ ] T028 Create offscreen canvas manager in src/lib/canvas/offscreen.ts
- [ ] T029 Create viewport transform utilities in src/lib/canvas/viewport.ts

### Core Library - Layers

- [ ] T030 [P] Create Layer entity model in src/lib/layers/layer.ts
- [ ] T031 Create LayerManager implementation in src/lib/layers/manager.ts
- [ ] T032 Create layer compositor in src/lib/layers/compositor.ts
- [ ] T033 Create layer renderer in src/lib/layers/renderer.ts
- [ ] T034 [P] Create thumbnail generator in src/lib/layers/thumbnail.ts
- [ ] T035 [P] Create layer validation utilities in src/lib/layers/validation.ts

### Core Library - Tools

- [ ] T036 [P] Create base Tool interface implementation in src/lib/tools/base.ts
- [ ] T037 Create BrushTool implementation in src/lib/tools/brush.ts
- [ ] T038 Create EraserTool implementation in src/lib/tools/eraser.ts
- [ ] T039 Create OutlineTool implementation in src/lib/tools/outline.ts
- [ ] T040 Create PanTool implementation in src/lib/tools/pan.ts
- [ ] T041 Create ZoomTool implementation in src/lib/tools/zoom.ts
- [ ] T042 Create ToolManager for tool orchestration in src/lib/tools/manager.ts
- [ ] T043 [P] Create drawing operations utilities in src/lib/tools/drawing.ts
- [ ] T044 [P] Create cursor manager in src/lib/tools/cursor.ts

### Core Library - History

- [ ] T045 Create history state manager with undo/redo in src/lib/history/manager.ts
- [ ] T046 [P] Create command pattern implementations in src/lib/history/commands.ts
- [ ] T047 [P] Create history validation and limits in src/lib/history/validation.ts

### Core Library - Image

- [ ] T048 Create image loading utilities in src/lib/image/loader.ts
- [ ] T049 [P] Create image validation (size, format) in src/lib/image/validation.ts
- [ ] T050 [P] Create image error handling in src/lib/image/errors.ts

### Core Library - Export

- [ ] T051 Create export data formatter in src/lib/export/formatter.ts
- [ ] T052 Create mask PNG encoder in src/lib/export/encoder.ts
- [ ] T053 [P] Create export validation in src/lib/export/validation.ts

### State Management

- [ ] T054 Create root canvas reducer in src/lib/state/reducer.ts
- [ ] T055 Create action creators in src/lib/state/actions.ts
- [ ] T056 Create state selectors in src/lib/state/selectors.ts
- [ ] T057 Create CanvasContext provider in src/lib/state/context.tsx

### React Hooks

- [ ] T058 [P] Create useCanvas hook in src/hooks/useCanvas.ts
- [ ] T059 [P] Create useLayer hook in src/hooks/useLayer.ts
- [ ] T060 [P] Create useTool hook in src/hooks/useTool.ts
- [ ] T061 [P] Create useViewport hook in src/hooks/useViewport.ts
- [ ] T062 [P] Create useHistory hook in src/hooks/useHistory.ts
- [ ] T063 [P] Create useKeyboardShortcuts hook in src/hooks/useKeyboardShortcuts.ts

## Phase 3.4: React Components

### Canvas Component

- [ ] T064 Create main Canvas component in src/components/Canvas/Canvas.tsx
- [ ] T065 Create CanvasOverlay for guides/previews in src/components/Canvas/CanvasOverlay.tsx
- [ ] T066 Create ImageLoader component in src/components/Canvas/ImageLoader.tsx
- [ ] T067 [P] Create CanvasControls (zoom buttons, etc.) in src/components/Canvas/CanvasControls.tsx

### Toolbar Component

- [ ] T068 Create Toolbar container in src/components/Toolbar/Toolbar.tsx
- [ ] T069 Create ToolButton component in src/components/Toolbar/ToolButton.tsx
- [ ] T070 Create BrushSettings panel in src/components/Toolbar/BrushSettings.tsx
- [ ] T071 Create EraserSettings panel in src/components/Toolbar/EraserSettings.tsx
- [ ] T072 [P] Create tool size slider component in src/components/Toolbar/SizeSlider.tsx

### Layer Panel Component

- [ ] T073 Create LayerPanel container in src/components/LayerPanel/LayerPanel.tsx
- [ ] T074 Create LayerItem component in src/components/LayerPanel/LayerItem.tsx
- [ ] T075 Create LayerThumbnail component in src/components/LayerPanel/LayerThumbnail.tsx
- [ ] T076 Create LayerControls (visibility, delete, color) in src/components/LayerPanel/LayerControls.tsx
- [ ] T077 [P] Create AddLayerButton component in src/components/LayerPanel/AddLayerButton.tsx

### UI Components (shadcn/ui)

- [ ] T078 [P] Install and configure Button component from shadcn/ui
- [ ] T079 [P] Install and configure Slider component from shadcn/ui
- [ ] T080 [P] Install and configure Tabs component from shadcn/ui
- [ ] T081 [P] Install and configure Dialog component from shadcn/ui
- [ ] T082 [P] Install and configure Tooltip component from shadcn/ui

## Phase 3.5: Integration & Magnetic Brush

### Magnetic Brush (Advanced Feature)

- [ ] T083 Install ONNX Runtime Web dependency
- [ ] T084 Create ONNX model loader in src/lib/tools/magnetic-brush/model-loader.ts
- [ ] T085 Create SAM inference wrapper in src/lib/tools/magnetic-brush/inference.ts
- [ ] T086 Create MagneticBrushTool implementation in src/lib/tools/magnetic-brush.ts
- [ ] T087 [P] Create model download progress indicator in src/components/Toolbar/ModelLoadingIndicator.tsx
- [ ] T088 [P] Integration test: Magnetic brush segmentation in tests/integration/magnetic-brush.test.tsx

### Main Application

- [ ] T089 Create main page layout in src/app/page.tsx
- [ ] T090 Create root layout with providers in src/app/layout.tsx
- [ ] T091 [P] Add global styles in src/app/globals.css
- [ ] T092 Wire up CanvasProvider in root layout

### Error Handling & UI Polish

- [ ] T093 [P] Create ErrorBoundary component in src/components/ErrorBoundary.tsx
- [ ] T094 [P] Create LoadingSpinner component in src/components/LoadingSpinner.tsx
- [ ] T095 [P] Create Toast notification system in src/components/Toast.tsx
- [ ] T096 Add error messages from UX-001 requirement to validation functions

## Phase 3.6: Polish

### Unit Tests

- [ ] T097 [P] Unit tests for canvas renderer in tests/unit/canvas/renderer.test.ts
- [ ] T098 [P] Unit tests for layer manager in tests/unit/layers/manager.test.ts
- [ ] T099 [P] Unit tests for brush tool in tests/unit/tools/brush.test.ts
- [ ] T100 [P] Unit tests for history manager in tests/unit/history/manager.test.ts
- [ ] T101 [P] Unit tests for image validation in tests/unit/image/validation.test.ts
- [ ] T102 [P] Unit tests for export formatter in tests/unit/export/formatter.test.ts
- [ ] T103 [P] Unit tests for viewport transforms in tests/unit/canvas/viewport.test.ts

### Performance Tests

- [ ] T104 Performance benchmark: Canvas rendering at 60fps in tests/performance/rendering.bench.ts
- [ ] T105 Performance benchmark: Zoom operations <100ms in tests/performance/zoom.bench.ts
- [ ] T106 Performance benchmark: Layer reordering <50ms in tests/performance/layers.bench.ts
- [ ] T107 Performance benchmark: Drawing latency <200ms p95 in tests/performance/drawing.bench.ts

### E2E Tests (Playwright)

- [ ] T108 [P] E2E test: Complete user workflow (load, draw, export) in tests/e2e/user-workflow.spec.ts
- [ ] T109 [P] E2E test: Keyboard shortcuts in tests/e2e/keyboard-shortcuts.spec.ts
- [ ] T110 [P] E2E test: Error handling (large file, invalid format) in tests/e2e/error-handling.spec.ts

### Accessibility

- [ ] T111 Add ARIA labels to all interactive elements (Toolbar, LayerPanel, Canvas)
- [ ] T112 [P] Add keyboard navigation support (Tab, Arrow keys, Enter)
- [ ] T113 [P] Add focus indicators to all focusable elements
- [ ] T114 [P] Test with screen reader (VoiceOver/NVDA) and document issues

### Documentation

- [ ] T115 [P] Create README.md with installation and usage instructions
- [ ] T116 [P] Create API documentation in docs/api.md
- [ ] T117 [P] Add JSDoc comments to all public API functions
- [ ] T118 [P] Create CHANGELOG.md with version 1.0.0 entry
- [ ] T119 [P] Update quickstart.md with actual code examples if needed

### Code Quality & Cleanup

- [ ] T120 Run ESLint and fix all warnings/errors
- [ ] T121 Run Prettier on all source files
- [ ] T122 Remove any console.log statements and TODO comments
- [ ] T123 Verify no functions exceed 50 lines (Constitution II)
- [ ] T124 Verify all public APIs have TypeScript type annotations
- [ ] T125 Remove code duplication using DRY principle

### Final Validation

- [ ] T126 Run full test suite and ensure 100% pass rate
- [ ] T127 Run performance benchmarks and verify all targets met
- [ ] T128 Test in all supported browsers (Chrome, Firefox, Safari, Edge)
- [ ] T129 Verify bundle size is acceptable (<500KB gzipped for core library)
- [ ] T130 Execute quickstart.md manual testing checklist

## Dependencies

**Setup Dependencies:**
- T001 blocks all other tasks (project must exist)
- T002-T010 can run in parallel after T001

**Test Dependencies:**
- T011-T013 (contract tests) before T022-T025 (type definitions)
- T014-T021 (integration tests) before T026-T092 (implementation)
- All Phase 3.2 before Phase 3.3

**Implementation Dependencies:**
- T022-T025 (types) before all implementation tasks
- T026-T029 (canvas core) before T030-T035 (layers)
- T030-T035 (layers) before T073-T077 (LayerPanel component)
- T036-T044 (tools) before T068-T072 (Toolbar component)
- T045-T047 (history) before T062 (useHistory hook)
- T054-T057 (state management) before T058-T063 (hooks)
- T058-T063 (hooks) before T064-T092 (components)
- T083-T086 (magnetic brush) after T036-T044 (tools base)
- T089-T092 (main app) after all components

**Polish Dependencies:**
- T097-T103 (unit tests) can run after respective implementation
- T104-T107 (performance tests) after full implementation
- T108-T110 (E2E tests) after T089-T092 (main app)
- T111-T114 (accessibility) after T064-T092 (all components)
- T115-T119 (docs) can run in parallel anytime
- T120-T125 (cleanup) after all implementation
- T126-T130 (validation) last, after everything

## Parallel Execution Examples

### Setup Phase (All Parallel After T001)
```bash
# After T001 completes, run T002-T010 in parallel:
npm install next@14 react@18 react-dom@18 typescript@5 tailwindcss@3 & \
npm install -D vitest @testing-library/react playwright eslint prettier & \
npx shadcn-ui@latest init
```

### Contract Tests (All Parallel)
```bash
# Run T011-T013 together:
npm test -- tests/contract/CanvasAPI.test.ts &
npm test -- tests/contract/LayerManager.test.ts &
npm test -- tests/contract/ToolSystem.test.ts &
wait
```

### Integration Tests (All Parallel After Writing)
```bash
# Run T014-T021 together:
npm test -- tests/integration/draw-mask.test.tsx &
npm test -- tests/integration/layer-management.test.tsx &
npm test -- tests/integration/viewport.test.tsx &
npm test -- tests/integration/history.test.tsx &
npm test -- tests/integration/export.test.tsx &
npm test -- tests/integration/eraser.test.tsx &
npm test -- tests/integration/outline.test.tsx &
npm test -- tests/integration/layer-reorder.test.tsx &
wait
```

### Type Definitions (All Parallel)
```bash
# Run T022-T025 together - different files, no dependencies
```

### Unit Tests (Parallel by Module)
```bash
# Run T097-T103 together after implementation:
npm test -- tests/unit/
```

### Performance Tests (All Parallel)
```bash
# Run T104-T107 together:
npm run bench
```

### E2E Tests (All Parallel)
```bash
# Run T108-T110 together:
npx playwright test
```

### Documentation (All Parallel)
```bash
# Run T115-T119 together - independent files
```

## Task Execution Notes

### TDD Enforcement
- **CRITICAL**: Do NOT proceed to Phase 3.3 until ALL tests in Phase 3.2 are written and failing
- Verify test failures with: `npm test -- --reporter=verbose`
- Document expected error messages before implementing

### Code Quality Gates
- After every 10 tasks, run: `npm run lint && npm run format`
- After implementing each entity, run unit tests for that entity
- After implementing each component, run integration tests for that component

### Performance Monitoring
- After T033 (layer renderer): Measure initial rendering performance
- After T042 (tool manager): Measure drawing performance
- After T029 (viewport): Measure zoom/pan performance
- Flag any metrics not meeting constitutional requirements

### Commit Strategy
- Commit after each phase completes
- Commit message format: `feat(phase): complete Phase 3.X - [description]`
- Example: `feat(tests): complete Phase 3.2 - contract and integration tests`

## Validation Checklist

Before marking tasks.md as complete, verify:

- [x] All contracts have corresponding tests (T011-T013)
- [x] All entities have implementation tasks (Image, Layer, Tool, Viewport, History)
- [x] All user stories have integration tests (T014-T021)
- [x] Tests come before implementation (Phase 3.2 before 3.3)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] All constitutional requirements addressed
- [x] Performance validation included (T104-T107)
- [x] Accessibility compliance included (T111-T114)
- [x] Documentation tasks included (T115-T119)

## Summary

**Total Tasks**: 130
**Parallel Tasks**: 58 (marked with [P])
**Sequential Tasks**: 72
**Estimated Duration**:
- Phase 3.1 (Setup): 2-3 hours
- Phase 3.2 (Tests): 8-10 hours
- Phase 3.3 (Core): 20-25 hours
- Phase 3.4 (Components): 10-12 hours
- Phase 3.5 (Integration): 6-8 hours
- Phase 3.6 (Polish): 8-10 hours
- **Total**: 54-68 hours

**Key Milestones**:
1. ✅ Setup complete → Can run dev server
2. ✅ Tests written → Red phase achieved (TDD)
3. ✅ Core library complete → Can load image, create layers
4. ✅ Components complete → Full UI functional
5. ✅ Integration complete → Magnetic brush working
6. ✅ Polish complete → Production-ready, all tests pass

**Next Step**: Begin with T001 - Create Next.js project structure
