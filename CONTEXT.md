# Hayah Vendas Domain Context

## Language

**Igreja Local**
The administrative boundary for Usuarios, Edicoes, Equipes, Convites, Vendas, and rankings.
Avoid: organization, empresa, conta.

**Usuario**
A person authenticated through Supabase Auth and represented in the Hayah domain by `usuarios`.
Avoid: account.

**Coordenador**
A Usuario who administers one Igreja Local. In the first version, a Usuario can coordinate only one Igreja Local.
Avoid: admin global.

**Edicao**
A time-boxed sales campaign inside one Igreja Local. Equipes, roles, Vendas, and ranking belong to an Edicao.
Avoid: generic event.

**Equipe**
A sales group inside an Edicao. A Lider is responsible for one Equipe in the first tracer bullet.
Avoid: company, team account.

**Lider**
A Usuario assigned to lead an Equipe in an Edicao. The Lider can register Vendas for that Equipe.
Avoid: coordenador.

**Membro**
A Usuario who belongs to one Equipe in an Edicao and records their own Vendas. Out of scope for the first tracer bullet.

**Mentor**
A Usuario who supervises one or more Equipes in an Edicao. Out of scope for the first tracer bullet.

**Convite**
A request for a Usuario to join an existing Igreja Local and assignment. Accepting a Convite never creates a new Igreja Local.
Avoid: generic signup link.

**Venda**
A sales record attributed to a Usuario, Equipe, Edicao, and Igreja Local.

**Ranking**
The ordered comparison of Equipes in an Edicao. The first tracer bullet uses a simple ranking from Vendas.

## Product Rule

React sends user intent. Supabase Auth identifies the Usuario. The database protects tenant boundaries and impossible states with constraints and RLS.
