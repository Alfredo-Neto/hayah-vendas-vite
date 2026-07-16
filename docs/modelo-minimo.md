# Modelo Minimo Hayah Vendas

Este documento registra o modelo minimo para reconstruir o produto com React, Vite e Supabase.

## Bala Tracadora

1. Coordenador entra no sistema.
2. Coordenador cria uma Igreja Local.
3. Coordenador cria uma Edicao.
4. Coordenador cria uma Equipe.
5. Coordenador cria um Convite de Lider para a Equipe.
6. Lider aceita o Convite.
7. Lider registra uma Venda.
8. Coordenador ve um ranking simples da Edicao por Equipe.

## Vocabulario Canonico

- Igreja Local: limite administrativo principal.
- Usuario: pessoa autenticada que participa de uma Igreja Local.
- Coordenador: Usuario que administra uma Igreja Local.
- Edicao: campanha de vendas dentro de uma Igreja Local.
- Equipe: grupo dentro de uma Edicao, sob responsabilidade de um Lider.
- Lider: Usuario atribuido a uma Equipe dentro de uma Edicao.
- Convite: permissao para um Usuario entrar em uma Igreja Local e assumir um papel/atribuicao.
- Venda: resultado individual registrado por Lider ou Membro para uma Equipe em uma Edicao.

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
- `papel`: `coordenador` ou `usuario`.
- `criado_em`.
- `atualizado_em`.

Regras:

- O mesmo Usuario nao pode aparecer duas vezes na mesma Igreja Local.
- Na primeira versao, um Usuario nao pode ser Coordenador de duas Igrejas Locais.

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
- `papel`: inicialmente `lider`.
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

### edicao_assignments

Representa o papel operacional do Usuario dentro de uma Edicao.

- `id`.
- `igreja_local_id`.
- `edicao_id`.
- `equipe_id`.
- `usuario_id`.
- `papel`: inicialmente `lider`.
- `criado_em`.

Regras:

- Na primeira bala, um Lider pertence a exatamente uma Equipe dentro da Edicao.

### vendas

Representa uma Venda registrada para uma Equipe em uma Edicao.

- `id`.
- `igreja_local_id`.
- `edicao_id`.
- `equipe_id`.
- `seller_usuario_id`.
- `produto`.
- `quantidade`.
- `receita`.
- `custo`.
- `criado_em`.

Regras:

- Lider registra Venda apenas para sua Equipe.
- Ranking simples da primeira bala soma Vendas por Equipe.

## Operacoes Criticas

### criar_igreja_local(nome_igreja)

Entrada do React:

- `nome_igreja`.

Identidade:

- Banco usa `auth.uid()` para descobrir o usuario autenticado.

Mudancas em transacao:

1. Criar/atualizar `usuarios`.
2. Bloquear se o Usuario ja for Coordenador de alguma Igreja Local.
3. Bloquear se ja existir Igreja Local com mesmo nome.
4. Criar `igrejas_locais`.
5. Criar `igreja_local_membros` com `papel = coordenador`.
6. Retornar a Igreja Local criada.

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
