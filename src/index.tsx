import { Hono } from 'hono'

const app = new Hono()

import App from './App'
app.route('/', App)

export default app