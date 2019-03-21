import express from 'express'
import bodyParser from 'body-parser'

export const server = express()

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(require('cors')())

server.get('/ok', (_req, res) => {
  res.send({ data: 'ok' })
})
