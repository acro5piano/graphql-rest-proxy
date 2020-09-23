const express = require('express')
const faker = require('faker')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('cors')())

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.body, undefined, 2)}`)
  next()
})

const userMock = (id) => ({
  id,
  name: faker.name.firstName(),
  isActive: true,
})

const postMock = (id) => ({
  id,
  title: faker.lorem.words(),
})

app.get('/users/:id', (_req, res) => {
  res.send(userMock(1))
})

app.get('/users', (_req, res) => {
  res.send([userMock(1), userMock(2)])
})

app.get('/users/:id/posts', (_req, res) => {
  res.send([postMock(1), postMock(2)])
})

app.post('/users', (_req, res) => {
  res.send(userMock(1))
})

app.patch('/users/:id', (_req, res) => {
  res.send(userMock(1))
})

app.listen(5620)
