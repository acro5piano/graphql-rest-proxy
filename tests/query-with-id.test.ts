import request from 'supertest'
import { server } from '../src'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'
import test from 'ava'

test.before(async () => {
  await prepareTestWithSchema(gql`
    type User {
      id: Int
      name: String
    }

    type Query {
      getUserById(id: Int!): User @proxy(get: "http://localhost:PORT/users/$id")
    }
  `)
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
          getUserById(id: 1) {
            id
            name
          }
        }
      `,
    })
    .expect(200)
  t.deepEqual(res.body, {
    data: {
      getUserById: {
        id: 1,
        name: 'Kazuya',
      },
    },
  })
})
