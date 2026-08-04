# Modelo Minimo Hayah Vendas

Este documento registra o modelo minimo para reconstruir o produto com React, Vite e Supabase.

## Bala Tracadora

1. Admin cria ou autoriza um Coordenador.
2. Coordenador cria uma Igreja Local.
3. Coordenador cria uma Edicao.
4. Coordenador cria uma Equipe.
5. Coordenador cria Convites de Mentor e/ou Lider para a Edicao/Equipe.
6. Mentor ou Lider aceita o Convite.
7. Mentor acompanha uma ou mais Equipes e supervisiona Lideres, sem consolidar detalhes de Fechamento da Equipe.
8. Lider envia o Fechamento da Equipe.
9. Coordenador valida o Fechamento.
10. Coordenador ve um Ranking da Edicao por Equipe.

## Vocabulario Canonico

- Igreja Local: limite administrativo principal.
- Usuario: pessoa autenticada que participa de uma Igreja Local.
- Admin: operador do produto que cria ou autoriza Coordenadores.
- Coordenador: Usuario autorizado que administra uma Igreja Local.
- Edicao: campanha de vendas dentro de uma Igreja Local.
- Equipe: grupo dentro de uma Edicao, sob responsabilidade de um Lider.
- Mentor: Usuario atribuido a acompanhar uma ou mais Equipes em uma Edicao e supervisionar Lideres, sem assumir ou consolidar Fechamento da Equipe.
- Lider: Usuario atribuido a uma Equipe dentro de uma Edicao.
- Convite: permissao para um Usuario entrar em uma Igreja Local e assumir um papel/atribuicao, incluindo Mentor ou Lider.
- Fechamento da Equipe: comprovacao de valor ja repassado pelo Lider para a Igreja Local.
- Comprovante de Transferencia: evidencia anexada pelo Lider para o Coordenador conferir o repasse.
- Ranking: comparacao das Equipes usando apenas valores repassados em Fechamentos validados pelo Coordenador.

## Tabelas Da Primeira Bala

### usuarios

Representa a pessoa no dominio Hayah.

- `id`: id interno do dominio.
- `auth_user_id`: id do Supabase Auth.
- `email`.
- `nome`.
- `criado_em`.
- `atualizado_em`.

Regras:

- `auth_user_id` nao pode repetir.
- O React nunca envia `usuario_id` para operacoes sensiveis; o banco descobre o usuario real com `auth.uid()`.

### igrejas_locais

Representa a Igreja Local administrada pelo Coordenador.

- `id`.
- `nome`.
- `criado_por_usuario_id`.
- `criado_em`.
- `atualizado_em`.

Regras da primeira versao:

- Nome nao pode ser vazio.
- Nome nao pode repetir, por simplicidade inicial.

### igreja_local_membros

Representa o vinculo entre Usuario e Igreja Local.

- `id`.
- `igreja_local_id`.
- `usuario_id`.
- `papel`: `coordenador`, `mentor`, `lider` ou `usuario`, conforme a relacao do Usuario com a Igreja Local.
- `criado_em`.
- `atualizado_em`.

Regras:

- O mesmo Usuario nao pode aparecer duas vezes na mesma Igreja Local.
- Na primeira versao, um Usuario nao pode ser Coordenador de duas Igrejas Locais.
- Coordenador deve ter sido criado ou autorizado por um Admin antes de administrar uma Igreja Local.

### edicoes

Representa uma campanha de vendas dentro da Igreja Local.

- `id`.
- `igreja_local_id`.
- `nome`.
- `status`: `draft`, `active`, `review`, `finalized`.
- `data_inicio`.
- `data_fim`.
- `criado_por_usuario_id`.

Regra da primeira versao:

- Uma Igreja Local pode ter varias Edicoes, mas no maximo uma Edicao ativa.

### equipes

Representa uma Equipe dentro de uma Edicao.

- `id`.
- `igreja_local_id`.
- `edicao_id`.
- `nome`.
- `lider_usuario_id`.

Regras:

- Uma Equipe pertence a uma Edicao.
- Uma Equipe tem no maximo um Lider.

### convites

Representa o convite de entrada em uma Igreja Local e atribuicao operacional.

