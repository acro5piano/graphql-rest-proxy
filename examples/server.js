const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('cors')())

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.body, undefined, 2)}`)
  next()
})

const userMock = {
  id: 1,
  name: 'Kazuya',
  isActive: true,
}

const postMock = {
  id: 1,
  title: 'A post',
}

app.get('/users/:id', (_req, res) => {
  res.send(userMock)
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

app.patch('/users/:id', (_req, res) => {
  res.send(userMock)
})

app.listen(5620)
