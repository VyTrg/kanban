import { serve } from '@hono/node-server'
import app from './app'
import 'dotenv/config'

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001

console.log(`🚀 Server is running on port http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
