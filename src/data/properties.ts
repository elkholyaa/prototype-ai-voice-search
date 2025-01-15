import { Property } from '@/types';

export const properties: Property[] = [
  {
    id: 1,
    title: "فيلا فاخرة مع حديقة",
    type: "فيلا",
    location: "الرياض، حي النرجس",
    price: 2500000,
    features: ["5 غرف", "6 حمامات", "حديقة", "مسبح", "موقف سيارات"],
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800"]
  },
  {
    id: 2,
    title: "شقة حديثة وسط المدينة",
    type: "شقة",
    location: "جدة، حي الشاطئ",
    price: 900000,
    features: ["3 غرف", "2 حمامات", "شرفة", "موقف سيارات"],
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800"]
  },
  {
    id: 3,
    title: "قصر فخم مع إطلالة",
    type: "قصر",
    location: "الدمام، حي الشاطئ",
    price: 7500000,
    features: ["8 غرف", "10 حمامات", "حديقة", "مسبح", "موقف سيارات", "غرفة سينما"],
    images: ["https://images.unsplash.com/photo-1505843513577-22bb7d21e455?q=80&w=800"]
  }
]; 