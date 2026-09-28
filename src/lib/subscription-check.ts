import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

// Middleware que checa se a organização atual tem uma subscription ativa.
// Essa checagem é simplificada para exemplo (idealmente, extrai a org_id do usuário logado via session)

export async function checkSubscription(request: NextRequest, organizationId: string) {
  // Apenas protegemos rotas específicas, como /app/*
  if (!request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  // Verifica o status da assinatura no banco
  const supabase = createSupabaseAdmin();
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, expires_at')
    .eq('organization_id', organizationId)
    .single();

  // Se não existir ou estiver cancelada/vencida, redireciona
  const isExpired = !sub || 
                    sub.status === 'overdue' || 
                    sub.status === 'cancelled' ||
                    (sub.expires_at && new Date(sub.expires_at) < new Date());

  if (isExpired) {
    const url = request.nextUrl.clone();
    url.pathname = '/assinatura-expirada';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
