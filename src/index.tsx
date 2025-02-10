import { Hono } from 'hono'

const app = new Hono()

import App from './App'
app.route('/', App)
//console.log(app.routes)

export default app