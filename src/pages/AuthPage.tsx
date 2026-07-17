import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { HayahBrand } from '@/components/HayahBrand';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignInMutation, useSignUpMutation } from '../features/auth/authMutations';

type AuthMode = 'sign-up' | 'sign-in';

const authFormSchema = z.object({
  email: z.email('Informe um email válido.'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
});

type AuthFormValues = z.infer<typeof authFormSchema>;

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('sign-up');
  const navigate = useNavigate();
  const signIn = useSignInMutation();
  const signUp = useSignUpMutation();
  const activeMutation = mode === 'sign-up' ? signUp : signIn;
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const title = mode === 'sign-up' ? 'Criar acesso' : 'Entrar';
  const description = mode === 'sign-up'
    ? 'Crie seu acesso para cadastrar a Igreja Local e virar Coordenador inicial.'
    : 'Entre com email e senha para continuar.';

  function handleSubmit(values: AuthFormValues) {
    activeMutation.mutate(values, {
      onSuccess: () => {
        void navigate({ to: '/igreja-local' });
      },
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="mb-8">
        <HayahBrand />
      </div>

      <Card className="hayah-card w-full max-w-md border shadow-none">
        <CardHeader>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Autenticação</p>
          <CardTitle className="text-3xl font-bold tracking-tight">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <Button type="button" variant={mode === 'sign-up' ? 'default' : 'ghost'} onClick={() => setMode('sign-up')}>
              Criar acesso
            </Button>
            <Button type="button" variant={mode === 'sign-in' ? 'default' : 'ghost'} onClick={() => setMode('sign-in')}>
              Entrar
            </Button>
          </div>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register('email')} />
              {form.formState.errors.email ? <p className="text-sm text-destructive">{form.formState.errors.email.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...form.register('password')} />
              {form.formState.errors.password ? <p className="text-sm text-destructive">{form.formState.errors.password.message}</p> : null}
            </div>
            <Button type="submit" className="w-full" disabled={activeMutation.isPending}>
              {activeMutation.isPending ? 'Salvando...' : title}
            </Button>
          </form>
          {activeMutation.isSuccess ? (
            <Alert>
              <AlertDescription>
                {mode === 'sign-up'
                  ? 'Acesso criado. Se o Supabase pedir confirmação, confira seu email antes de entrar.'
                  : 'Entrada realizada. Agora crie ou continue sua Igreja Local.'}
              </AlertDescription>
            </Alert>
          ) : null}
          {activeMutation.isError ? <Alert variant="destructive"><AlertDescription>{activeMutation.error.message}</AlertDescription></Alert> : null}
        </CardContent>
      </Card>
    </div>
  );
}
