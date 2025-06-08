'use client';

import { Building2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* カラム1 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <Building2 className="h-6 w-6 text-blue-400" />
            <span className="font-bold text-lg">AI査定福山NO1データサイト</span>
          </div>
          <p className="text-sm">
            福山市の不動産査定に特化した最先端のAI査定サービスです。
          </p>
        </div>

        {/* カラム2 */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white">サービス</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">マンション査定</a></li>
            <li><a href="#" className="hover:text-white">戸建て査定</a></li>
            <li><a href="#" className="hover:text-white">土地査定</a></li>
            <li><a href="#" className="hover:text-white">投資物件査定</a></li>
          </ul>
        </div>

        {/* カラム3 */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white">会社情報</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">会社概要</a></li>
            <li><a href="#" className="hover:text-white">プライバシーポリシー</a></li>
            <li><a href="#" className="hover:text-white">利用規約</a></li>
            <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
          </ul>
        </div>

        {/* カラム4 */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white">お問い合わせ</h4>
          <ul className="space-y-2 text-sm">
            <li>📞 084-123-4567</li>
            <li>📧 info@fukuyama-ai-satei.com</li>
            <li>📍 福山市○○町1-2-3</li>
          </ul>
        </div>
      </div>

      {/* コピーライト */}
      <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-500">
        &copy; 2024 AI査定福山NO1データサイト. All rights reserved.
      </div>
    </footer>
  );
}
