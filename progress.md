# Progress

## Current Direction

Build Hayah Vendas as a professional but lean operational app using React, Vite, Supabase, TanStack Query, React Router, and shadcn/ui.

The first delivery path is the tracer bullet:

1. Coordenador creates access.
2. Coordenador creates Igreja Local.
3. Coordenador creates Edicao.
4. Coordenador creates Equipe.
5. Coordenador creates Convite de Lider.
6. Lider accepts Convite.
7. Lider registers Venda.
8. Coordenador sees simple Ranking.

## Done

- Initial Vite/React/Supabase scaffold.
- Supabase project initialized and linked.
- Core schema migration applied remotely:
  - `usuarios`
  - `igrejas_locais`
  - `igreja_local_membros`
- Minimal domain model documented in `docs/modelo-minimo.md`.
- TanStack Query installed and wired.
- shadcn/ui foundation added.
- Igreja Local creation flow exists in TypeScript using Supabase direct calls.

## In Progress

- Replace magic-link auth with email/password auth in a mentored, step-by-step way.

## Next

- Finish `/auth` email/password UI.
- Test Coordenador + Igreja Local manually.
- Add route protection and logout.
- Generate Supabase TypeScript types.
- Add Edicao schema and UI.

## Known Tradeoffs

- `createIgrejaLocal` is currently implemented in TypeScript with multiple Supabase calls, not as a transaction/RPC.
- This is acceptable for learning and speed now, but critical membership/Convite flows may later move to RPC or Edge Functions if consistency risk becomes painful.
