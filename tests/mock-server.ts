import express from 'express'
import bodyParser from 'body-parser'

export const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('cors')())

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.body, undefined, 2)}`)
  next()
})

let userMock = (id: unknown = 1) => ({
  id,
  name: 'Kazuya',
  isActive: true,
})

const postMock = {
  id: 1,
  title: 'A post',
}

app.get('/user', (_req, res) => {
  res.send(userMock())
})

app.get('/users/:id', (_req, res) => {
  res.send(userMock(_req.params.id))
})

app.get('/user_with_posts', (_req, res) => {
  res.send({ ...userMock(), posts: [postMock] })
})

app.get('/users', (_req, res) => {
  res.send([userMock(), userMock()])
})

app.get('/users/:id/posts', (_req, res) => {
  res.send([postMock, postMock])
})

app.post('/users', (_req, res) => {
  res.send(userMock())
})

app.patch('/users/:id', (_req, res) => {
  res.send(userMock(_req.params.id))
})

app.put('/users/:id', (_req, res) => {
  res.send(userMock(_req.params.id))
})

let server: any

export function start(port = 5620) {
  server = app.listen(port, () => {})
  console.log(`Listeing on http://localhost:${port}`)
  console.log(`  - http://localhost:${port}/user`)
  console.log(`  - http://localhost:${port}/users/1`)
  console.log(`  - http://localhost:${port}/users/1/posts`)
  console.log(`  - http://localhost:${port}/user_with_posts`)
}

export function terminate() {
  return server.close()
}
