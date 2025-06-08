'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthProvider";

import { estimatePrice } from "@/hooks/useEstimate";
import { useToast } from "@/hooks/use-toast";
import cityCodeMap from "@/data/city_code_map_all.json";

// スキーマ定義
const propertySchema = z.object({
  prefecture: z.string().min(1),
  city: z.string().min(1),
  town: z.string().min(1),
  landSize: z.coerce.number().positive(),
  frontage: z.coerce.number().positive(),
  breadth: z.coerce.number().positive(),
  coverageRatio: z.coerce.number().positive(),
  floorAreaRatio: z.coerce.number().positive(),
});

const userSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
});

type PropertyFormData = z.infer<typeof propertySchema>;
type UserFormData = z.infer<typeof userSchema>;

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

export default function EstimatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast: toastAI } = useToast();

  const [step, setStep] = useState<"property" | "user" | "result">("property");

  const [formData, setFormData] = useState<any>({
    prefecture: "", city: "", town: "", landSize: 0,
    frontage: 0, breadth: 0, coverageRatio: 0, floorAreaRatio: 0,
    name: "", phone: "", email: ""
  });

  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const propertyForm = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      prefecture: "", city: "", town: "", landSize: 0,
      frontage: 0, breadth: 0, coverageRatio: 0, floorAreaRatio: 0,
    },
  });

  const userForm = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", phone: "", email: "" },
  });

  const onPropertySubmit = (data: PropertyFormData) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep("user");
  };

  const onUserSubmit = (data: UserFormData) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep("result");
  };

  const handleAIEstimate = async () => {
    try {
      const selectedCityName = formData.city.trim();
      const city_code = cityCodeMap[selectedCityName];

      if (!city_code) {
        toast.error(`市区町村 "${selectedCityName}" に対応するAI査定モデルが見つかりません`);
        return;
      }

      const features: [number, number, number, number, number] = [
        formData.landSize,
        formData.frontage,
        formData.breadth,
        formData.coverageRatio,
        formData.floorAreaRatio,
      ];

      console.log("▶️ AI査定リクエスト", { city_code, features });

      const result = await estimatePrice({ city_code, features });

      setEstimatedPrice(result.predicted_price);

      toast.success(`AI査定完了！ ${result.predicted_price.toLocaleString()} 円`);
    } catch (error: any) {
      console.error("AI査定エラー:", error);
      toast.error("AI査定に失敗しました");
    }
  };

  const handleSubmit = async () => {
    const {
      name, phone, email, prefecture, city, town, landSize,
      frontage, breadth, coverageRatio, floorAreaRatio
    } = formData;

    const price = estimatedPrice;

    if (isNaN(landSize)) {
      toast.error("土地面積が不正です");
      return;
    }

    const { error } = await supabase.from("customers").insert({
      user_id: user?.id,
      name,
      phone,
      email,
      address: `${prefecture} ${city} ${town}`,
      area: landSize,
      price,
      status: "見積済",
      estimate_type: "AI",
      frontage,
      breadth,
      coverage_ratio: coverageRatio,
      floor_area_ratio: floorAreaRatio,
    });

    if (error) {
      console.error("💥 Supabase保存エラー", error);
      toast.error(`保存に失敗しました: ${error.message}`);
    } else {
      toast.success("査定が保存されました！ダッシュボードに移動します...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }    
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>不動産AI査定</CardTitle>
          <CardDescription>必要な情報を入力してください</CardDescription>
        </CardHeader>

        <CardContent>
          {step === "property" && (
            <Form {...propertyForm}>
              <form onSubmit={propertyForm.handleSubmit(onPropertySubmit)} className="space-y-4">
                <FormField
                  control={propertyForm.control}
                  name="prefecture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>都道府県</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-100">
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {prefectures.map((pref) => (
                            <SelectItem key={pref} value={pref}>
                              {pref}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={propertyForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>市区町村</FormLabel>
                      <FormControl>
                        <Input placeholder="例: 広島市中区" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={propertyForm.control}
                  name="town"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>町名</FormLabel>
                      <FormControl>
                        <Input placeholder="例: 胡町" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {["landSize", "frontage", "breadth", "coverageRatio", "floorAreaRatio"].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={propertyForm.control}
                    name={fieldName as keyof PropertyFormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {fieldName === "landSize" && "土地面積（㎡）"}
                          {fieldName === "frontage" && "道路に接している幅（m）"}
                          {fieldName === "breadth" && "奥行き（ｍ）"}
                          {fieldName === "coverageRatio" && "建築面積／敷地面積（％）"}
                          {fieldName === "floorAreaRatio" && "延べ床面積／敷地面積（％）"}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="submit" className="w-full">次へ進む</Button>
              </form>
            </Form>
          )}

          {step === "user" && (
            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                <FormField
                  control={userForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>お名前</FormLabel>
                      <FormControl>
                        <Input placeholder="山田 太郎" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>電話番号</FormLabel>
                      <FormControl>
                        <Input placeholder="090-1234-5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input placeholder="example@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">次へ進む</Button>
              </form>
            </Form>
          )}

          {step === "result" && (
            <div className="space-y-4">
              <Button onClick={handleAIEstimate} className="w-full">AI査定を実行</Button>
              {estimatedPrice > 0 && (
                <>
                  <div className="text-center text-green-600 text-xl font-bold">
                    推定価格: {estimatedPrice.toLocaleString()} 円
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    ※ 本査定価格は過去データに基づく参考価格です。<br />
                    正確な価格は専門担当者よりご案内いたします。
                  </div>
                </>
              )}
              <Button onClick={handleSubmit} className="w-full mt-4">査定結果を保存</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
