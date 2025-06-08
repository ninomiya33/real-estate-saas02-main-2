'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error('❌ セッション取得失敗:', error?.message || 'No session');
        router.push('/login');
        return;
      }

      router.push('/dashboard'); // セッションがあればダッシュボードへ
    };

    checkSession();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen text-lg text-gray-600">
      Googleログイン処理中です... 少々お待ちください。
    </div>
  );
}
