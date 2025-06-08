'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, EstimateFormData } from '@/types';
import { PRICE_PER_SQUARE_METER } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';

type LeadsContextType = {
  leads: Lead[];
  addLead: (data: EstimateFormData) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  deleteLead: (id: string) => void;
  calculateEstimate: (prefecture: string, landSize: number) => number;
};

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { user } = useAuth();

  // ✅ Supabaseから最新のリードを取得
  const fetchLeadsFromSupabase = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.id); // 自分のデータのみ取得

    if (error) {
      console.error("❌ Supabase fetch error:", error.message);
      return;
    }

    const formattedLeads: Lead[] = data.map((item: any) => {
      const [prefecture, city, ...rest] = (item.address ?? "").split(" ");
      const town = rest.join(" ");
      return {
        id: item.id, // ✅ UUIDは文字列のまま
        name: item.name,
        phone: item.phone || "",
        email: item.email || "",
        prefecture: prefecture || "",
        city: city || "",
        town: town || "",
        landSize: item.area ?? 0,
        estimatedPrice: item.price ?? 0,
        status: mapStatus(item.status),
        createdAt: item.created_at || new Date().toISOString(),
      };
    });

    setLeads(formattedLeads);
  };

  useEffect(() => {
    fetchLeadsFromSupabase();
  }, [user]);

  const mapStatus = (status: string | null): Lead['status'] => {
    switch (status) {
      case "見積済": return "new";
      case "対応中": return "inProgress";
      case "完了": return "completed";
      default: return "new";
    }
  };

  const calculateEstimate = (prefecture: string, landSize: number) => {
    const unit = PRICE_PER_SQUARE_METER[prefecture] || 100000;
    return Math.round(unit * landSize);
  };

  const addLead = (data: EstimateFormData) => {
    const estimatedPrice = calculateEstimate(data.prefecture, data.landSize);
    const newLead: Lead = {
      id: crypto.randomUUID(), // 仮にローカル追加時に必要ならUUID生成（保存は別でSupabaseが担当）
      ...data,
      estimatedPrice,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status } : lead));
  };

  // ✅ Supabase + UI 両方から削除
  const deleteLead = async (id: string) => {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) {
      console.error("❌ Supabase delete error:", error.message);
      return;
    }

    // UIからも即時削除
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  return (
    <LeadsContext.Provider
      value={{
        leads,
        addLead,
        updateLeadStatus,
        deleteLead,
        calculateEstimate,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};
