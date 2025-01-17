import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { Property, PropertyWithEmbedding } from '@/types';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface EmbeddingMetadata {
  lastProcessedId: number;
  lastUpdateTimestamp: string;
  totalProcessed: number;
}

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

function getDataPaths() {
  const staticDir = path.join(process.cwd(), 'src', 'data', 'static');
  return {
    propertiesPath: path.join(staticDir, 'properties.json'),
    embeddingsPath: path.join(staticDir, 'properties-with-embeddings.json'),
    embeddingsBinaryPath: path.join(staticDir, 'embeddings.bin'),
    metadataPath: path.join(staticDir, 'embedding-metadata.json'),
    staticDir
  };
}

function saveEmbeddingsAsBinary(embeddings: number[][]): Buffer {
  // Create a buffer to store all embeddings
  const buffer = Buffer.alloc(embeddings.length * embeddings[0].length * Float32Array.BYTES_PER_ELEMENT);
  
  // Write each embedding to the buffer
  embeddings.forEach((embedding, index) => {
    const view = new Float32Array(embedding);
    buffer.set(new Uint8Array(view.buffer), index * embedding.length * Float32Array.BYTES_PER_ELEMENT);
  });
  
  return buffer;
}

async function processProperties(forceRegenerate: boolean = false) {
  const { propertiesPath, embeddingsPath, embeddingsBinaryPath, metadataPath, staticDir } = getDataPaths();

  // Read the existing properties
  const properties: Property[] = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));

  // Read existing embeddings and metadata if they exist
  let existingEmbeddings: PropertyWithEmbedding[] = [];
  let metadata: EmbeddingMetadata = {
    lastProcessedId: 0,
    lastUpdateTimestamp: '',
    totalProcessed: 0
  };

  try {
    if (fs.existsSync(embeddingsPath) && !forceRegenerate) {
      existingEmbeddings = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));
    }
    if (fs.existsSync(metadataPath)) {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    }
  } catch (error) {
    console.warn('No existing embeddings or metadata found, starting fresh');
  }

  // Find properties that need processing
  const newProperties = forceRegenerate 
    ? properties 
    : properties.filter(p => !existingEmbeddings.some(e => e.id === p.id));

  if (newProperties.length === 0) {
    console.log('No new properties to process');
    return;
  }

  console.log(`Processing ${newProperties.length} properties...`);
  console.log('This will generate approximately:');
  console.log(`- ${(newProperties.length * 6).toFixed(1)} KB of embedding data`);
  console.log(`- Cost less than $${(newProperties.length * 0.00001).toFixed(4)} USD\n`);

  // Process properties in batches to avoid rate limits
  const batchSize = 10;
  const newEmbeddings: PropertyWithEmbedding[] = [];

  for (let i = 0; i < newProperties.length; i += batchSize) {
    const batch = newProperties.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(newProperties.length / batchSize)}...`);

    // Process each property in the batch concurrently
    const batchResults = await Promise.all(
      batch.map(async (property) => {
        const embedding = await generateEmbedding(property.description);
        return {
          ...property,
          embedding
        };
      })
    );

    newEmbeddings.push(...batchResults);

    // Add a small delay between batches to respect rate limits
    if (i + batchSize < newProperties.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Combine with existing embeddings (if not regenerating all)
  const finalEmbeddings = forceRegenerate 
    ? newEmbeddings 
    : [...existingEmbeddings, ...newEmbeddings];

  // Update metadata
  metadata = {
    lastProcessedId: Math.max(...finalEmbeddings.map(p => p.id)),
    lastUpdateTimestamp: new Date().toISOString(),
    totalProcessed: finalEmbeddings.length
  };

  // Save the results
  fs.writeFileSync(embeddingsPath, JSON.stringify(finalEmbeddings, null, 2), 'utf8');
  
  // Save embeddings in binary format
  const embeddingsArray = finalEmbeddings.map(p => p.embedding);
  const binaryData = saveEmbeddingsAsBinary(embeddingsArray);
  fs.writeFileSync(embeddingsBinaryPath, binaryData);
  
  fs.writeFileSync(metadataPath, JSON.stringify({
    ...metadata,
    binaryFormat: {
      dimensions: finalEmbeddings[0].embedding.length,
      count: finalEmbeddings.length,
      bytesPerFloat: Float32Array.BYTES_PER_ELEMENT
    }
  }, null, 2), 'utf8');

  console.log(`\nGenerated embeddings for ${newEmbeddings.length} properties`);
  console.log(`Total properties with embeddings: ${finalEmbeddings.length}`);
  console.log(`Last update: ${metadata.lastUpdateTimestamp}`);
  console.log(`Files saved to: ${path.relative(process.cwd(), staticDir)}/`);
  console.log(`Binary size: ${(binaryData.length / 1024).toFixed(1)}KB`);
}

export { processProperties }; 