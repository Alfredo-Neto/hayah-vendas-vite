# Tasks: Admin Coordenador and Mentor Convites

**Input**: Design documents from `specs/001-admin-coordenador-mentor-convites/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/role-flows.md`, `quickstart.md`  
**Tests**: Required for database/RLS/role-boundary behavior. UI tests may be added where a test harness exists; otherwise include manual quickstart validation evidence.  
**Organization**: Tasks are grouped by independently testable user story and suitable for later `speckit-taskstoissues` conversion.

## Implementation slice status

First Admin-created/authorized Coordenador slice (`fm/hayah-admin-coordenador-impl-j10`):

- Completed: T001, T002, T003, T014, T015, T016, T017.
- Partially completed for US1 only: T004 and T006 via `supabase/migrations/20260804071000_admin_coordenador_authorization.sql` (Admin authorization tables/RLS/RPC and authorized Coordenador Igreja Local creation RPC). Mentor, Lider Convites, Mentor-Equipe assignment, Fechamento, and Ranking database work remain open.
- T012 and T013 remain open because this repo has no committed automated Supabase SQL/RLS test harness yet; `quickstart.md` now documents the manual backend validation steps for this slice.

## Phase 1: Setup and documentation alignment

**Purpose**: Ensure future implementation starts from accepted domain decisions.

- [ ] T001 [P] Review `CONTEXT.md`, `docs/modelo-minimo.md`, `docs/adr/0003-admin-mentor-convites.md`, `progress.md`, and this spec directory for consistency before product implementation.
- [ ] T002 [P] Add any missing feature tracker references for implementation work in `features.json` if the branch or issue plan changes.
- [ ] T003 Document the chosen Supabase test/verification command for role and RLS checks in `specs/001-admin-coordenador-mentor-convites/quickstart.md` before marking database tasks complete.

---

## Phase 2: Foundational database and authorization model

**Purpose**: Core data and authorization boundaries that block all user stories.

- [ ] T004 Create Supabase migration `supabase/migrations/<timestamp>_admin_coordenador_mentor_convites.sql` for Admin authorization, Mentor-capable Convites, Mentor/Lider Edicao assignments, and Mentor-Equipe supervision relationships.
- [ ] T005 Add constraints in `supabase/migrations/<timestamp>_admin_coordenador_mentor_convites.sql` to keep Convite, Edicao assignment, Equipe, and Mentor supervision rows within one Igreja Local and Edicao.
- [ ] T006 Add or update RLS policies/RPC boundaries in `supabase/migrations/<timestamp>_admin_coordenador_mentor_convites.sql` so only Admin can authorize Coordenador and only authorized Coordenador can administer their Igreja Local.
- [ ] T007 Add or update RLS policies/RPC boundaries in `supabase/migrations/<timestamp>_admin_coordenador_mentor_convites.sql` so Mentor can view supervised Equipes but cannot submit, consolidate, validate, reject, or edit Fechamento da Equipe details.
- [ ] T008 [P] Add SQL/RLS verification for Admin-created/authorized Coordenador behavior in `supabase/tests/admin_coordenador_authorization.sql` or the repo-approved equivalent.
- [ ] T009 [P] Add SQL/RLS verification for Mentor Convites, Lider Convites, Convite email matching, expiration/status rejection, and no-new-Igreja-Local acceptance in `supabase/tests/mentor_lider_convites.sql` or the repo-approved equivalent.
- [ ] T010 [P] Add SQL/RLS verification for Mentor-Equipe supervision boundaries and Mentor Fechamento denial in `supabase/tests/mentor_supervision_boundaries.sql` or the repo-approved equivalent.
- [ ] T011 Run the Supabase verification command documented in T003 and record any required implementation follow-up in `specs/001-admin-coordenador-mentor-convites/quickstart.md`.

**Checkpoint**: Database model and authorization rules are testable before UI work begins.

---

## Phase 3: User Story 1 - Admin authorizes Coordenador (Priority: P1) 🎯 MVP

**Goal**: Admin can create or authorize a Coordenador; unauthorized Usuarios cannot act as Coordenador.

