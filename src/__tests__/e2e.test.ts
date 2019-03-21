import * as request from 'supertest'
import { server } from '../server'
import { parse } from '../parser/parse'
import { setSchema } from '../store'
import { gql } from './test-utils'

const schemaString = gql`
  type User {
    id: Int
    name: String
  }

  type Query {
    getUser: User @proxy(get: "http://localhost:5620/users")
    getUsers: [User] @proxy(get: "http://localhost:5620/users")
  }
`

const schema = parse(schemaString)

describe('graphql-rest-proxy', () => {
  beforeAll(() => {
    setSchema(schema)
  })

  it('returns ok', async () => {
    let res = await request(server)
      .get('/ok')
      .send()
      .expect(200)
    console.log(res.body)
    expect(res.body).toEqual({
      data: 'ok',
    })
  })

  it('can query', async () => {
    let res = await request(server)
      .post('/graphql')
      .send({
        query: gql`
          query GetUser {
            getUser {
              name
            }
          }
        `,
      })
      .expect(200)
    expect(res.body).toEqual({
      data: {
        getUser: {
          name: 'Kazuya',
        },
      },
    })
  })
})
