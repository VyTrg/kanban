import "dotenv/config";
import { pool, db } from "../config/database";

async function testPool() {
  try {
    console.log("⏳ Testing database pool...");
    
    // 1. Try to get a client from the pool
    const client = await pool.connect();
    console.log("✅ Successfully connected to the pool!");
    
    // 2. Perform a simple query using the pool client
    const res = await client.query('SELECT NOW()');
    console.log("🕒 Database time:", res.rows[0].now);
    
    client.release();
    console.log("✅ Client released back to the pool.");

    // 3. Test drizzle query
    console.log("🧪 Testing Drizzle query...");
    const result = await db.execute("SELECT 1 as connected");
    console.log("✅ Drizzle query successful!");
    
    // 4. Check pool stats
    console.log("📊 Pool Statistics:");
    console.log(`- Total clients: ${pool.totalCount}`);
    console.log(`- Idle clients: ${pool.idleCount}`);
    console.log(`- Waiting clients: ${pool.waitingCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Database test failed:");
    console.error(error);
    process.exit(1);
  }
}

testPool();
