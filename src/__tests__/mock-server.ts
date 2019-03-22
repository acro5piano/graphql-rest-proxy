import express from 'express'
import bodyParser from 'body-parser'

export const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('cors')())

app.use((req, _res, next) => {
  console.log(req.body)
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.body, undefined, 2)}`)
  next()
})

const userMock = {
  id: 1,
  name: 'Kazuya',
}

const postMock = {
  id: 1,
  title: 'A post',
}

app.get('/user', (_req, res) => {
  res.send(userMock)
})

app.get('/user_with_posts', (_req, res) => {
  res.send({ ...userMock, posts: [postMock] })
})

app.get('/users', (_req, res) => {
  res.send([userMock, userMock])
})

app.get('/users/:id/posts', (_req, res) => {
  res.send([postMock, postMock])
})

app.post('/users', (_req, res) => {
  res.send(userMock)
})

let server: any

export function start(port = 5620) {
  server = app.listen(port, () => {})
}

export function terminate() {
  return server.close()
}
