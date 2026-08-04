# ADR 0003: Admin-created Coordenador and Mentor Convites

## Status

Accepted

## Context

The original tracer bullet allowed a Coordenador to enter the system and create one Igreja Local. New product decisions require a more controlled access model and a formal Mentor role:

- Admin creates or authorizes Coordenador.
- Mentor is a formal Usuario type/papel.
- Coordenador can invite Mentors and Lideres.
- Mentor accompanies one or more Equipes and supervises Lideres.
- Mentor does not consolidate Fechamento da Equipe details.
- Lider still owns Fechamento da Equipe details.
- Coordenador validates Fechamentos and Ranking uses only validated Fechamentos.

## Decision

Introduce Admin as a product operator role responsible for creating or authorizing Coordenadores before they administer Igrejas Locais.

Treat Mentor as a formal Hayah Usuario papel. A Coordenador can create Convites for both Mentor and Lider. A Mentor may accompany one or more Equipes in an Edicao and supervise Lideres, but does not consolidate Fechamento da Equipe details, does not own Valor Repassado or Comprovante de Transferencia, and does not validate Fechamentos.

## Consequences

The minimal model must expand beyond `papel = lider` for Convites and Edicao assignments.

The database model and RLS must represent Admin authorization, Mentor Convites, and Mentor-to-Equipe supervision without allowing cross-Igreja Local or cross-Edicao assignments.

The tracer bullet remains intact: Mentors support Equipes and Lideres, while Lider sends Fechamento da Equipe, Coordenador validates, and Ranking remains based on validated Fechamentos.

Implementation is tracked through Spec Kit under `specs/001-admin-coordenador-mentor-convites/`; keep completed and remaining slice status there.
