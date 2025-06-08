// ✅ ファイル: src/app/login/page.tsx

'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthProvider";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  const handleLogin = async () => {
    const redirectUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:3000/auth/callback"
        : `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error("❌ ログイン失敗:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded"
      >
        Googleでログイン
      </Button>
    </div>
  );
}
