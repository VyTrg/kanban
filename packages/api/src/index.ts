import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./app";
import { pool } from "./config/database";

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

console.log(`🚀 Server is running on port http://localhost:${port}`);

// Optional: check pool status on startup
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

serve({
  fetch: app.fetch,
  port,
});
