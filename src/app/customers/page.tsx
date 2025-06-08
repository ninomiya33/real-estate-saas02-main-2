"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Customer = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  area: number;
  price: number;
  status: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching customers:", error.message);
      } else {
        setCustomers(data || []);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">顧客一覧</h1>
      <div className="grid gap-4">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardHeader>
              <CardTitle>{customer.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-1">
              <div>📧 {customer.email}</div>
              <div>📞 {customer.phone}</div>
              <div>🏠 {customer.address}</div>
              <div>📐 {customer.area} ㎡</div>
              <div>💰 {customer.price.toLocaleString()} 円</div>
              <div>📌 ステータス：{customer.status}</div>
              <div>🕒 登録日：{new Date(customer.created_at).toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
