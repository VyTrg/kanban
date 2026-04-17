import { beforeAll, afterAll, afterEach } from 'vitest';

// Set test environment variables before any imports
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://admin:admin@localhost:5433/kanban_db';

beforeAll(async () => {
  // Setup test database
});

afterEach(async () => {
  // Clean up test data after each test
});

afterAll(async () => {
  // Close database connections
});
