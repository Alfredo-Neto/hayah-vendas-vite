# Hayah Vendas Domain Context

## Language

**Igreja Local**
The administrative boundary for Usuarios, Edicoes, Equipes, Convites, Fechamentos da Equipe, and rankings.
Avoid: organization, empresa, conta.

**Usuario**
A person authenticated through Supabase Auth and represented in the Hayah domain by `usuarios`.
Avoid: account.

**Admin**
A product operator who creates or authorizes Coordenadores before they administer Igrejas Locais. Admin is not a substitute name for Coordenador and does not own the Igreja Local tracer-bullet work.
Avoid: using admin to mean Coordenador.

**Coordenador**
A Usuario authorized by an Admin who administers one Igreja Local within their country of origin/operation. In the first version, a Usuario can coordinate only one Igreja Local.
Avoid: admin global.

**Pais de Operacao**
The country selected by the Coordenador during onboarding and used as their allowed operational scope for Igrejas Locais.
Avoid: unscoped global coordinator.

**Edicao**
A time-boxed sales campaign inside one Igreja Local. Equipes, roles, Fechamentos da Equipe, and Ranking belong to an Edicao.
Avoid: generic event.

**Equipe**
A sales group inside an Edicao. A Lider is responsible for one Equipe in the first tracer bullet.
Avoid: company, team account.

**Lider**
A Usuario assigned to lead an Equipe in an Edicao. The Lider sends the Fechamento da Equipe for that Equipe.
Avoid: coordenador.

**Membro**
A Usuario who belongs to one Equipe in an Edicao and records their own Vendas. Out of scope for the first tracer bullet.

**Mentor**
A formal Usuario type/papel who accompanies one or more Equipes in an Edicao and supervises Lideres. Mentor does not consolidate Fechamento da Equipe details, does not own Valor Repassado or Comprovante de Transferencia, and does not validate Fechamentos.

**Convite**
A request for a Usuario to join an existing Igreja Local and assignment, including Mentor or Lider assignments. Accepting a Convite never creates a new Igreja Local.
Avoid: generic signup link.

**Venda**
A sales record attributed to a Usuario, Equipe, Edicao, and Igreja Local. Out of scope for the first tracer bullet while Ranking uses validated Fechamentos da Equipe.

**Fechamento da Equipe**
The record sent by the Lider after transferring money to the Igreja Local. It includes valor repassado, comprovante de transferencia, optional observation, and validation status.

**Valor Repassado**
The amount declared by the Lider as transferred to the Igreja Local and validated by the Coordenador before it counts in Ranking.

**Comprovante de Transferencia**
The file attached by the Lider so the Coordenador can compare the declared valor repassado with the real transfer received by the Igreja Local.

**Ranking**
The ordered comparison of Equipes in an Edicao. The first tracer bullet uses only valor repassado from Fechamentos da Equipe validated by the Coordenador.

## Product Rule

React sends user intent. Supabase Auth identifies the Usuario. The database protects tenant boundaries and impossible states with constraints and RLS.
