import request from 'supertest'
import { server } from '../server'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'

describe('query', () => {
  beforeAll(async () => {
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

  afterAll(terminate)

  it('returns ok', async () => {
    let res = await request(server)
      .get('/ok')
      .send()
      .expect(200)
    expect(res.body).toEqual({
      data: 'ok',
    })
  })

  it('can get', async () => {
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
    expect(res.body).toEqual({
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

  it('can get many', async () => {
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
    expect(res.body).toEqual({
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
})
