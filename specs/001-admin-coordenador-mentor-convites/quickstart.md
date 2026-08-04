# Quickstart validation scenarios

These scenarios guide future implementation validation. They do not require starting a local Supabase stack during this documentation task.

## Prerequisites for future implementation workers

- Review `CONTEXT.md`, `docs/modelo-minimo.md`, ADR 0001, ADR 0002, ADR 0003, and this spec directory.
- Apply migrations in the approved Supabase environment or test harness.
- Use test Usuarios with non-secret disposable emails.
- Do not print secrets or service-role keys.

## Scenario 1: Admin authorizes Coordenador

1. Sign in as an Admin test Usuario.
2. Create or authorize Coordenador email `coord@example.test`.
3. Sign in as `coord@example.test`.
4. Create Igreja Local with a name only.
5. Verify creation succeeds and Coordenador membership exists.
6. Sign in as a non-authorized Usuario.
7. Attempt to create/administer an Igreja Local as Coordenador.
8. Verify operation is rejected by backend authorization, not merely hidden in UI.

## Scenario 2: Coordenador invites Mentor

1. Sign in as active Coordenador of an Igreja Local.
2. Create an Edicao inside the Igreja Local.
3. Create Convite with papel `mentor` for `mentor@example.test`.
4. Sign in as `mentor@example.test` and accept the Convite.
5. Verify the Usuario joins the existing Igreja Local.
6. Verify Edicao assignment has papel `mentor`.
7. Verify no new Igreja Local was created by acceptance.

## Scenario 3: Mentor supervises multiple Equipes

1. Create two Equipes in the same Edicao.
2. Assign the accepted Mentor to both Equipes.
3. Sign in as Mentor.
4. Verify Mentor can view the supervised Equipes and Lider relationships.
5. Attempt to assign the Mentor to an Equipe in another Edicao or Igreja Local.
6. Verify assignment is rejected by backend rules.

## Scenario 4: Coordenador invites Lider with Mentor context

1. For an Equipe supervised by a Mentor, create Convite with papel `lider` for `lider@example.test`.
2. Sign in as `lider@example.test` and accept the Convite.
3. Verify the Lider is assigned to that Equipe.
4. Verify Lider sees the Mentor relationship.
5. Submit Fechamento da Equipe as Lider.
6. Verify Mentor cannot submit, consolidate, validate, reject, or edit that Fechamento.
7. Validate Fechamento as Coordenador.
8. Verify Ranking includes the Valor Repassado only after validation.

## Validation commands

Documentation-only changes:

```bash
find specs/001-admin-coordenador-mentor-convites -maxdepth 3 -type f -print
```

If product or TypeScript files changed in a future implementation:

```bash
npm run typecheck -- --pretty false
npm run build
```

If Supabase rules changed in a future implementation, also run the repo-approved SQL/RLS verification commands documented by that task.
