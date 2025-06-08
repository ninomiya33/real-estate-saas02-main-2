// src/types/index.ts

export type Language = "ja" | "en";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  prefecture: string;
  city: string;
  town: string;
  landSize: number;
  estimatedPrice: number;
  status: "new" | "inProgress" | "completed";
  createdAt: string; // Supabaseのcreated_atはISO文字列なのでstringでOK
  isBroadcast?: boolean;

};

export type EstimateFormData = {
  name: string;
  phone: string;
  email: string;
  prefecture: string;
  city: string;
  town: string;
  landSize: number;
};
