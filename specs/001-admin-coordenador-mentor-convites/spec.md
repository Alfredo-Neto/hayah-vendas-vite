# Feature Specification: Admin Coordenador and Mentor Convites

**Feature Branch**: `001-admin-coordenador-mentor-convites`  
**Created**: 2026-08-04  
**Status**: Draft, ready for implementation planning review  
**Input**: Captain correction: keep Admin-created/authorized Coordenador, Mentor as Usuario type, Convites for Mentor and Lider, Mentor accompanies/supervises one or more Equipes, Mentor does not consolidate Fechamento details, Lider owns Fechamento, Coordenador validates, Ranking uses validated Fechamentos.

## Alignment with Hayah sources

This specification is bound by `AGENTS.md`, `CONTEXT.md`, `docs/modelo-minimo.md`, `docs/adr/0001-vite-supabase-stack.md`, `docs/adr/0002-auth-strategy.md`, `docs/adr/0003-admin-mentor-convites.md`, `features.json`, and `progress.md`.

The feature extends the tracer bullet without changing the Fechamento and Ranking rules: Lider sends Fechamento da Equipe, Coordenador validates, and Ranking uses validated Fechamentos only.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin authorizes Coordenador (Priority: P1)

An Admin creates or authorizes a Coordenador so that the Coordenador can administer one Igreja Local in the first version.

**Why this priority**: Controlled Coordenador authorization must exist before Coordenadores administer Igrejas Locais, Edicoes, Equipes, and Convites.

**Independent Test**: A future worker can test this story by authorizing one Coordenador, signing in as that Usuario, creating an Igreja Local, and verifying a non-authorized Usuario cannot create/administer an Igreja Local as Coordenador.

**Acceptance Scenarios**:

1. **Given** an Admin authorizes a Coordenador email, **When** that person signs in, **Then** Hayah records or recognizes the Usuario as an authorized Coordenador.
2. **Given** an authorized Coordenador, **When** they create an Igreja Local, **Then** the Igreja Local is created and linked to that Coordenador.
3. **Given** a Usuario without Admin authorization, **When** they attempt to create or administer an Igreja Local as Coordenador, **Then** the system rejects the operation.

---

### User Story 2 - Coordenador invites Mentor to an Edicao (Priority: P1)

A Coordenador creates a Convite for a Mentor in an existing Igreja Local and Edicao. The invited Usuario accepts the Convite and becomes a Mentor for that Edicao without creating a new Igreja Local.

**Why this priority**: Mentor is now a formal Usuario papel and must enter through the same tenant-safe Convite model as Lider.

**Independent Test**: A future worker can test this story by creating an Edicao, inviting a Mentor by email, accepting as that email, and verifying the Mentor assignment exists in the existing Igreja Local/Edicao.

**Acceptance Scenarios**:

1. **Given** a Coordenador administers an Igreja Local and Edicao, **When** they create a Convite with papel `mentor`, **Then** the Convite is pending for that Igreja Local and Edicao.
2. **Given** a pending Mentor Convite for an email, **When** the authenticated Usuario with the same email accepts it, **Then** the Usuario becomes a Mentor assignment in that Edicao.
3. **Given** a Mentor Convite is accepted, **When** membership is updated, **Then** no new Igreja Local is created.

---

### User Story 3 - Mentor supervises one or more Equipes and Lideres (Priority: P1)

A Coordenador assigns a Mentor to one or more Equipes in the same Edicao so the Mentor can accompany those Equipes and supervise their Lideres.

**Why this priority**: Mentor only has product value when connected to Equipes/Lideres, and the boundaries must prevent cross-Igreja Local or cross-Edicao supervision.

**Independent Test**: A future worker can test this story by assigning one Mentor to two Equipes in the same Edicao and verifying they can view only those supervised Equipes.

**Acceptance Scenarios**:

1. **Given** a Mentor assignment and two Equipes in the same Edicao, **When** the Coordenador assigns the Mentor to both Equipes, **Then** both supervision relationships are recorded.
2. **Given** an Equipe in a different Igreja Local or Edicao, **When** a Coordenador attempts to assign the Mentor across that boundary, **Then** the system rejects the assignment.
3. **Given** a Mentor supervises an Equipe, **When** they view their operational context, **Then** they can see the supervised Equipe and Lider relationship but cannot consolidate or validate Fechamentos.

---

### User Story 4 - Coordenador invites Lider with Mentor context preserved (Priority: P2)

A Coordenador creates a Convite de Lider for an Equipe. If that Equipe has a Mentor, the accepted Lider can see the Mentor relationship, while remaining responsible for Fechamento da Equipe.

**Why this priority**: Lider Convites are already in the tracer bullet; this story keeps that flow compatible with Mentor supervision.

