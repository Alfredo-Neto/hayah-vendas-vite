# Progress

## Current Direction

Build Hayah Vendas as a professional but lean operational app using React, Vite, Supabase, TanStack Router, TanStack Query, React Hook Form, Zod, and shadcn/ui.

The first delivery path is the tracer bullet:

1. Admin creates or authorizes Coordenador access.
2. Coordenador creates Igreja Local.
3. Coordenador creates Edicao.
4. Coordenador creates Equipe.
5. Coordenador creates Convites for Mentor and/or Lider.
6. Mentor or Lider accepts Convite.
7. Mentor accompanies one or more Equipes without consolidating Fechamento details.
8. Lider sends Fechamento da Equipe.
9. Coordenador validates Fechamento da Equipe.
10. Coordenador sees Ranking from validated Fechamentos.

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
- Igreja Local creation flow calls the backend `criar_igreja_local` RPC.
- `/auth` uses email/password sign-up and sign-in through Supabase Auth.
- App navigation uses TanStack Router.
- `/auth` form uses React Hook Form and Zod validation.
- Authenticated app routes are protected, `/auth` redirects authenticated Usuarios to `/igreja-local`, and logout signs out through Supabase before returning to `/auth`.
- `/admin` provides the minimal Admin UI for authorizing Coordenador access through `autorizar_coordenador`.
- Authenticated non-authorized Usuarios see an access-pending state instead of Coordenador operational routes; Admin and Coordenador navigation is based on `current_usuario_access`.
- Domain direction updated: Ranking should use validated valor repassado with transfer proof, not raw individual Vendas or declared lucro.
- ADR 0003 accepted Admin-created Coordenador, Mentor as a formal Usuario papel, and Convites for Mentor and Lider.

## In Progress

- Test Admin-authorized Coordenador + Igreja Local manually after applying the Admin authorization migration in an approved Supabase environment.
- Model Fechamento da Equipe with valor repassado and comprovante de transferencia.
- Continue remaining Spec Kit implementation in `specs/001-admin-coordenador-mentor-convites/` after the first Admin Coordenador slice.

## Manual Verification: Auth + Igreja Local

Use the existing approved `.env.local` development configuration; do not print its values and do not start a fresh local Supabase stack.

1. Run `npm run dev`.
2. In a fresh/anonymous browser session, visit `/dashboard`, `/admin`, `/igreja-local`, `/edicoes`, `/equipes`, `/convites`, `/vendas`, and `/ranking`; each protected route should show only the auth loading state briefly, then redirect to `/auth`.
3. Create access or sign in at `/auth`; successful authenticated access should land on `/igreja-local`.
4. While authenticated, visit `/auth`; it should redirect to `/igreja-local` instead of showing the auth form.
5. With an Admin-authorized Coordenador account, create an Igreja Local with a unique valid name and confirm the success message still appears.
6. Click `Sair`; the app should disable the logout button while signing out, clear the Supabase session, and return to `/auth`.
7. After logout, revisit a protected route and confirm it redirects back to `/auth`.
8. Regression check for stale local Supabase state: with the Vite dev server running and the approved `.env.local` loaded into the shell without printing values, run `APP_URL=http://127.0.0.1:<port> node scripts/check-route-protection.mjs`; it injects an invalid local Supabase session in a disposable Chrome profile and must still land on `/auth`, not Dashboard.

## Next

- Apply pending Supabase migrations in an approved Supabase environment and manually validate `/admin` -> `autorizar_coordenador` -> `/igreja-local` -> `criar_igreja_local`.
- Add an executable Supabase SQL/RLS test harness for Admin Coordenador authorization checks; until then, run `npm run verify:coordenador-guards` for the committed static RPC/RLS boundary check.
- Generate Supabase TypeScript types from the approved environment after migration application.
- Add Edicao UI.
- Implement the remaining Mentor, Lider Convites, Mentor-Equipe assignment, Fechamento, and Ranking work from `specs/001-admin-coordenador-mentor-convites/tasks.md`.
- Add Fechamento da Equipe schema with required transfer proof.

## Known Tradeoffs

- `createIgrejaLocal` now calls the `criar_igreja_local` RPC so Igreja Local creation and Coordenador membership stay behind the backend boundary.
- Future critical membership/Convite flows may also move to RPC or Edge Functions if consistency risk becomes painful.
- Venda individual, faturamento, custos, lucro and reinvestimento are intentionally not the Ranking source in the first tracer bullet; they may return later as supporting detail behind a Fechamento.
