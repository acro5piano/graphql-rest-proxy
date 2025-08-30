import express from 'express'
import { graphql } from 'graphql'
import { ruruHTML } from 'ruru/server';
import { getSchema, getConfig } from './store'

export const server = express()

server.use(express.json())
server.use(require('cors')())

server.post('/graphql', (req, res) => {
  graphql({
    schema: getSchema(),
    source: req.body.query,
    rootValue: {},
    contextValue: { req, res },
    variableValues: req.body.variables,
  })
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      res.status(422).send(err)
    })
})

server.get('/', (_req, res) => {
  if (getConfig().graphiql) {
    res.type('html');
    res.end(ruruHTML({ endpoint: '/graphql' }));
  } else {
    res.status(404).send({ error: 'Cannot GET /' });
  }
});

server.get('/ok', (_req, res) => {
  res.send({ data: 'ok' })
})

export async function runserver() {
  const port = process.env.PORT || getConfig().port || 5252
  server.listen(port, () => {
    console.log(`graphql-rest-proxy is running on http://localhost:${port}/graphql`)
  })
}
