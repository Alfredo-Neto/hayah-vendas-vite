# Hayah Vendas Spec Kit Constitution

## Core Principles

### I. Hayah domain language is binding
All specs, plans, tasks, UI copy, database names, and code concepts MUST use the canonical Hayah terms in `CONTEXT.md`: Igreja Local, Usuario, Coordenador, Edicao, Equipe, Convite, Mentor, Lider, Fechamento da Equipe, Valor Repassado, Comprovante de Transferencia, and Ranking. Changes to role meaning or boundaries MUST update `CONTEXT.md` and, when architectural or product-significant, add an ADR under `docs/adr/`.

### II. Tracer bullet stays first
Feature work MUST preserve the delivery path documented in `docs/modelo-minimo.md` and `progress.md`: Admin/Coordenador access -> Igreja Local -> Edicao -> Equipe -> Convites -> Fechamento da Equipe -> Validacao -> Ranking. New roles such as Mentor may support this path, but MUST NOT move ownership of Fechamento da Equipe away from Lider or validation away from Coordenador without a new ADR.

### III. Supabase protects the domain
React sends user intent and Supabase Auth identifies the Usuario. Tenant boundaries, country scope, role assignments, impossible states, and sensitive authorization MUST be enforced by Supabase constraints, RLS, RPCs, or Edge Functions, not by frontend checks alone. No secrets may be read, logged, stored in specs, or committed.

### IV. Lean React/Vite implementation
The accepted stack is React, Vite, TypeScript, Supabase, TanStack Router, TanStack Query, React Hook Form, Zod, and shadcn/ui per ADR 0001 and ADR 0002. Do not introduce Next, Clerk, or a heavy SaaS boilerplate without a new ADR.

### V. Test-aware, issue-ready slices
Spec Kit `tasks.md` MUST be small, path-specific, dependency-ordered, and suitable for conversion to GitHub issues through the workstation `speckit-taskstoissues` path. Critical database rules, RLS policies, role boundaries, Convite acceptance, and ranking behavior MUST have automated tests or explicit SQL/manual verification tasks before implementation tasks are marked complete.

## Project sources of truth

Spec Kit artifacts complement rather than replace existing Hayah sources. Feature specs and plans MUST cite and align with:

- `AGENTS.md` for agent working rules.
- `CONTEXT.md` for canonical language.
- `docs/modelo-minimo.md` for the minimal model and first business rules.
- `docs/adr/` for accepted architecture and product decisions.
- `features.json` for feature tracking.
- `progress.md` for current state and next steps.

## Development workflow

Use Spec Kit in this order for substantial features: constitution -> spec -> checklist/clarify as needed -> plan -> research/data-model/contracts/quickstart -> tasks -> implementation slices. Implementation workers should receive narrow task ranges or user-story phases, not an ambiguous request to build the entire feature at once.

Documentation-only Spec Kit changes must be validated with relevant repository checks. Product or TypeScript changes require `npm run typecheck -- --pretty false` and `npm run build`. Do not start a local Supabase stack unless the task explicitly authorizes it.

## Governance

This constitution governs Spec Kit artifacts in this repository. Amendments require a code review, a clear reason, and updates to affected specs/plans/tasks. If this constitution conflicts with a later accepted ADR, update the constitution in the same change.

**Version**: 1.0.0 | **Ratified**: 2026-08-04 | **Last Amended**: 2026-08-04
