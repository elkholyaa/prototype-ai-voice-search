import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Property types and helper functions
const PropertyType = ["فيلا", "شقة", "قصر", "دوبلكس"];

const getRandomItems = (items, index, count) => {
  return [...items]
    .sort(() => Math.sin(index) - 0.5)
    .slice(0, count);
};

// Generate 150 properties
const properties = Array.from({ length: 150 }, (_, i) => {
  // Property type distribution (villa and apartment more common)
  const types = ["فيلا", "شقة", "فيلا", "شقة", "قصر", "دوبلكس"];
  const type = types[i % types.length];

  // Simple city and district selection
  const cities = ["الرياض", "جدة", "الدمام", "مكة"];
  const districts = ["حي النرجس", "حي الياسمين", "حي الملقا", "حي الورود"];
  const city = cities[i % cities.length];
  const district = districts[(i * 2) % districts.length];

  // Room counts by type
  const roomCounts = {
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
  const luxuryFeatures = {
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
  const priceRanges = {
    "فيلا": [2000, 5000],
    "شقة": [500, 2000],
    "قصر": [8000, 15000],
    "دوبلكس": [2000, 4000]
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

  // Generate description
  const description = `${type} ${features.join('، ')} في ${city}، ${district}`;

  return {
    id: i + 1,
    title: `${type} ${rooms} غرف في ${city}`,
    type,
    location: `${city}، ${district}`,
    price,
    features: Array.from(new Set(features)),
    images: [`${images[type]}?q=80&w=800`],
    description
  };
});

// Write the generated data to a JSON file
const outputPath = path.join(__dirname, 'static', 'properties.json');
fs.writeFileSync(outputPath, JSON.stringify(properties, null, 2), 'utf8');
console.log(`Generated ${properties.length} properties and saved to ${outputPath}`); 