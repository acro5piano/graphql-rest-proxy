import request from 'supertest'
import { server } from '../src'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'

import test from 'ava'

test.before(async () => {
  await prepareTestWithSchema(gql`
    input UserInput {
      name: String!
      gender: String
    }

    type User {
      id: Int
      name: String
      gender: String
    }

    type Mutation {
      createUser(user: UserInput!): User @proxy(post: "http://localhost:PORT/users")
      updateUser(id: Int!, user: UserInput!): User @proxy(patch: "http://localhost:PORT/users/$id")
      # deleteUser: User @proxy(delete: "http://localhost:PORT/user")
    }
  `)
})

test.after(terminate)

test('can create', async (t) => {
  let res = await request(server)
    .post('/graphql')
    .send({
      query: gql`
        mutation CreateUser($user: UserInput!) {
          createUser(user: $user) {
            id
            name
          }
        }
      `,
      variables: {
        user: {
          name: 'John',
        },
      },
    })
  t.deepEqual(res.body, {
    data: {
      createUser: {
        id: 1,
        name: 'Kazuya',
      },
    },
  })
})

test('can update', async (t) => {
  let res = await request(server)
    .post('/graphql')
    .send({
      query: gql`
        mutation UpdateUser($id: Int!, $user: UserInput!) {
          updateUser(id: $id, user: $user) {
            id
            name
          }
        }
      `,
      variables: {
        id: 1,
        user: {
          name: 'John',
        },
      },
    })
  t.deepEqual(res.body, {
    data: {
      updateUser: {
        id: 1,
        name: 'Kazuya',
      },
    },
  })
})
