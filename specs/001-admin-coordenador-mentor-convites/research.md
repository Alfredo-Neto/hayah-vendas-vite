# Research: Admin Coordenador country onboarding and Mentor Convites

## Decision 1: Admin is a product operator role

**Decision**: Model Admin as a Hayah product role capable of creating or authorizing Coordenadores. Admin is distinct from Coordenador and does not administer Igrejas Locais in the tracer bullet.

**Rationale**: `CONTEXT.md` previously warned against using Coordenador as a global admin. ADR 0003 accepts a separate Admin term so future agents do not overload Coordenador.

**Alternatives considered**:

- Reuse Coordenador as global admin: rejected because it conflicts with tenant language and makes country scope ambiguous.
- Rely on Supabase dashboard/manual inserts only: rejected as a long-term product model because authorization must be captured in domain rules and tests.

## Decision 2: Coordenador chooses country during onboarding

**Decision**: Coordenador country of origin/operation is selected during onboarding and persisted as scope for Igreja Local creation/administration.

**Rationale**: Captain intent explicitly requires the choice in onboarding. Storing a stable country code enables constraints and UI display without coupling rules to localized text.

**Alternatives considered**:

- Admin preselects country only: rejected because the accepted behavior says Coordenador chooses country.
- Allow unscoped Coordenador: rejected because it recreates global-admin ambiguity.

## Decision 3: Mentor is a formal Usuario papel and Edicao assignment

**Decision**: Mentor must be represented as a formal role/papel in the same domain as other Usuarios, with Edicao-level assignment and separate Mentor-to-Equipe supervision relationships.

**Rationale**: Mentors accompany one or more Equipes and supervise Lideres. This is not free-text metadata on Equipe and not a substitute for Lider.

**Alternatives considered**:

- Add `mentor_usuario_id` directly to `equipes`: rejected because one Mentor can accompany multiple Equipes and future Equipes may need history or multiple supervisors.
- Treat Mentor as `usuario` with flags only in UI: rejected because Supabase/RLS must enforce role behavior.

## Decision 4: Convites support Mentor and Lider with different assignment targets

**Decision**: Extend Convites so `papel` supports `mentor` and `lider`. Mentor Convites target Igreja Local + Edicao. Lider Convites target Igreja Local + Edicao + Equipe.

**Rationale**: Both roles enter by joining an existing Igreja Local. Lider responsibility is Equipe-specific; Mentor responsibility may cover multiple Equipes after acceptance.

**Alternatives considered**:

- Create separate Convite tables per role: rejected for now because validation/status/email acceptance rules are shared.
- Require Mentor assignment to Equipe during invite: rejected because a Mentor can be invited before final Equipe supervision is assigned.

## Decision 5: Mentor never owns Fechamento details in this feature

**Decision**: Mentor may view supervised operational context but cannot submit, consolidate, edit, validate, or reject Fechamento da Equipe.

**Rationale**: Captain intent says Mentor does not consolidate details and does not own Fechamento da Equipe details; Lider work remains Lider work.

**Alternatives considered**:

- Mentor pre-validates or consolidates Fechamentos: rejected by required behavior.
- Mentor validates Fechamentos for Coordenador: rejected; Coordenador validates and Ranking uses validated Fechamentos.

## Decision 6: Tests focus on database/RLS boundaries first

**Decision**: Future implementation tasks must include database/RLS/SQL verification for Admin authorization, Coordenador country scope, Convite acceptance, Mentor assignments, cross-boundary rejection, and Ranking preservation.

**Rationale**: Hayah product rules require Supabase to protect tenant boundaries and impossible states. UI tests alone are insufficient.

**Alternatives considered**:

- Manual-only validation: rejected for role and tenant boundaries.
- Frontend-only tests: rejected because frontend checks do not enforce authorization.
