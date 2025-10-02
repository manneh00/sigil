
# Implementation Plan: AI Image Editing Canvas Library

**Branch**: `001-i-want-to` | **Date**: 2025-10-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/manny/alchemic-transmutation/specs/001-i-want-to/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Build an embeddable React canvas library for AI image editing that enables mask creation through multiple drawing tools (brush, magnetic brush, outline, eraser), layer management, and lossless zoom. The library will be a single-page application using Next.js, React, Tailwind CSS, and shadcn/ui components with no backend dependencies. Users can load images, create mask layers, manage layer stacking/colors, and export mask data for AI model processing.

## Technical Context
**Language/Version**: TypeScript 5.x with React 18.x and Next.js 14.x
**Primary Dependencies**: Next.js, React, Tailwind CSS, shadcn/ui components, HTML5 Canvas API
**Storage**: Browser localStorage for undo/redo history, no backend persistence
**Testing**: Vitest for unit tests, React Testing Library for component tests, Playwright for E2E
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: single (frontend-only SPA, no backend)
**Performance Goals**: 60fps canvas rendering, <100ms zoom operations, <50ms layer reordering
**Constraints**: <200ms p95 for drawing operations, 20MB max image size, client-side only processing
**Scale/Scope**: Single-page app, ~10-15 React components, embeddable library component

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**I. Test-Driven Development (TDD)**
- [x] Contract tests planned BEFORE implementation tasks
- [x] Integration tests planned BEFORE feature implementation
- [x] All test tasks ordered to fail first (Red phase)
- [x] Implementation tasks explicitly depend on failing tests

**II. Code Quality Standards**
- [x] Linting/formatting setup included in Phase 3.1 (ESLint, Prettier for TypeScript/React)
- [x] No functions planned > 50 lines (component hooks and rendering logic will be modular)
- [x] Type annotations/signatures included in all API contracts (TypeScript interfaces)
- [x] Explicit error handling designed in contracts (image loading, file size validation)

**III. User Experience Consistency**
- [x] Error message design included in contracts (actionable messages per UX-001)
- [x] UI/UX patterns documented if user-facing (tool selection, layer management)
- [x] Migration guide planned if breaking user-facing changes (N/A for initial release)
- [x] Accessibility requirements identified (WCAG 2.1 AA - keyboard navigation, ARIA labels)

**IV. Performance Requirements**
- [x] Performance targets defined in Technical Context (< 200ms p95, 60fps rendering)
- [x] Database indexing strategy included (N/A - client-side only)
- [x] Async operations identified for resource-intensive tasks (image loading, magnetic brush AI)
- [x] Performance test tasks included in Phase 3.5 (rendering benchmarks, zoom tests)

**V. Documentation Standards**
- [x] API usage examples planned in quickstart.md (load image, draw mask, export data)
- [x] Architecture decisions documented in research.md (canvas strategy, state management)
- [x] README update task included if needed (library integration guide)
- [x] Complex algorithm documentation identified (magnetic brush SAM integration, undo/redo)

## Project Structure

### Documentation (this feature)
```
specs/001-i-want-to/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   ├── CanvasAPI.ts
│   ├── LayerManager.ts
│   └── ToolSystem.ts
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── components/          # React components
│   ├── Canvas/          # Main canvas component
│   ├── Toolbar/         # Tool selection UI
│   ├── LayerPanel/      # Layer management sidebar
│   └── ui/              # shadcn/ui components
├── lib/                 # Core library logic
│   ├── canvas/          # Canvas rendering engine
│   ├── tools/           # Drawing tools (brush, eraser, etc.)
│   ├── layers/          # Layer management system
│   └── history/         # Undo/redo state management
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
└── app/                 # Next.js app directory
    ├── page.tsx         # Main application page
    └── layout.tsx       # Root layout

tests/
├── contract/            # API contract tests
├── integration/         # Component integration tests
└── unit/                # Unit tests for lib/

public/                  # Static assets
```

**Structure Decision**: Single project structure (frontend-only). This is a Next.js application with the App Router, organized into reusable library code (`src/lib/`) and React components (`src/components/`). The main application lives in `src/app/` as a single-page demo. Tests are organized by type (contract, integration, unit) with contract tests verifying TypeScript interfaces and integration tests validating component interactions.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
