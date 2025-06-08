// app/callback/page.tsx
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen text-lg text-gray-700">
      Googleログイン処理中です... 少々お待ちください。
    </div>
  );
}
