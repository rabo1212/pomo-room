import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        // 코드 교환 실패 → 에러 파라미터와 함께 리다이렉트
        return NextResponse.redirect(`${origin}?auth_error=exchange_failed`);
      }
    } catch {
      return NextResponse.redirect(`${origin}?auth_error=server_error`);
    }
  } else {
    // code 파라미터 없음
    return NextResponse.redirect(`${origin}?auth_error=no_code`);
  }

  return NextResponse.redirect(origin);
}
