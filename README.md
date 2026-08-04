# Hayah Vendas Vite

Scaffold limpo para reconstruir Hayah Vendas com React, Vite e Supabase.

## Objetivo

Construir primeiro a bala traçadora descrita em `docs/modelo-minimo.md`.

O fluxo da bala tracadora começa com Admin criando ou autorizando Coordenador, Coordenador criando Convites para Mentor e Lider, Mentor acompanhando Equipes e Lideres, Fechamento da Equipe pelo Lider, validacao pelo Coordenador, e Ranking baseado em Fechamentos validados.

O primeiro slice implementado permite que um Admin autorize um Coordenador em `/admin`; esse Coordenador cria uma Igreja Local por meio do RPC `criar_igreja_local`.

## Rodando

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure:

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Estrutura

- `src/app`: router e layout.
- `src/lib`: Supabase client e env.
- `src/pages`: paginas da bala tracadora.

## Proximo passo de modelagem

Seguir os artefatos em `specs/001-admin-coordenador-mentor-convites/` para continuar Mentor, Convites, acompanhamento de Equipes, Fechamento, validacao e Ranking.
