import request from 'supertest'
import { server } from '../src'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'
import test from 'ava'

test.before(async () => {
  await prepareTestWithSchema(gql`
    type User {
      id: String
      name: String
    }

    type Query {
      getUserById(id: Int!): User @proxy(get: "http://localhost:PORT/users/prefix^idsuffix")
      legacyGetUserById(id: Int!): User @proxy(get: "http://localhost:PORT/users/prefix$idsuffix")
    }
  `)
})

test.after(terminate)

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
        id: `prefix1suffix`,
        name: 'Kazuya',
      },
    },
  })
})

test('legacy does not replace $param in the uri', async (t) => {
  let res = await request(server)
    .post('/graphql')
    .send({
      query: gql`
        query GetUser {
          legacyGetUserById(id: 1) {
            id
            name
          }
        }
      `,
    })
    .expect(200)
  t.deepEqual(res.body, {
    data: {
      legacyGetUserById: {
        id: `undefined`,
        name: 'Kazuya',
      },
    },
  })
})
