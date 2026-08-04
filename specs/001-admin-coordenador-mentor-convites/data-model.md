# Data Model: Admin Coordenador and Mentor Convites

This model extends `docs/modelo-minimo.md`; names below are conceptual and should be mapped to final SQL names during implementation.

## Existing entities to preserve

### usuarios

Represents a Supabase-authenticated person.

Add/confirm relationships:

- Can be authorized as Coordenador.
- Can be assigned as Mentor or Lider in an Edicao.
- May have one membership row per Igreja Local.

### igrejas_locais

Tenant boundary for Edicoes, Equipes, Convites, Fechamentos, and Ranking.

Rules:

- Created/administered by an Admin-authorized Coordenador.

### igreja_local_membros

Membership in an Igreja Local.

Role values needed for this feature:

- `coordenador`
- `mentor`
- `lider`
- `usuario`

Rules:

- One row per Usuario per Igreja Local.
- Coordenador membership requires Admin authorization.
- Mentor/Lider membership is created or reused through Convite acceptance.

### edicoes

Campaign inside an Igreja Local.

Rules:

- Mentor and Lider assignments must belong to an Edicao.
- Cross-Igreja Local Edicao assignments are invalid.

### equipes

Sales group inside an Edicao.

Rules:

- `lider_usuario_id` remains the Lider responsible for Fechamento da Equipe.
- Mentor supervision should not replace `lider_usuario_id`.

### convites

Request for a Usuario to join an existing Igreja Local and assignment.

Needed role values:

- `mentor`
- `lider`

Rules:

- `mentor` Convite requires Igreja Local and Edicao; Equipe is optional and usually null.
- `lider` Convite requires Igreja Local, Edicao, and Equipe.
- Accepting a Convite never creates an Igreja Local.
- `invited_email`, status, expiration, and single-acceptance rules from `docs/modelo-minimo.md` remain.

### edicao_assignments

Operational role of Usuario in an Edicao.

Needed role values:

- `mentor`
- `lider`

Rules:

- Lider belongs to exactly one Equipe in the first tracer bullet.
- Mentor belongs to the Edicao and can supervise one or more Equipes through supervision assignments.
- Assignment Igreja Local, Edicao, Equipe, and Usuario must stay within one tenant boundary.

### fechamentos_equipe

Lider-submitted transfer proof and Valor Repassado.

Rules to preserve:

- Lider sends Fechamento only for their Equipe.
- Coordenador validates or rejects.
- Mentor has no ownership, consolidation, submission, edit, or validation authority.
- Ranking sums only `status = validado`.

## New or expanded entities

### admins or admin_authorizations

Represents product operator authorization to create/authorize Coordenadores.

Candidate fields:

- `id`
- `usuario_id` or `auth_user_id`
- `email` for pre-auth authorization when Usuario does not exist yet
- `status`: active/revoked
- `criado_em`, `atualizado_em`

Rules:

- Only Admin can create/authorize Coordenador.
- Bootstrapping the first Admin must be explicit and protected; do not embed secrets in code or docs.

### coordenador_authorizations

Represents Admin authorization for a Coordenador.

Candidate fields:

- `id`
- `usuario_id` nullable until first sign-in, or `email`
- `authorized_by_admin_usuario_id`
- `status`: pending/active/revoked
- `activated_at`
- `criado_em`, `atualizado_em`

Rules:

- Email matching must prevent another Usuario from claiming an authorization.
- Active Coordenador authorization is required before Igreja Local administration.
- In the first version, one Usuario cannot coordinate two Igrejas Locais.

### mentor_equipe_assignments

Represents Mentor supervision of Equipes.

Candidate fields:

- `id`
- `igreja_local_id`
- `edicao_id`
- `mentor_usuario_id`
- `equipe_id`
- `created_by_usuario_id`
- `criado_em`

Rules:

- `mentor_usuario_id` must have Mentor assignment in the same Igreja Local and Edicao.
- `equipe_id` must belong to the same Igreja Local and Edicao.
- Unique pair: one Mentor-to-Equipe relationship should not duplicate.
- A Mentor may supervise multiple Equipes.
- An Equipe may have one or more Mentors only if future product rules allow it; if not decided, start with one active Mentor per Equipe for simplicity and document the constraint.

## State transitions

### Coordenador authorization

1. Admin creates pending Coordenador authorization for email.
2. Matching Usuario signs in.
3. Authorization becomes active or is recognized as active.
4. Authorized Coordenador can create/administer one Igreja Local in the first version.
5. Admin may revoke authorization; downstream effects need implementation decision and tests.

### Mentor Convite

1. Coordenador creates pending Convite with papel `mentor` for Igreja Local + Edicao.
2. Matching authenticated Usuario accepts before expiration.
3. System creates/reuses Usuario and Igreja Local membership.
4. System creates Edicao assignment as Mentor.
5. Convite becomes accepted.
6. Coordenador assigns Mentor to one or more Equipes.

### Lider Convite

1. Coordenador creates pending Convite with papel `lider` for Igreja Local + Edicao + Equipe.
2. Matching authenticated Usuario accepts before expiration.
3. System creates/reuses Usuario and Igreja Local membership.
4. System creates Edicao assignment as Lider and updates Equipe Lider.
5. Convite becomes accepted.
6. Lider remains Fechamento owner for that Equipe.
