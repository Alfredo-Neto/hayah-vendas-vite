import { readFileSync } from 'node:fs';

const migration = readFileSync('supabase/migrations/20260804071000_admin_coordenador_authorization.sql', 'utf8');
const accessMigration = readFileSync('supabase/migrations/20260804190000_coordenador_access_guards.sql', 'utf8');

const checks = [
  {
    name: 'criar_igreja_local exists as RPC boundary',
    pass: /create or replace function public\.criar_igreja_local\(p_nome text\)/.test(migration),
  },
  {
    name: 'criar_igreja_local requires active coordenador authorization',
    pass: /from public\.coordenador_authorizations autorizacao[\s\S]*autorizacao\.status = 'active'/.test(migration),
  },
  {
    name: 'unauthorized Igreja Local creation raises domain authorization error',
    pass: migration.includes('Admin precisa autorizar este Usuario como Coordenador antes de criar uma Igreja Local.'),
  },
  {
    name: 'ordinary users cannot directly insert Igreja Local through RLS policy',
    pass: /alter table public\.igrejas_locais enable row level security;/.test(migration) && !/create policy [\s\S]* on public\.igrejas_locais\s+for insert/.test(migration),
  },
  {
    name: 'only Admin can authorize Coordenador through RPC',
    pass: migration.includes('Apenas Admin pode autorizar Coordenador.') && /if not public\.current_usuario_is_admin\(\) then/.test(migration),
  },
  {
    name: 'frontend role query cannot grant Coordenador privileges',
    pass: /create or replace function public\.current_usuario_access\(\)/.test(accessMigration)
      && !/insert into public\.coordenador_authorizations|insert into public\.igreja_local_membros/.test(accessMigration),
  },
  {
    name: 'membership alone cannot grant operational Coordenador access',
    pass: accessMigration.includes('v_is_coordenador_authorized and v_coordenador_igreja_local_id is not null')
      && accessMigration.includes('case when v_is_coordenador_authorized then v_coordenador_igreja_local_id else null end'),
  },
  {
    name: 'child operational RLS verifies parent Igreja Local consistency',
    pass: /create or replace function public\.edicao_belongs_to_igreja_local/.test(accessMigration)
      && /create or replace function public\.equipe_belongs_to_edicao_igreja_local/.test(accessMigration)
      && /create or replace function public\.convite_context_belongs_to_igreja_local/.test(accessMigration)
      && /create policy equipes_operate_coordenador_authorized[\s\S]*public\.edicao_belongs_to_igreja_local\(edicao_id, igreja_local_id\)/.test(accessMigration)
      && /create policy convites_operate_coordenador_authorized[\s\S]*public\.convite_context_belongs_to_igreja_local\(edicao_id, equipe_id, igreja_local_id\)/.test(accessMigration)
      && /create policy edicao_assignments_operate_coordenador_authorized[\s\S]*public\.equipe_belongs_to_edicao_igreja_local\(equipe_id, edicao_id, igreja_local_id\)/.test(accessMigration)
      && /create policy fechamentos_equipe_operate_coordenador_authorized[\s\S]*public\.equipe_belongs_to_edicao_igreja_local\(equipe_id, edicao_id, igreja_local_id\)/.test(accessMigration),
  },
];

const failed = checks.filter((check) => !check.pass);

for (const check of checks) {
  console.log(`${check.pass ? 'ok' : 'not ok'} - ${check.name}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}
