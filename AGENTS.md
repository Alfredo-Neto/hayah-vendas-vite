# Agent Guide

This repo is the clean React/Vite/Supabase rebuild of Hayah Vendas.

Read these files before changing product behavior:

- `CONTEXT.md`: canonical domain language and terms to use in UI/code.
- `docs/modelo-minimo.md`: tracer-bullet model and first business rules.
- `docs/adr/`: architectural decisions.
- `features.json`: feature tracker and implementation status.
- `progress.md`: current working state and next steps.

Working rules:

- Keep the tracer bullet first: Coordenador -> Igreja Local -> Edicao -> Equipe -> Convite de Lider -> Venda -> Ranking.
- Prefer TypeScript/React for product flow and Supabase for auth, persistence, constraints, and RLS.
- Use shadcn/ui components for application surfaces when practical.
- Do not introduce Next, Clerk, or a heavy SaaS boilerplate without a new ADR.
- Keep docs concise; add details in `docs/` instead of growing this file.
