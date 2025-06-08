'use client';

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("ログアウトに失敗しました");
    } else {
      toast.success("ログアウトしました");
      router.push("/login"); // Next.jsのルーターで遷移
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      ログアウト
    </Button>
  );
}
