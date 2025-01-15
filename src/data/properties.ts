import { Property } from '@/types';

type PropertyType = "فيلا" | "شقة" | "قصر" | "دوبلكس";

// Helper function to generate deterministic prices
const getPrice = (index: number, min: number, max: number) => {
  // Use the index to generate a deterministic value between min and max
  const range = max - min;
  const value = min + (index % (range + 1));
  return value * 100000;
};

// Generate 50 properties
export const properties: Property[] = Array.from({ length: 50 }, (_, i) => {
  const propertyTypes: PropertyType[] = ["فيلا", "شقة", "قصر", "دوبلكس"];
  const cities = ["الرياض", "جدة", "الدمام", "الخبر", "مكة", "المدينة"];
  const districts = ["حي النرجس", "حي الياسمين", "حي الشاطئ", "حي السفارات", "حي الروابي", "حي الروضة", "حي النزهة", "حي الملقا"];
  const commonFeatures = ["غرف", "حمامات", "مطبخ", "صالة", "موقف سيارات"];
  const luxuryFeatures = ["مسبح", "حديقة", "مصعد خاص", "غرفة خادمة", "مجلس رجال", "مجلس نساء", "روف", "شرفة", "نافورة", "غرفة سينما", "صالة رياضة"];
  
  // Use index to determine property type deterministically
  const type = propertyTypes[i % propertyTypes.length];
  const city = cities[Math.floor(i / 8) % cities.length];
  const district = districts[i % districts.length];
  
  // Price ranges based on property type
  const priceRanges: Record<PropertyType, [number, number]> = {
    "فيلا": [2000, 5000],
    "شقة": [500, 2000],
    "قصر": [7000, 15000],
    "دوبلكس": [2500, 4500]
  };

  // Number of rooms based on property type
  const roomRanges: Record<PropertyType, [number, number]> = {
    "فيلا": [4, 7],
    "شقة": [2, 4],
    "قصر": [8, 12],
    "دوبلكس": [4, 6]
  };

  // Use index to determine rooms deterministically
  const rooms = roomRanges[type][0] + (i % (roomRanges[type][1] - roomRanges[type][0] + 1));
  const bathrooms = Math.max(1, rooms - 1);

  // Generate features based on property type
  const features = [
    `${rooms} غرف`,
    `${bathrooms} حمامات`,
    ...commonFeatures.slice(2),
    ...(type === "قصر" || type === "فيلا" ? luxuryFeatures.slice(0, 4) : []),
    ...(type === "دوبلكس" ? luxuryFeatures.slice(4, 7) : []),
    ...(type === "شقة" ? luxuryFeatures.slice(7, 9) : [])
  ];

  // Use different image sets based on property type
  const imagesByType: Record<PropertyType, string[]> = {
    "فيلا": [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea"
    ],
    "شقة": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7"
    ],
    "قصر": [
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7"
    ],
    "دوبلكس": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      "https://images.unsplash.com/photo-1602075432748-82d264e2b463"
    ]
  };

  // Use index to select image deterministically
  const image = imagesByType[type][i % imagesByType[type].length] + "?q=80&w=800";

  return {
    id: i + 1,
    title: `${type} ${rooms} غرف في ${city}`,
    type,
    location: `${city}، ${district}`,
    price: getPrice(i, priceRanges[type][0], priceRanges[type][1]),
    features: Array.from(new Set(features)), // Remove duplicates
    images: [image]
  };
}); 