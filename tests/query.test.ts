import request from 'supertest'
import { server } from '../src'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'
import test from 'ava'

test.before(async () => {
  await prepareTestWithSchema(gql`
    type Post {
      id: Int
      title: String
    }

    type User {
      id: Int!
      name: String
      isActive: Boolean
      posts: [Post] @proxy(get: "http://localhost:PORT/users/$id/posts")
    }

    type Query {
      getUser: User @proxy(get: "http://localhost:PORT/user")
      getUsers: [User] @proxy(get: "http://localhost:PORT/users")
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
          getUser {
            __typename
            id
            name
            isActive
            posts {
              __typename
              id
            }
          }
        }
      `,
    })
    .expect(200)
  t.deepEqual(res.body, {
    data: {
      getUser: {
        __typename: 'User',
        id: 1,
        name: 'Kazuya',
        isActive: true,
        posts: [
          {
            __typename: 'Post',
            id: 1,
          },
          {
            __typename: 'Post',
            id: 1,
          },
        ],
      },
    },
  })
})

test('can get many', async (t) => {
  let res = await request(server)
    .post('/graphql')
    .send({
      query: gql`
        query GetUsers {
          getUsers {
            id
            name
            posts {
              id
            }
          }
        }
      `,
    })
    .expect(200)
  t.deepEqual(res.body, {
    data: {
      getUsers: [
        {
          id: 1,
          name: 'Kazuya',
          posts: [
            {
              id: 1,
            },
            {
              id: 1,
            },
          ],
        },
        {
          id: 1,
          name: 'Kazuya',
          posts: [
            {
              id: 1,
            },
            {
              id: 1,
            },
          ],
        },
      ],
    },
  })
})
