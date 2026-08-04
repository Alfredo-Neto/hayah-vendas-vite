# Agent Guide

This repo is the clean React/Vite/Supabase rebuild of Hayah Vendas.

Read these files before changing product behavior:

- `CONTEXT.md`: canonical domain language and terms to use in UI/code.
- `docs/modelo-minimo.md`: tracer-bullet model and first business rules.
- `docs/adr/`: architectural decisions.
- `features.json`: feature tracker and implementation status.
- `progress.md`: current working state and next steps.

Working rules:

- Keep the tracer bullet first: Admin creates or authorizes Coordenador -> Coordenador chooses country during onboarding -> Coordenador creates Igreja Local, Edicao, and Equipe -> Coordenador invites Mentor and Lider -> Mentor accompanies one or more Equipes without owning Fechamento details -> Lider owns Fechamento da Equipe -> Coordenador validates -> Ranking uses validated Fechamentos.
- Prefer TypeScript/React for product flow and Supabase for auth, persistence, constraints, and RLS.
- Use shadcn/ui components for application surfaces when practical.
- Do not introduce Next, Clerk, or a heavy SaaS boilerplate without a new ADR.
- Keep docs concise; add details in `docs/` instead of growing this file.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
