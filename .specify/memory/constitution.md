<!--
Sync Impact Report:
- Version change: [TEMPLATE] → 1.0.0
- Initial constitution ratification
- Added principles:
  * I. Test-Driven Development (TDD)
  * II. Code Quality Standards
  * III. User Experience Consistency
  * IV. Performance Requirements
  * V. Documentation Standards
- Added sections:
  * Development Workflow (code review, quality gates, branch strategy)
  * Governance (amendment process, versioning, compliance review)
- Templates updated:
  * ✅ .specify/templates/plan-template.md (Constitution Check section with all 5 principles)
  * ✅ .specify/templates/spec-template.md (added Performance & UX requirement sections)
  * ✅ .specify/templates/tasks-template.md (constitutional requirement annotations added)
  * ✅ .specify/templates/agent-file-template.md (no changes needed - generic template)
- Follow-up TODOs: None
-->

# Alchemic Transmutation Constitution

## Core Principles

### I. Test-Driven Development (TDD)

**Non-Negotiable Rules:**

- ALL tests MUST be written before implementation code
- Tests MUST fail initially (Red phase) before implementation begins
- Implementation MUST make tests pass (Green phase) with minimal code
- Code MUST be refactored (Refactor phase) only after tests pass
- NO implementation code may be committed without corresponding passing tests

**Rationale:** TDD ensures requirements are testable, prevents over-engineering,
provides living documentation, and creates a safety net for refactoring. The
Red-Green-Refactor cycle is fundamental to maintainable, correct software.

### II. Code Quality Standards

**Non-Negotiable Rules:**

- Code MUST pass linting and formatting checks before commit
- Cyclomatic complexity MUST NOT exceed 10 per function/method
- Code duplication MUST be eliminated (DRY principle)
- Functions MUST have single responsibility
- ALL public APIs MUST have type annotations/signatures
- Error handling MUST be explicit (no silent failures)

**Rationale:** Consistent code quality reduces cognitive load, prevents bugs,
and enables team velocity. These rules are automatable and create objective
quality gates that prevent technical debt accumulation.

### III. User Experience Consistency

**Non-Negotiable Rules:**

- User-facing interfaces MUST follow established design patterns within project
- Error messages MUST be actionable and user-friendly (no stack traces to users)
- Response times MUST meet performance requirements (see Principle IV)
- State changes MUST provide clear feedback to users
- Accessibility standards MUST be met (WCAG 2.1 Level AA minimum where applicable)
- Breaking changes to user interfaces MUST include migration guides

**Rationale:** Consistency reduces learning curve and builds user trust.
Predictable interfaces reduce support burden and increase adoption.

### V. Documentation Standards

**Non-Negotiable Rules:**

- Public APIs MUST have usage examples in documentation
- Complex algorithms MUST have explanatory comments
- README MUST contain quickstart instructions (< 5 minutes to first success)
- Architecture decisions MUST be documented with rationale
- Breaking changes MUST be documented in CHANGELOG
- Setup/deployment procedures MUST be automated or documented

**Rationale:** Documentation reduces onboarding time, prevents knowledge silos,
and serves as insurance against team changes. Code is read 10x more than
written; documentation multiplies team effectiveness.

## Development Workflow

**Quality Gates:**

1. Linting and formatting (automated, blocking)
2. All tests passing (unit, integration, contract)
3. Code coverage maintained or improved
4. Performance benchmarks within thresholds
5. Documentation updated to reflect changes
6. Constitution compliance verified

**Branch Strategy:**

- Feature development on `[ticket-id]/[feature-name]` branches
- Main branch MUST always be deployable
- All merges to main require passing quality gates

## Governance

**Amendment Process:**

- Proposed amendments MUST be documented with rationale
- Breaking changes (MAJOR version) require explicit team approval
- Templates and dependent artifacts MUST be updated when constitution changes

**Versioning Policy:**

- MAJOR: Backward incompatible principle changes or removals
- MINOR: New principles added or material expansions
- PATCH: Clarifications, typo fixes, non-semantic refinements

**Version**: 1.0.0 | **Ratified**: 2025-10-02 | **Last Amended**: 2025-10-02
