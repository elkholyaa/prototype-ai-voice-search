import { searchProperties } from './src/utils/propertySearch';
import { properties } from './src/data/properties';

const query = "البحث عن فيلا في الرياض مع مسبح و مصعد خاص حي الروابي";
const results = searchProperties(properties, query, true);

console.log("\nSearch Query:", query);
console.log("\nFound Properties:", results.length);
console.log("\nResults:");
results.forEach((p, i) => {
  console.log(`\n${i + 1}. Property Details:`);
  console.log(`   Type: ${p.type}`);
  console.log(`   Location: ${p.location}`);
  console.log(`   Features: ${p.features.join(", ")}`);
  console.log(`   Price: ${p.price}`);
}); 