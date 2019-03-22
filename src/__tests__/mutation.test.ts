import request from 'supertest'
import { server } from '../server'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'

describe('mutation', () => {
  beforeAll(async () => {
    await prepareTestWithSchema(gql`
      input UserInput {
        name: String
      }

      type User {
        id: Int
        name: String
      }

      type Mutation {
        createUser(user: UserInput!): User @proxy(post: "http://localhost:PORT/user")
        updateUser(user: UserInput!): User @proxy(patch: "http://localhost:PORT/user")
        deleteUser: User @proxy(delete: "http://localhost:PORT/user")
      }
    `)
  })

  afterAll(terminate)

  it('can create', async () => {
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