- `id`.
- `igreja_local_id`.
- `edicao_id`.
- `equipe_id`.
- `papel`: `mentor` ou `lider`.
- `code`.
- `invited_email`.
- `status`: `pending`, `accepted`, `revoked`.
- `expires_at`.
- `created_by_usuario_id`.
- `accepted_by_usuario_id`.
- `accepted_at`.

Regras:

- Convite com `invited_email` so pode ser aceito por usuario autenticado com o mesmo email.
- Convite aceito coloca o Usuario na Igreja Local e na atribuicao indicada pelo Convite.
- Convite de Mentor vincula o Usuario como Mentor da Edicao; Convite de Lider vincula o Usuario a uma Equipe.

### edicao_assignments

Representa o papel operacional do Usuario dentro de uma Edicao.

- `id`.
- `igreja_local_id`.
- `edicao_id`.
- `equipe_id`.
- `usuario_id`.
- `papel`: `mentor` ou `lider`.
- `criado_em`.

Regras:

- Na primeira bala, um Lider pertence a exatamente uma Equipe dentro da Edicao.
- Um Mentor pode acompanhar uma ou mais Equipes dentro da mesma Edicao.
- Mentor supervisiona Lideres, mas nao envia, consolida, valida ou possui detalhes de Fechamento da Equipe.

### fechamentos_equipe

Representa o valor ja transferido pelo Lider para a Igreja Local, com comprovante para validacao do Coordenador.

- `id`.
- `igreja_local_id`.
- `edicao_id`.
- `equipe_id`.
- `enviado_por_usuario_id`.
- `valor_repassado`.
- `comprovante_transferencia_path`.
- `observacao`.
- `status`: `enviado`, `validado`, `rejeitado`.
- `validado_por_usuario_id`.
- `validado_em`.
- `criado_em`.

Regras:

- Lider envia Fechamento apenas para sua Equipe.
- Fechamento so deve ser enviado depois que a transferencia foi feita.
- `valor_repassado` deve ser maior que zero.
- `comprovante_transferencia_path` e obrigatorio para enviar o Fechamento.
- Coordenador valida ou rejeita o Fechamento conferindo o comprovante e o recebimento real.
- Ranking soma `valor_repassado` apenas de Fechamentos com `status = validado`.

### vendas

Representa uma Venda individual de Lider ou Membro. Fica fora da primeira bala enquanto o fluxo oficial usa valor repassado validado.

Regras futuras:

- Venda, faturamento, custos e valor reinvestido podem explicar a composicao do Fechamento, mas nao entram no Ranking enquanto nao forem parte oficial do fluxo validado.

## Operacoes Criticas

### criar_igreja_local(nome_igreja)

Entrada do React:

- `nome_igreja`.

Identidade:

- Banco usa `auth.uid()` para descobrir o usuario autenticado.

Mudancas em transacao:

1. Criar/atualizar `usuarios`.
2. Bloquear se o Usuario nao foi criado ou autorizado por um Admin para atuar como Coordenador.
3. Bloquear se o Usuario ja for Coordenador de alguma Igreja Local.
4. Bloquear se ja existir Igreja Local com mesmo nome.
5. Criar `igrejas_locais`.
6. Criar `igreja_local_membros` com `papel = coordenador`.
7. Retornar a Igreja Local criada.

### aceitar_convite_lider(code)

Entrada do React:

- `code`.

Identidade:

- Banco usa `auth.uid()` para descobrir o convidado autenticado.

Bloqueios:

- Sem usuario autenticado.
- Convite nao existe.
- Convite nao esta `pending`.
- Convite expirou.
- `invited_email` nao bate com email do usuario autenticado.
- Equipe ja tem outro Lider.
- Usuario ja lidera outra Equipe na mesma Edicao.

Mudancas em transacao:

1. Criar/atualizar `usuarios`.
2. Criar ou reutilizar membership em `igreja_local_membros` com `papel = usuario`.
3. Criar atribuicao em `edicao_assignments` com `papel = lider`.
4. Atualizar `equipes.lider_usuario_id`.
5. Marcar Convite como `accepted`.
6. Retornar sucesso ou dados basicos da atribuicao.
