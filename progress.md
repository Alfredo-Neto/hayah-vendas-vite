# Progress

## Current Direction

Build Hayah Vendas as a professional but lean operational app using React, Vite, Supabase, TanStack Router, TanStack Query, React Hook Form, Zod, and shadcn/ui.

The first delivery path is the tracer bullet:

1. Coordenador creates access.
2. Coordenador creates Igreja Local.
3. Coordenador creates Edicao.
4. Coordenador creates Equipe.
5. Coordenador creates Convite de Lider.
6. Lider accepts Convite.
7. Lider sends Fechamento da Equipe.
8. Coordenador validates Fechamento da Equipe.
9. Coordenador sees Ranking from validated Fechamentos.

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
- `/auth` uses email/password sign-up and sign-in through Supabase Auth.
- App navigation uses TanStack Router.
- `/auth` form uses React Hook Form and Zod validation.
- Domain direction updated: Ranking should use validated valor repassado with transfer proof, not raw individual Vendas or declared lucro.

## In Progress

- Test Coordenador + Igreja Local manually.
- Model Fechamento da Equipe with valor repassado and comprovante de transferencia.

## Next

- Test Coordenador + Igreja Local manually.
- Add route protection and logout.
- Generate Supabase TypeScript types.
- Add Edicao schema and UI.
- Add Fechamento da Equipe schema with required transfer proof.

## Known Tradeoffs

- `createIgrejaLocal` is currently implemented in TypeScript with multiple Supabase calls, not as a transaction/RPC.
- This is acceptable for learning and speed now, but critical membership/Convite flows may later move to RPC or Edge Functions if consistency risk becomes painful.
- Venda individual, faturamento, custos, lucro and reinvestimento are intentionally not the Ranking source in the first tracer bullet; they may return later as supporting detail behind a Fechamento.
