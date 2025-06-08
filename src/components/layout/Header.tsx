'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const { t, toggleLanguage } = useLanguage();
  const { user, loginWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* ロゴ */}
        <Link href="/" className="text-xl font-bold whitespace-nowrap">
          AI査定福山NO1データサイト
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:opacity-80">
            ホーム
          </Link>
          <Link href="/estimate" className="hover:opacity-80">
            査定
          </Link>
          <a href="#features" className="hover:opacity-80">
            特徴
          </a>
          <a href="#contact" className="hover:opacity-80">
            お問い合わせ
          </a>
          <Link href="/dashboard" className="hover:opacity-80">
            ダッシュボード
          </Link>

          {/* Language切り替え */}
          <Button variant="ghost" onClick={toggleLanguage} className="text-white">
            {t("languageToggle")}
          </Button>

          {/* ログイン/ログアウト */}
          {user ? (
            <Button variant="outline" onClick={handleLogout} className="text-white border-white">
              {t("logout") || "ログアウト"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={loginWithGoogle}
              className="border-white text-white flex items-center gap-2"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-4 w-4"
              />
              Googleでログイン
            </Button>
          )}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-white text-white"
              aria-label="Menu"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px] bg-white text-gray-900">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-blue-600">
                ホーム
              </Link>
              <Link href="/estimate" onClick={() => setIsOpen(false)} className="hover:text-blue-600">
                査定
              </Link>
              <a href="#features" onClick={() => setIsOpen(false)} className="hover:text-blue-600">
                特徴
              </a>
              <a href="#contact" onClick={() => setIsOpen(false)} className="hover:text-blue-600">
                お問い合わせ
              </a>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-blue-600">
                ダッシュボード
              </Link>

              {user ? (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  {t("logout") || "ログアウト"}
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => {
                    setIsOpen(false);
                    loginWithGoogle();
                  }}
                  className="flex items-center gap-2"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="h-4 w-4"
                  />
                  Googleでログイン
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
