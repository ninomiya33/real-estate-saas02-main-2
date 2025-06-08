// app/layout.tsx
import "@/index.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

import { LanguageProvider } from "@/context/LanguageContext";
import { LeadsProvider } from "@/context/LeadsContext";
import { AuthProvider } from "@/context/AuthProvider";

export const metadata = {
  title: "不動産査定SaaS",
  description: "あなたの家の価値がすぐにわかる査定ツール",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-white text-gray-900">
        <LanguageProvider>
          <AuthProvider>
            <LeadsProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 p-4 max-w-4xl mx-auto">{children}</main>
                <Footer />
                <Toaster position="top-right" />
              </div>
            </LeadsProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
