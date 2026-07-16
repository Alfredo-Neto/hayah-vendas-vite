# Hayah Vendas Vite

Scaffold limpo para reconstruir Hayah Vendas com React, Vite e Supabase.

## Objetivo

Construir primeiro a bala traçadora:

1. Coordenador faz login.
2. Coordenador cria uma Igreja Local.
3. Coordenador cria uma Edição.
4. Coordenador cria uma Equipe.
5. Coordenador gera um Convite de Líder.
6. Líder aceita o Convite.
7. Líder registra uma Venda.
8. Coordenador vê o ranking simples da Edição.

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

Antes de codar a regra, responder:

Quando um Líder aceita um Convite, quais linhas precisam existir no banco para provar que ele pertence à Igreja Local, lidera uma Equipe naquela Edição e pode registrar Vendas apenas ali?
