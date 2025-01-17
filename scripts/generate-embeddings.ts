import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Import after environment variables are loaded
import { processProperties } from '../src/data/generateEmbeddings';

// Parse command line arguments
const args = process.argv.slice(2);
const forceRegenerate = args.includes('--force');

// Run the script with appropriate options
processProperties(forceRegenerate).catch(console.error); 