import request from 'supertest'
import { server } from '../src'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'
import { setConfig } from '../src'
import getPort from 'get-port'
import test from 'ava'

test.before(async () => {
  const port = await getPort()
  setConfig({
    baseUrl: `http://localhost:${port}`,
    graphiql: true,
  })
  await prepareTestWithSchema(
    gql`
      type User {
        id: Int
        name: String
      }

      type Query {
        getUser: User @proxy(get: "/user")
      }
    `,
    port,
  )
})

test.after(terminate)

test.serial('has graphiql endpoint', async (t) => {
  let res = await request(server)
    .get('/')
    .set('Accept', 'text/html')
    .send()
    .expect(200)
  t.truthy(res.text.includes('graphiql'))
})

test.serial('graphiql endpoint returns 404 if disabled', async (t) => {
  setConfig({
    graphiql: false,
  })
  let res = await request(server)
    .get('/')
    .set('Accept', 'text/html')
    .send()
    .expect(404)
  t.truthy(res.text.includes('Cannot GET /'))
})
