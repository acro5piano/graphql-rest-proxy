import request from 'supertest'
import { server } from '../server'
import { gql, prepareTestWithSchema } from './test-utils'
import { terminate } from './mock-server'
import { setConfig } from '../store'
import getPort from 'get-port'

describe('with-config', () => {
  beforeAll(async () => {
    const port = await getPort()
    setConfig({
      baseUrl: `http://localhost:${port}`,
    })
    await prepareTestWithSchema(
      gql`
        type User {
          id: Int
          name: String
        }

        type Query {
          getUser: User @proxy(get: "/user")
        }
      `,
      port,
    )
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
              id
            }
          }
        `,
      })
      .expect(200)
    expect(res.body).toEqual({
      data: {
        getUser: {
          id: 1,
        },
      },
    })
  })
})
