import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { generateEmbedding } from "./lib/ai/embedding";
import { db } from "./lib/db";
import { embeddings } from "./lib/db/schema/embeddings";
import { findRelevantContent } from '@/lib/ai/embedding';

const question = "what are the educational instituions mentioned in the document";

const userQueryEmbedded = await generateEmbedding(question);

const similarity = sql<number>`1 - (${cosineDistance(
  embeddings.embedding,
  userQueryEmbedded
)})`;

const similarGuides = await db
  .select({ name: embeddings.content, similarity })
  .from(embeddings)
  .where(gt(similarity, 0.3))
  .orderBy((t) => desc(t.similarity))
  .limit(10);

console.log(similarGuides);

process.exit(0);
