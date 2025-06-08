"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const price = Math.floor(Math.random() * 20000000) + 15000000;
      alert(`AI査定結果\n\n推定価格: ${price.toLocaleString()}円`);
      setLoading(false);
    }, 2000);
  };

  const features = [
    { icon: "🤖", title: "最新AI技術", description: "機械学習アルゴリズムによる高精度な査定。" },
    { icon: "📊", title: "豊富なデータベース", description: "福山市の取引実績10万件以上のビッグデータ。" },
    { icon: "⚡", title: "即座に査定結果", description: "わずか30秒で査定結果をお知らせ。" },
    { icon: "🆓", title: "完全無料", description: "査定・相談は完全無料。" },
    { icon: "🏠", title: "地域密着", description: "福山市に特化した正確な査定。" },
    { icon: "📱", title: "24時間対応", description: "スマートフォンからも簡単にアクセス。" },
  ];

  return (
    <div className="space-y-16 px-4 py-10 max-w-7xl mx-auto">
      {/* Hero */}
      <section id="home" className="grid md:grid-cols-2 items-center gap-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-10 shadow-lg">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            福山市の不動産査定なら <br />AI査定福山NO1データサイト
          </h1>
          <p className="text-lg mb-6">
            最新のAI技術と豊富なデータベースで、あなたの不動産を正確に査定します。
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/estimate")}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-bold shadow-lg"
            >
              無料AI査定をはじめる
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-white text-indigo-600 border border-indigo-100 hover:bg-gray-100 px-6 py-3 rounded-full font-bold"
            >
              ダッシュボード
            </button>
          </div>
        </div>
        <div>
          <Image
            src="/images/real-estate.jpg"
            alt="住宅街"
            width={600}
            height={400}
            className="rounded shadow object-cover"
            unoptimized
          />
        </div>
      </section>

 

      {/* 主な特徴 */}
      <section id="features" className="py-12 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-800 mb-6">AI査定福山NO1データサイトの特徴</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl shadow text-center flex flex-col items-center hover:scale-105 transition duration-300 ease-in-out"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-12 rounded-xl text-center grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-4xl font-bold mb-2">100,000+</h3>
          <p>査定実績件数</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold mb-2">98.5%</h3>
          <p>査定精度</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold mb-2">30秒</h3>
          <p>平均査定時間</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold mb-2">24/7</h3>
          <p>サポート体制</p>
        </div>
      </section>
    </div>
  );
}
