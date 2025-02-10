import { Hono } from 'hono'

const app = new Hono()

import App from './App'
app.route('/', App)
import { logger } from 'hono/logger'
app.use(logger())
console.log(app.routes)

export default app