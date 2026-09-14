import dns from "dns";
import { MongoClient, Db, MongoClientOptions } from "mongodb";

// Ensure DNS SRV lookups work reliably across all ISPs and cloud environments
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignored if permissions restrict setting DNS servers
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const mongoOptions: MongoClientOptions = {
  maxPoolSize: 10, // Optimized for MongoDB Atlas Free Tier (M0) to prevent connection saturation
  minPoolSize: 0,  // Allows idle connections to close cleanly in serverless lambdas
  serverSelectionTimeoutMS: 5000, // Fail quickly (5s) if cluster is unreachable
  connectTimeoutMS: 8000,
  socketTimeoutMS: 20000,
};

function getClientPromise(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, mongoOptions);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production / serverless, reuse client across lambda warm invocations
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, mongoOptions);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }
}

export async function getDatabase(): Promise<Db | null> {
  const clientPromise = getClientPromise();
  if (!clientPromise) {
    return null;
  }
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "vajra_fitness";
    return client.db(dbName);
  } catch (err) {
    console.error("MongoDB Atlas connection error:", err);
    return null;
  }
}

export default getClientPromise;

