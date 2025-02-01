/**
 * generateProperties-en.js
 * =====================
 * Purpose: Generate a JSON file with 200 sample property objects for New York.
 *          The file will be named "properties-en.json".
 *          Each property object has the following structure:
 *            - id: string (unique identifier)
 *            - title: string (e.g., "Apartment in Manhattan")
 *            - type: string ("Apartment", "Villa", "Mansion", or "Duplex")
 *            - city: string ("New York")
 *            - district: string (a New York borough or neighborhood)
 *            - price: number (sample price in USD)
 *            - features: array of strings (e.g., "2 bedrooms", "1 bathroom", "Kitchen", "Living Room", "Parking")
 *            - images: array of strings (sample image URLs, similar to those in the Arabic properties file)
 *            - description: string (a generated description summarizing the property)
 *
 * How to run:
 * 1. Ensure Node.js is installed on your system.
 * 2. Save this script as "generateProperties-en.js" in your project's root directory.
 * 3. Run the script using the command: `node generateProperties-en.js`
 * 4. The file "properties-en.json" will be generated in the same directory.
 */

const fs = require('fs');

// Define the property types for USA data.
const types = ["Apartment", "Villa", "Mansion", "Duplex"];

// Define a list of possible New York districts/neighborhoods.
const districts = [
  "Manhattan",
  "Brooklyn",
  "Queens",
  "Bronx",
  "Staten Island",
  "Harlem",
  "Chelsea",
  "SoHo",
  "Upper East Side",
  "Upper West Side",
  "Midtown"
];

const city = "New York";

// Utility function to generate a price based on property type and id.
// These ranges are arbitrary and serve as sample data.
function getPrice(id, type) {
  if (type === "Apartment") {
    return 200000 + ((id * 12345) % 600000);  // Price range roughly 200K - 800K USD.
  } else if (type === "Villa") {
    return 1500000 + ((id * 23456) % 1500000); // Price range roughly 1.5M - 3M USD.
  } else if (type === "Mansion") {
    return 3000000 + ((id * 34567) % 5000000); // Price range roughly 3M - 8M USD.
  } else if (type === "Duplex") {
    return 500000 + ((id * 45678) % 1000000);  // Price range roughly 500K - 1.5M USD.
  }
}

// Utility function to determine the number of bedrooms based on property type and id.
function getBedrooms(id, type) {
  if (type === "Apartment") {
    return 1 + (id % 3); // 1-3 bedrooms.
  } else if (type === "Villa") {
    return 3 + (id % 3); // 3-5 bedrooms.
  } else if (type === "Mansion") {
    return 5 + (id % 4); // 5-8 bedrooms.
  } else if (type === "Duplex") {
    return 2 + (id % 3); // 2-4 bedrooms.
  }
}

// Utility function to determine the number of bathrooms based on property type and id.
function getBathrooms(id, type) {
  if (type === "Apartment") {
    return 1 + (id % 2); // 1-2 bathrooms.
  } else if (type === "Villa") {
    return 2 + (id % 2); // 2-3 bathrooms.
  } else if (type === "Mansion") {
    return 3 + (id % 2); // 3-4 bathrooms.
  } else if (type === "Duplex") {
    return 1 + (id % 2); // 1-2 bathrooms.
  }
}

// Generate an array of 200 sample property objects.
const properties = [];
for (let i = 1; i <= 200; i++) {
  const type = types[(i - 1) % types.length];
  const district = districts[(i - 1) % districts.length];
  const price = getPrice(i, type);
  const bedrooms = getBedrooms(i, type);
  const bathrooms = getBathrooms(i, type);
  
  // Define the features. For consistency, we use unified attributes.
  const features = [
    `${bedrooms} bedrooms`,
    `${bathrooms} bathrooms`,
    "Kitchen",
    "Living Room",
    "Parking"
  ];
  
  // For Apartments and Duplexes, add "Balcony" on even-indexed properties.
  if ((i % 2) === 0 && (type === "Apartment" || type === "Duplex")) {
    features.push("Balcony");
  }
  
  const title = `${type} in ${district}`;
  const description = `${type} with ${bedrooms} bedrooms, ${bathrooms} bathrooms, a modern kitchen and a spacious living room, located in ${district}, New York.`;
  
  properties.push({
    id: i.toString(),
    title,
    type,
    city,
    district,
    price,
    features,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800"
    ],
    description
  });
}

// Write the generated properties array to "properties-en.json".
fs.writeFileSync("properties-en.json", JSON.stringify(properties, null, 2), "utf8");
console.log("Generated properties-en.json with 200 sample New York properties.");
