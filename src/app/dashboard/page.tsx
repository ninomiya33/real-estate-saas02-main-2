'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthProvider";
import { Lead } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { CardCustom } from "@/components/ui/card-custom";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Search, Trash2, FileEdit, Users, LineChart, Home } from "lucide-react";

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [publicList, setPublicList] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'inProgress' | 'completed'>('all');

  useEffect(() => {
    const fetchLeads = async () => {
      if (!user?.id) return;

      // customers テーブル
      const { data: customers, error: error1 } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error1) {
        console.error("❌ customers取得エラー:", error1.message);
      } else {
        const formatted = customers.map((item) => {
          const [prefecture, city, ...rest] = item.address.split(" ");
          const town = rest.join(" ");
          return {
            ...item,
            prefecture,
            city,
            town,
            landSize: item.area,
            estimatedPrice: item.price,
            createdAt: item.created_at,
            status: item.status || 'new',
            id: item.id,
            isBroadcast: false,
          };
        }) as Lead[];
        setLeads(formatted);
      }

      // public_list テーブル
      const { data: publicListData, error: error2 } = await supabase
        .from("public_list")
        .select("*")
        .order("created_at", { ascending: false });

      if (error2) {
        console.error("❌ 公開リスト取得エラー:", error2.message);
      } else {
        const formattedPublic = publicListData.map((item) => {
          const [prefecture, city, ...rest] = item.address.split(" ");
          const town = rest.join(" ");
          return {
            ...item,
            prefecture,
            city,
            town,
            landSize: item.area,
            estimatedPrice: item.price,
            createdAt: item.created_at,
            status: item.status || 'new',
            id: item.id,
            isBroadcast: true,
          };
        }) as Lead[];
        setPublicList(formattedPublic);
      }
    };

    fetchLeads();
  }, [user]);

  const combinedLeads = [...publicList, ...leads];

  const filteredLeads = combinedLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${lead.prefecture} ${lead.city} ${lead.town}`.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (leadId: string, status: Lead['status']) => {
    const target = leads.find(l => l.id === leadId && !l.isBroadcast);
    if (!target) {
      toast.error("公開リストのデータはステータス変更できません");
      return;
    }

    const { error } = await supabase
      .from("customers")
      .update({ status })
      .eq("id", leadId);

    if (error) {
      toast.error("ステータス更新に失敗しました");
    } else {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
      );
      toast.success(`ステータスを${t(`statusOptions.${status}`)}に更新しました`);
    }
  };

  const handleDelete = async (leadId: string) => {
    const target = leads.find(l => l.id === leadId && !l.isBroadcast);
    if (!target) {
      toast.error("公開リストのデータは削除できません");
      return;
    }

    const { error } = await supabase.from("customers").delete().eq("id", leadId);

    if (error) {
      toast.error("削除に失敗しました");
    } else {
      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
      toast.success("見込み客を削除しました");
    }
  };

  const newLeads = combinedLeads.filter((lead) => lead.status === 'new').length;
  const inProgressLeads = combinedLeads.filter((lead) => lead.status === 'inProgress').length;
  const completedLeads = combinedLeads.filter((lead) => lead.status === 'completed').length;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-2">{t('dashboard')}</h1>
      <p className="text-muted-foreground mb-8">{t('leadManagement')}</p>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card><CardHeader className="flex justify-between"><CardTitle className="text-sm">{t('statusOptions.new')}</CardTitle><Users className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{newLeads}</div></CardContent></Card>
        <Card><CardHeader className="flex justify-between"><CardTitle className="text-sm">{t('statusOptions.inProgress')}</CardTitle><LineChart className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{inProgressLeads}</div></CardContent></Card>
        <Card><CardHeader className="flex justify-between"><CardTitle className="text-sm">{t('statusOptions.completed')}</CardTitle><Home className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{completedLeads}</div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">{t('leads')}</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder={t('searchLeads')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder={t('filterStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('statusOptions.all')}</SelectItem>
              <SelectItem value="new">{t('statusOptions.new')}</SelectItem>
              <SelectItem value="inProgress">{t('statusOptions.inProgress')}</SelectItem>
              <SelectItem value="completed">{t('statusOptions.completed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <CardCustom key={lead.id} status={lead.status} className="overflow-hidden">
              <div className="p-6 sm:flex justify-between gap-4">
                <div className="space-y-2 mb-4 sm:mb-0">
                  <h3 className="font-medium">{lead.name}</h3>
                  <p className="text-sm text-muted-foreground">{lead.prefecture} {lead.city} {lead.town}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div><span className="text-muted-foreground mr-1">{t('area')}:</span>{lead.landSize}㎡</div>
                    <div><span className="text-muted-foreground mr-1">{t('price')}:</span>{lead.estimatedPrice.toLocaleString()} 円</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="flex flex-col sm:items-end gap-4">
                  <StatusBadge status={lead.status} />
                  <div className="flex items-center mt-4 sm:mt-auto gap-2">
                    <Select value={lead.status} onValueChange={(value: any) => handleStatusChange(lead.id, value)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">{t('statusOptions.new')}</SelectItem>
                        <SelectItem value="inProgress">{t('statusOptions.inProgress')}</SelectItem>
                        <SelectItem value="completed">{t('statusOptions.completed')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon"><FileEdit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="gap-2"><Trash2 className="h-4 w-4" /> 顧客を削除</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                          <AlertDialogDescription>{lead.name} の情報を削除します。この操作は元に戻せません。</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>キャンセル</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(lead.id)} className="bg-destructive text-white hover:bg-destructive/90">削除する</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardCustom>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">{t('noLeads')}</div>
        )}
      </div>
    </div>
  );
}
