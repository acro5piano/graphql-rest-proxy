import request from 'supertest'
import { server } from '../server'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'

describe('query', () => {
  beforeAll(async () => {
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
            getUserById(id: 1) {
              id
              name
            }
          }
        `,
      })
      .expect(200)
    expect(res.body).toEqual({
      data: {
        getUserById: {
          id: 1,
          name: 'Kazuya',
        },
      },
    })
  })
})
