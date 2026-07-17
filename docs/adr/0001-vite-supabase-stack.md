# ADR 0001: React Vite and Supabase stack

## Status

Accepted

## Context

Hayah Vendas is an authenticated operational dashboard for Igrejas Locais to manage Edicoes, Equipes, Convites, Vendas, and rankings. The product does not currently need SSR, SEO-heavy public pages, or a custom fullstack framework.

The previous exploration with Next, Clerk, and a SaaS boilerplate added too much framework and organization-model complexity before the core product was stable.

## Decision

Use React, Vite, TypeScript, Supabase, TanStack Query, React Router, and shadcn/ui.

Supabase provides Auth, Postgres, constraints, RLS, migrations, and future Edge Functions. React/Vite owns the interactive product UI.

## Consequences

Most day-to-day product work happens in TypeScript and React.

The database still protects core data integrity through constraints and RLS. RPC or Edge Functions are reserved for flows that need strong transactions, secrets, or server-side integration.

Next, TanStack Start, Fastify, or another backend can be introduced later only when a concrete need appears.
