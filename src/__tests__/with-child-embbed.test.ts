import request from 'supertest'
import { server } from '../server'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'

describe('graphql-rest-proxy', () => {
  beforeAll(async () => {
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

  afterAll(terminate)

  it('do not request if response has the attribute', async () => {
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
    expect(res.body).toEqual({
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
})
