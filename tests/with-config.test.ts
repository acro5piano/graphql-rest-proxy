import request from 'supertest'
import { server } from '../src'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'
import { setConfig } from '../src'
import { getPort } from './test-utils'
import test from 'ava'

test.before(async () => {
  const port = await getPort()
  setConfig({
    baseUrl: `http://localhost:${port}`,
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

test('returns ok', async (t) => {
  let res = await request(server).get('/ok').send().expect(200)
  t.deepEqual(res.body, {
    data: 'ok',
  })
})

test('can get', async (t) => {
  let res = await request(server)
    .post('/graphql')
    .send({
      query: gql`
        query GetUser {
          getUser {
            id
          }
        }
      `,
    })
    .expect(200)
  t.deepEqual(res.body, {
    data: {
      getUser: {
        id: 1,
      },
    },
  })
})
