# Hayah Vendas Vite

Scaffold limpo para reconstruir Hayah Vendas com React, Vite e Supabase.

## Objetivo

Construir primeiro a bala traçadora descrita em `docs/modelo-minimo.md`.

O fluxo atual começa com Admin criando ou autorizando Coordenador, Coordenador criando Convites para Mentor e Líder, Mentor acompanhando Equipes e Líderes, Fechamento da Equipe pelo Líder, validação pelo Coordenador, e Ranking baseado em Fechamentos validados.

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
- `src/pages`: páginas vazias da bala traçadora.

## Próximo passo de modelagem

Seguir os artefatos em `specs/001-admin-coordenador-mentor-convites/` antes de implementar Admin, autorização de Coordenador, Mentor, Convites, acompanhamento de Equipes, Fechamento, validação e Ranking.
