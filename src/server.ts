import * as express from 'express'
import * as bodyParser from 'body-parser'
import { graphql } from 'graphql'
import { getSchema } from './store'

export const server = express()

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(require('cors')())

server.post('/graphql', (req, res) => {
  graphql(getSchema(), req.body.query, undefined, undefined, req.body.variables)
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      res.status(422).send(err)
    })
})

server.get('/ok', (_req, res) => {
  res.send({ data: 'ok' })
})
