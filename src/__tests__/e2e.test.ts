import request from 'supertest'
import { server } from '../server'
// import { gql } from './test-utils'
//
// const schema = gql`
//   type User {
//     id: Int
//     name: String
//   }
//
//   type Query {
//     getUsers: [User] @proxy(get: "http://localhost:5620/users")
//   }
// `

describe('graphql-rest-proxy', () => {
  it('proxy get', async () => {
    let res = await request(server)
      .get('/ok')
      .send()
      .expect(200)
    console.log(res.body)
    expect(res.body).toEqual({
      data: 'ok',
    })
  })
})
