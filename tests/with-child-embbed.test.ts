import request from 'supertest'
import { server } from '../src'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'
import test from 'ava'

test.before(async () => {
  await prepareTestWithSchema(gql`
    type Post {
      id: Int
    }

    type User {
      id: Int
      posts: [Post] @proxy(get: "http://localhost:PORT/users/$id/posts")
    }

    type Query {
      getUser: User @proxy(get: "http://localhost:PORT/user_with_posts")
    }
  `)
})

test.after(terminate)

test('do not request if response has the attribute', async (t) => {
  let res = await request(server)
    .post('/graphql')
    .send({
      query: gql`
        query GetUser {
          getUser {
            id
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
      getUser: {
        id: 1,
        posts: [
          {
            id: 1,
          },
        ],
      },
    },
  })
})
