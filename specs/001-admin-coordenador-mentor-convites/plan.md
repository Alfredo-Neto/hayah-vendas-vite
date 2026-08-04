# Implementation Plan: Admin Coordenador and Mentor Convites

**Branch**: `fm/hayah-admin-mentor-spec-i9` | **Date**: 2026-08-04 | **Spec**: `specs/001-admin-coordenador-mentor-convites/spec.md`

**Input**: Feature specification from `specs/001-admin-coordenador-mentor-convites/spec.md`

## Summary

Prepare the Hayah domain and implementation path for Admin-authorized Coordenadores, Mentor as a formal Usuario papel, and Convites for Mentor and Lider. The future implementation should extend Supabase schema/RLS/RPC boundaries first, then add small React/Vite surfaces for Admin authorization, Convite creation/acceptance, Mentor supervision, and Lider Mentor context. Fechamento da Equipe remains Lider work; Mentor does not consolidate Fechamento details; Coordenador validates; Ranking remains based on validated Fechamentos.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19, Vite 8  
**Primary Dependencies**: Supabase JS, TanStack Router, TanStack Query, React Hook Form, Zod, shadcn/ui components  
**Storage**: Supabase Postgres, Supabase Auth, RLS, migrations in `supabase/migrations/`  
**Testing**: `npm run typecheck -- --pretty false`, `npm run build`, future SQL/RLS verification under `supabase/tests/` or repo-approved equivalent; frontend tests may be added if a test runner is introduced in a separate task  
**Target Platform**: Authenticated browser app with Supabase backend  
**Project Type**: Web application  
**Performance Goals**: Normal dashboard interactions should remain simple list/detail flows; no bulk sales processing in this feature  
**Constraints**: No local Supabase stack in this planning task; no secrets; preserve ADR 0001/0002 stack; do not implement product feature during Spec Kit preparation  
**Scale**: First operational version for one Coordenador, one Igreja Local, Edicoes, Equipes, Convites, Mentors, Lideres, Fechamentos, and Ranking

## Constitution Check

- **Hayah domain language**: PASS. Spec and docs use Admin, Usuario, Coordenador, Igreja Local, Edicao, Equipe, Mentor, Lider, Convite, Fechamento da Equipe, Ranking.
- **Tracer bullet first**: PASS. Mentor supports Equipes/Lideres but does not take Fechamento or validation ownership.
- **Supabase protects domain**: PASS. Foundational tasks require schema, constraints, RLS/RPC, and tests before UI.
- **Lean React/Vite implementation**: PASS. Plan stays within accepted stack from ADR 0001/0002.
- **Test-aware issue-ready slices**: PASS. Tasks include path-specific test/verification tasks and stable `T###` IDs.

## Project Structure

### Documentation (this feature)

```text
specs/001-admin-coordenador-mentor-convites/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
├── contracts/
│   └── role-flows.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
├── components/
│   └── ui/
├── features/
├── lib/
│   └── supabase.ts
├── pages/
└── styles.css

supabase/
├── migrations/
└── tests/              # add if SQL/RLS verification harness is adopted

docs/
├── adr/
│   └── 0003-admin-mentor-convites.md
└── modelo-minimo.md
```

**Structure Decision**: Use the existing single Vite app plus Supabase migrations. Add feature-specific frontend modules only when implementation begins; this planning task intentionally avoids creating product code directories.

## Phase 0 Research Output

See `research.md` for decisions on Admin modeling, Mentor assignments, Convites, and test strategy.

## Phase 1 Design Output

See `data-model.md` for entity/relationship changes, `contracts/role-flows.md` for user-flow contracts, and `quickstart.md` for validation scenarios.

## Complexity Tracking

No constitution violations are planned. Admin is a new product role, but ADR 0003 records why it is needed and how it remains distinct from Coordenador.
