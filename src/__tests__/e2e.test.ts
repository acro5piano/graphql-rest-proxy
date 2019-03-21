import * as request from 'supertest'
import { server } from '../server'
import { parse } from '../parser/parse'
import { setSchema } from '../store'
import { gql } from './test-utils'
import { start, terminate } from './mock-server'

const schemaString = gql`
  type Post {
    id: Int
    title: String
  }

  type User {
    id: Int
    name: String
    posts: [Post] @proxy(get: "http://localhost:5620/users/$id/posts")
  }

  type Query {
    getUser: User @proxy(get: "http://localhost:5620/user")
    getUsers: [User] @proxy(get: "http://localhost:5620/users")
    createUser: User @proxy(post: "http://localhost:5620/users")
  }
`

const schema = parse(schemaString)

describe('graphql-rest-proxy', () => {
  beforeAll(async () => {
    setSchema(schema)
    await start()
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
              name
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
          name: 'Kazuya',
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

  it('can post', async () => {
    let res = await request(server)
      .post('/graphql')
      .send({
        query: gql`
          query CreateUser {
            createUser {
              id
              name
            }
          }
        `,
      })
      .expect(200)
    expect(res.body).toEqual({
      data: {
        createUser: {
          id: 1,
          name: 'Kazuya',
        },
      },
    })
  })
})