**Independent Test**: A future worker can test this story by assigning a Mentor to an Equipe, inviting a Lider, accepting the Convite, and verifying the Lider sees the Mentor while retaining Fechamento responsibility.

**Acceptance Scenarios**:

1. **Given** an Equipe exists, **When** the Coordenador creates a Convite de Lider, **Then** the Convite targets that Equipe and role.
2. **Given** a Lider accepts a Convite for an Equipe with a Mentor, **When** they view Equipe context, **Then** the Mentor relationship is visible.
3. **Given** a Lider belongs to an Equipe with a Mentor, **When** Fechamento da Equipe is due, **Then** the Lider remains responsible for Valor Repassado and Comprovante de Transferencia.

### Edge Cases

- A non-Admin attempts to create or authorize a Coordenador.
- An unauthorized Usuario attempts to create or administer an Igreja Local as Coordenador.
- A Convite is expired, revoked, already accepted, or accepted by a different email.
- A Mentor Convite includes an Equipe when only Edicao-level membership is required.
- A Mentor is assigned to Equipes across different Igrejas Locais or Edicoes.
- A Mentor attempts to submit, consolidate, validate, reject, or edit Fechamento da Equipe details.
- A Lider accepts a Convite for an Equipe that already has another Lider.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support an Admin product role that creates or authorizes Coordenadores before they can administer Igrejas Locais.
- **FR-002**: The system MUST allow an authorized Coordenador to create and administer one Igreja Local in the first version.
- **FR-003**: The system MUST reject Coordenador-only operations for Usuarios that were not created or authorized by an Admin.
- **FR-004**: The system MUST treat Mentor as a formal Usuario type/papel, not as free-text metadata.
- **FR-005**: The system MUST allow Coordenador to create Convites for Mentor and Lider.
- **FR-006**: The system MUST ensure accepting any Convite joins an existing Igreja Local and never creates a new Igreja Local.
- **FR-007**: The system MUST allow a Mentor to accompany one or more Equipes in an Edicao and supervise Lideres.
- **FR-008**: The system MUST prevent Mentor-Equipe supervision across Igreja Local or Edicao boundaries.
- **FR-009**: The system MUST keep Fechamento da Equipe details owned by Lider work; Mentor MUST NOT consolidate, submit, own, validate, reject, or edit Fechamento details unless a future ADR changes that rule.
- **FR-010**: The system MUST keep Coordenador as the validator of Fechamentos.
- **FR-011**: Ranking MUST remain based only on validated Fechamentos da Equipe.
- **FR-012**: Permission checks MUST be enforced by Supabase constraints/RLS/RPC/Edge Function boundaries, not frontend UI alone.
- **FR-013**: The implementation MUST remain on the accepted React/Vite/Supabase stack from ADR 0001 and ADR 0002.

### Key Entities

- **Admin**: Product operator authorized to create or authorize Coordenadores. Does not replace Coordenador in Igreja Local operations.
- **Usuario**: Supabase-authenticated person represented in `usuarios`.
- **Coordenador**: Usuario authorized by Admin and responsible for one Igreja Local in the first version.
- **Igreja Local**: Tenant boundary for Usuarios, Edicoes, Equipes, Convites, Fechamentos, and Ranking.
- **Edicao**: Time-boxed sales campaign inside an Igreja Local.
- **Equipe**: Sales group inside an Edicao.
- **Mentor**: Usuario papel that supervises one or more Equipes and Lideres in an Edicao without consolidating or owning Fechamento details.
- **Lider**: Usuario assigned to lead one Equipe and send Fechamento da Equipe.
- **Convite**: Request for a Usuario to join an existing Igreja Local and assignment as Mentor or Lider.
- **Fechamento da Equipe**: Lider-submitted transfer proof and Valor Repassado awaiting Coordenador validation.
- **Ranking**: Ordered comparison of Equipes using validated Fechamentos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A later implementation worker can complete US1 from `tasks.md` without asking who creates or authorizes Coordenador.
- **SC-002**: Admin authorization, Mentor Convites, Lider Convites, and Mentor supervision each have at least one test or SQL verification task.
- **SC-003**: The planned data model identifies all role and assignment boundaries needed to prevent cross-Igreja Local and cross-Edicao access.
- **SC-004**: The plan preserves existing Ranking behavior: only validated Fechamentos contribute.
- **SC-005**: Tasks can be converted into GitHub issues with stable `T###` identifiers and feature path references.

## Assumptions

- Admin identity can be modeled as a product role in Supabase-backed tables/policies; the exact bootstrap path for the first Admin is an implementation detail to decide in research/tasks.
- Mentor has read/supervision permissions for assigned Equipes and Lideres, but no Fechamento submission, consolidation, ownership, or validation authority.
- Venda individual remains out of scope for Ranking in this feature.
