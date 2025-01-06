import express from 'express';
import dotenv from 'dotenv';
import { info, error, debug } from './utils/logger.js'

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
info("de app werkt")
})