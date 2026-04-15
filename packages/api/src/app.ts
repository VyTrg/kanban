import { Hono } from 'hono';
import { logger } from 'hono/logger';
import workspaceRoutes from './routes/v1/workspaces';

const app = new Hono();

// Middleware
app.use('*', logger());

// Root route
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Kanban API is running',
    version: 'v1'
  });
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// V1 Routes
app.route('/v1/workspaces', workspaceRoutes);

export default app;