**Independent Test**: Authorize `coord@example.test`, create Igreja Local as that Usuario, and verify a non-authorized Usuario is rejected.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add TypeScript/domain test or SQL verification for Admin-authorized Coordenador creating Igreja Local in `supabase/tests/admin_coordenador_authorization.sql` or repo-approved equivalent.
- [ ] T013 [P] [US1] Add TypeScript/domain test or SQL verification for rejecting non-authorized Usuario attempting Coordenador-only Igreja Local creation/admin in `supabase/tests/admin_coordenador_authorization.sql` or repo-approved equivalent.

### Implementation for User Story 1

- [ ] T014 [US1] Implement Admin authorization data access/RPC wrapper in `src/lib` or a new `src/features/admin/` module, matching the Supabase boundary from T006.
- [ ] T015 [US1] Add the smallest Admin UI page/component for creating or authorizing Coordenador in `src/pages` and supporting `src/features/admin/` files.
- [ ] T016 [US1] Gate Igreja Local creation in existing Igreja Local flow so only an Admin-authorized Coordenador can proceed; update the relevant `src/` files.
- [ ] T017 [US1] Run US1 tests/verification plus `npm run typecheck -- --pretty false` and `npm run build`.

**Checkpoint**: Admin-created/authorized Coordenador access is independently demonstrable.

---

## Phase 4: User Story 2 - Coordenador invites Mentor to an Edicao (Priority: P1)

**Goal**: Coordenador creates a Mentor Convite; invited Usuario accepts into the existing Igreja Local/Edicao.

**Independent Test**: Create Edicao, invite `mentor@example.test`, accept as matching Usuario, verify Mentor assignment and no new Igreja Local.

### Tests for User Story 2

- [ ] T018 [P] [US2] Add Convite creation/acceptance verification for papel `mentor` in `supabase/tests/mentor_lider_convites.sql` or repo-approved equivalent.
- [ ] T019 [P] [US2] Add regression verification that accepting Mentor Convite never creates a new Igreja Local in `supabase/tests/mentor_lider_convites.sql` or repo-approved equivalent.

### Implementation for User Story 2

- [ ] T020 [US2] Extend Convite creation data access to support papel `mentor` in `src/features/convites/` or the current Convite module location.
- [ ] T021 [US2] Extend Convite acceptance data access to create/reuse membership and create Mentor Edicao assignment in `src/features/convites/` or the current Convite module location.
- [ ] T022 [US2] Add Coordenador UI to create Mentor Convites for an Edicao in `src/pages` and supporting components.
- [ ] T023 [US2] Add accepted-Mentor landing/context view showing Igreja Local and Edicao membership in `src/pages` or a new Mentor feature module.
- [ ] T024 [US2] Run US2 tests/verification plus `npm run typecheck -- --pretty false` and `npm run build`.

**Checkpoint**: Mentor can enter the existing Igreja Local through Convite.

---

## Phase 5: User Story 3 - Mentor supervises one or more Equipes and Lideres (Priority: P1)

**Goal**: Coordenador assigns Mentor to Equipes in the same Edicao; Mentor views only supervised context and cannot own or consolidate Fechamento details.

**Independent Test**: Assign one Mentor to two Equipes in the same Edicao; verify visibility and cross-boundary rejection.

### Tests for User Story 3

- [ ] T025 [P] [US3] Add verification for one Mentor supervising multiple same-Edicao Equipes in `supabase/tests/mentor_supervision_boundaries.sql` or repo-approved equivalent.
- [ ] T026 [P] [US3] Add verification for rejecting cross-Igreja Local and cross-Edicao Mentor assignments in `supabase/tests/mentor_supervision_boundaries.sql` or repo-approved equivalent.
- [ ] T027 [P] [US3] Add verification that Mentor cannot submit, consolidate, validate, reject, or edit Fechamento da Equipe in `supabase/tests/mentor_supervision_boundaries.sql` or repo-approved equivalent.

### Implementation for User Story 3

