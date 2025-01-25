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
  const districts = ["النرجس", "الياسمين", "الملقا", "الورود"];
  // Prioritize Riyadh (75% chance)
  const city = Math.random() < 0.75 ? "الرياض" : cities[i % cities.length];
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
  const baseFeatures = ["صالة", "مطبخ", "موقف سيارات"];

  // Luxury features by type
  const luxuryFeatures = {
    "فيلا": ["مسبح خاص", "حديقة", "مجلس رجال", "مجلس نساء"],
    "شقة": ["تكييف مركزي", "مخزن"],
    "قصر": ["مسبح خاص", "حديقة", "مجلس رجال", "مجلس نساء", "غرفة سينما"],
    "دوبلكس": ["حديقة", "مدخل خاص"]
  };

  // Add luxury features based on type and district
  let selectedFeatures = [];
  if (type === "فيلا" && (district === "النرجس" || district === "الياسمين") && city === "الرياض") {
    // Ensure villas in Al-Narjis or Al-Yasmin have both pool and majlis
    selectedFeatures = ["مسبح خاص", "مجلس رجال", "مجلس نساء"];
    if (Math.random() < 0.7) selectedFeatures.push("حديقة");
  } else {
    const luxuryCount = type === "قصر" ? 4 : type === "شقة" ? 1 : 2;
    selectedFeatures = getRandomItems(luxuryFeatures[type], i, luxuryCount);
  }

  const features = [
    `${rooms} غرف`,
    `${bathrooms} حمامات`,
    ...baseFeatures,
    ...selectedFeatures
  ];

  // Price ranges in SAR
  const priceRanges = {
    "فيلا": [2500000, 4000000],     // 2.5M to 4M SAR
    "شقة": [750000, 1500000],       // 750K to 1.5M SAR
    "قصر": [6000000, 8000000],      // 6M to 8M SAR
    "دوبلكس": [1800000, 3000000]    // 1.8M to 3M SAR
  };
  const [minPrice, maxPrice] = priceRanges[type];
  const price = Math.floor(minPrice + (Math.random() * (maxPrice - minPrice)));

  // Property images
  const images = {
    "فيلا": [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    ],
    "شقة": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
    ],
    "قصر": [
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
    ],
    "دوبلكس": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
    ]
  };

  // Generate title and description
  const title = `${type} - حي ${district}`;
  const description = `${type} ${features.join('، ')} في ${city} - حي ${district}`;

  return {
    id: i + 1,
    title,
    type,
    city,
    district,
    price,
    features: Array.from(new Set(features)),
    images: images[type].map(url => `${url}?q=80&w=800`),
    description
  };
});

// Write the generated data to a JSON file
const outputPath = path.join(__dirname, 'static', 'properties.json');
fs.writeFileSync(outputPath, JSON.stringify(properties, null, 2), 'utf8');
console.log(`Generated ${properties.length} properties and saved to ${outputPath}`); 