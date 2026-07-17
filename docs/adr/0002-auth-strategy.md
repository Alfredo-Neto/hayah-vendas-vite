# ADR 0002: Supabase Auth with product-owned roles

## Status

Accepted

## Context

The product needs login, sign-up, membership, Convites, and role-based access. Roles such as Coordenador and Lider are domain roles, not authentication-provider roles.

Supabase Auth handles identity. Hayah Vendas stores domain users in `usuarios` and domain membership in `igreja_local_membros`.

## Decision

Use Supabase Auth for authentication and keep product roles in the application database.

The initial UX uses email/password because it is familiar and makes the Coordenador onboarding flow clearer than magic links.

The app may later add OAuth providers, password reset, email confirmation rules, and MFA depending on product needs.

## Consequences

The frontend can use Supabase's standard auth client instead of building password handling or session management from scratch.

The app still needs professional auth hardening before launch: route protection, logout, password reset, email confirmation decision, session-expiry handling, and RLS policies.

No product permission should depend only on frontend UI checks.
