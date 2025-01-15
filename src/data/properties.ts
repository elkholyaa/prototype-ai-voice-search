import { Property } from '@/types';

export const properties: Property[] = [
  {
    id: 1,
    title: "فيلا فاخرة مع حديقة",
    type: "فيلا",
    location: "الرياض، حي النرجس",
    price: 2500000,
    features: ["5 غرف", "6 حمامات", "حديقة", "مسبح", "موقف سيارات"],
    images: ["/properties/villa1.jpg"]
  },
  {
    id: 2,
    title: "شقة حديثة وسط المدينة",
    type: "شقة",
    location: "جدة، حي الشاطئ",
    price: 900000,
    features: ["3 غرف", "2 حمامات", "شرفة", "موقف سيارات"],
    images: ["/properties/apartment1.jpg"]
  },
  {
    id: 3,
    title: "قصر فخم مع إطلالة",
    type: "قصر",
    location: "الدمام، حي الشاطئ",
    price: 7500000,
    features: ["8 غرف", "10 حمامات", "حديقة", "مسبح", "موقف سيارات", "غرفة سينما"],
    images: ["/properties/palace1.jpg"]
  }
]; 