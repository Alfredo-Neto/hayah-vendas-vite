# Contracts: Role and Convite flows

These are product-flow contracts. The Admin authorizes Coordenador and Coordenador creates Igreja Local flows are implemented as Supabase RPCs; remaining flows may use Supabase RPC, direct calls protected by RLS, or Edge Functions when justified by ADR 0001.

## Admin authorizes Coordenador

Implemented RPC: `autorizar_coordenador(p_email, p_nome)`.

**Actor**: Admin  
**Input**: Coordenador email and optional display name  
**Outcome**: Pending or active Coordenador authorization exists.

Rules:

- Reject if actor is not Admin.
- Reject duplicate active authorization for same email/Usuario unless explicitly idempotent.
- Do not create an Igreja Local in this flow.
- Do not store secrets in authorization records.

## Coordenador creates Igreja Local

Implemented RPC: `criar_igreja_local(p_nome)`.

**Actor**: Active Coordenador  
**Input**: Igreja Local name  
**Outcome**: Igreja Local and Coordenador membership exist.

Rules:

- Reject unauthenticated Usuario.
- Reject Usuario without Admin-created or Admin-authorized Coordenador status.
- Existing uniqueness and non-empty-name rules from `docs/modelo-minimo.md` remain.
- Database must discover authenticated Usuario from Supabase Auth rather than trusting frontend-provided sensitive IDs.

## Coordenador creates Convite de Mentor

**Actor**: Coordenador of Igreja Local  
**Input**: Igreja Local, Edicao, invited email, expiration  
**Outcome**: Pending Convite with papel `mentor`.

Rules:

- Edicao must belong to Igreja Local.
- Convite acceptance must create/reuse membership in existing Igreja Local.
- Equipe is optional for Mentor Convite; Mentor-to-Equipe supervision can be assigned later.

## Coordenador creates Convite de Lider

**Actor**: Coordenador of Igreja Local  
**Input**: Igreja Local, Edicao, Equipe, invited email, expiration  
**Outcome**: Pending Convite with papel `lider`.

Rules:

- Equipe must belong to Edicao and Igreja Local.
- Reject if Equipe already has a different Lider according to current rules.
- Accepted Lider remains responsible for Fechamento da Equipe.

## Usuario accepts Convite

**Actor**: Authenticated Usuario matching invited email  
**Input**: Convite code  
**Outcome**: Membership, Edicao assignment, optional Equipe assignment, and accepted Convite.

Rules:

- Reject missing, expired, revoked, or already accepted Convite.
- Reject email mismatch.
- Never create a new Igreja Local.
- Mentor acceptance creates Mentor assignment.
- Lider acceptance creates Lider assignment and updates Equipe Lider.

## Coordenador assigns Mentor to Equipes

**Actor**: Coordenador of Igreja Local  
**Input**: Mentor assignment, one or more Equipes  
**Outcome**: Mentor supervision relationships.

Rules:

- Mentor and Equipes must share Igreja Local and Edicao.
- Reject cross-Igreja Local and cross-Edicao assignments.
- Mentor can supervise one or more Equipes.
- Mentor does not gain Fechamento consolidation, validation, or ownership permissions.
