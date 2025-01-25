import fs from 'fs';
import path from 'path';
import { Property } from '@/types';
import { generatePropertyDescription } from '@/utils/format';

type PropertyType = "فيلا" | "شقة" | "قصر" | "دوبلكس";

// Helper function to get deterministic random items
const getRandomItems = (items: string[], index: number, count: number): string[] => {
  return [...items]
    .sort(() => Math.sin(index) - 0.5)
    .slice(0, count);
};

// Generate 150 properties
const properties: Property[] = Array.from({ length: 150 }, (_, i) => {
  // Property type distribution (villa and apartment more common)
  const types: PropertyType[] = ["فيلا", "شقة", "فيلا", "شقة", "قصر", "دوبلكس"];
  const type = types[i % types.length];

  // Simple city and district selection
  const cities = ["الرياض", "جدة", "الدمام", "مكة"];
  const districts = ["النرجس", "الياسمين", "الملقا", "الورود"];
  const city = cities[i % cities.length];
  const district = districts[(i * 2) % districts.length];

  // Room counts by type
  const roomCounts: Record<PropertyType, number[]> = {
    "فيلا": [4, 5, 6],
    "شقة": [2, 3, 4],
    "قصر": [8, 10, 12],
    "دوبلكس": [4, 5, 6]
  };
  const rooms = roomCounts[type][i % 3];
  const bathrooms = Math.max(2, Math.floor(rooms * 0.7));

  // Base features for all properties
  const baseFeatures = ["مطبخ", "صالة", "موقف سيارات"];

  // Luxury features by type
  const luxuryFeatures: Record<PropertyType, string[]> = {
    "فيلا": ["مسبح", "حديقة", "غرفة خادمة", "مجلس"],
    "شقة": ["شرفة", "مخزن", "تكييف مركزي"],
    "قصر": ["مسبح", "حديقة كبيرة", "مجلس رجال", "مجلس نساء", "غرفة سينما"],
    "دوبلكس": ["شرفة", "حديقة صغيرة", "مدخل خاص"]
  };

  // Add 1-3 luxury features based on type
  const luxuryCount = type === "قصر" ? 3 : type === "شقة" ? 1 : 2;
  const features = [
    `${rooms} غرف`,
    `${bathrooms} حمامات`,
    ...baseFeatures,
    ...getRandomItems(luxuryFeatures[type], i, luxuryCount)
  ];

  // Price ranges (in thousands)
  const priceRanges: Record<PropertyType, [number, number]> = {
    "فيلا": [2500000, 4000000],     // 2.5M to 4M SAR
    "شقة": [750000, 1500000],       // 750K to 1.5M SAR
    "قصر": [6000000, 8000000],      // 6M to 8M SAR
    "دوبلكس": [1800000, 3000000]    // 1.8M to 3M SAR
  };
  const [minPrice, maxPrice] = priceRanges[type];
  const price = minPrice + (i % (maxPrice - minPrice)) * 1000;

  // Property images
  const images = {
    "فيلا": "https://images.unsplash.com/photo-1613977257363-707ba9348227",
    "شقة": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
    "قصر": "https://images.unsplash.com/photo-1505843513577-22bb7d21e455",
    "دوبلكس": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
  };

  // Generate a property object that matches our Property interface
  return {
    id: String(i + 1), // Convert to string to match the interface
    title: `${type} ${rooms} غرف في ${city}`,
    type,
    city,
    district,
    price,
    features: Array.from(new Set(features)),
    images: [`${images[type]}?q=80&w=800`],
    description: generatePropertyDescription({
      type,
      city,
      district,
      features: Array.from(new Set(features))
    })
  };
});

// Write the properties to a JSON file
const outputDir = path.join(process.cwd(), 'src', 'data', 'static');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'properties.json'),
  JSON.stringify(properties, null, 2)
);

console.log('Generated properties data successfully!');