- [ ] T028 [US3] Implement Mentor-Equipe assignment data access in `src/features/equipes/` or a new `src/features/mentores/` module.
- [ ] T029 [US3] Add Coordenador UI to assign a Mentor to one or more Equipes in an Edicao in `src/pages` and supporting components.
- [ ] T030 [US3] Add Mentor operational view for supervised Equipes and Lider relationships in `src/pages` or `src/features/mentores/`.
- [ ] T031 [US3] Ensure Fechamento UI/data access hides or rejects Mentor actions while backend tests enforce denial in relevant `src/` and `supabase/` files.
- [ ] T032 [US3] Run US3 tests/verification plus `npm run typecheck -- --pretty false` and `npm run build`.

**Checkpoint**: Mentor supervision works without changing Fechamento ownership.

---

## Phase 6: User Story 4 - Coordenador invites Lider with Mentor context preserved (Priority: P2)

**Goal**: Lider Convite still works and Lider can see Mentor relationship while remaining Fechamento owner.

**Independent Test**: Assign Mentor to Equipe, invite Lider, accept, verify Mentor context and Fechamento responsibility.

### Tests for User Story 4

- [ ] T033 [P] [US4] Add Lider Convite acceptance regression verification for Equipe with Mentor in `supabase/tests/mentor_lider_convites.sql` or repo-approved equivalent.
- [ ] T034 [P] [US4] Add Ranking regression verification that only validated Fechamentos count after Lider submission in `supabase/tests/mentor_supervision_boundaries.sql` or repo-approved equivalent.

### Implementation for User Story 4

- [ ] T035 [US4] Extend Lider Convite creation/acceptance data access for compatibility with Mentor-supervised Equipes in `src/features/convites/` or current Convite module location.
- [ ] T036 [US4] Show Mentor relationship in Lider Equipe context in `src/pages` or relevant Equipe/Lider components.
- [ ] T037 [US4] Preserve existing Lider Fechamento flow and Coordenador validation flow in relevant `src/` and `supabase/` files.
- [ ] T038 [US4] Run US4 tests/verification plus `npm run typecheck -- --pretty false` and `npm run build`.

**Checkpoint**: Lider flow remains intact with Mentor context.

---

## Phase 7: Polish and release validation

**Purpose**: Cross-story hardening and documentation.

- [ ] T039 [P] Update `CONTEXT.md`, `docs/modelo-minimo.md`, `progress.md`, and `features.json` if implementation discoveries require narrow clarifications.
- [ ] T040 [P] Update `specs/001-admin-coordenador-mentor-convites/quickstart.md` with final manual validation evidence and commands.
- [ ] T041 Run complete feature validation: Supabase verification command from T003, `npm run typecheck -- --pretty false`, and `npm run build`.
- [ ] T042 Run no-mistakes validation and open/ship the implementation PR according to Firstmate instructions.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: No dependencies.
- **Phase 2**: Depends on Phase 1; blocks all user stories.
- **US1 (Phase 3)**: Depends on Phase 2; MVP for controlled Coordenador access.
- **US2 (Phase 4)**: Depends on Phase 2 and can run after or alongside US1 once Coordenador access exists in the target environment.
- **US3 (Phase 5)**: Depends on US2 because Mentor must exist before supervision.
- **US4 (Phase 6)**: Depends on US3 for Mentor context and existing Lider Convite model.
- **Phase 7**: Depends on implemented user stories.

### Parallel Opportunities

- T001 and T002 can run in parallel.
- T008, T009, and T010 can be drafted in parallel after migration shape is known.
- Tests within each user story marked [P] can run in parallel.
- UI tasks touching distinct modules can run in parallel after data access tasks are complete.

### MVP Strategy

1. Complete Phase 1 and Phase 2.
2. Complete US1 to establish Admin-created/authorized Coordenador access.
3. Validate US1 independently before Mentor/Lider expansion.
4. Add US2 and US3 for Mentor entry and supervision.
5. Add US4 to preserve Lider Convite and Fechamento ownership with Mentor context.

## Notes

- Do not mark tasks complete until the referenced tests/verification pass.
- Do not start a local Supabase stack unless the implementation brief explicitly authorizes it.
- Keep Mentor out of Fechamento ownership, consolidation, and validation unless a future ADR changes the rule.
- Use exact `T###` IDs in GitHub issue titles and PR references.
