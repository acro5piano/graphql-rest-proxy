[![npm version](https://badge.fury.io/js/graphql-rest-proxy.svg)](https://badge.fury.io/js/graphql-rest-proxy)
[![CircleCI](https://circleci.com/gh/acro5piano/graphql-rest-proxy.svg?style=svg)](https://circleci.com/gh/acro5piano/graphql-rest-proxy)
[![codecov](https://codecov.io/gh/acro5piano/graphql-rest-proxy/branch/master/graph/badge.svg)](https://codecov.io/gh/acro5piano/graphql-rest-proxy)

# graphql-rest-proxy

Convert your REST server to GraphQL server.

# Install

```sh
npm -g install graphql-rest-proxy
```

Or if you use Yarn:

```sh
yarn global add graphql-rest-proxy
```

# Why

We all know GraphQL is great, so you want to move from REST API to GraphQL.

However, it requires a lot of effort to replace your current REST API with a brand new GraphQL server.

`graphql-rest-proxy` comes in to address this issues. It proxies GraphQL to REST API according to the defined schema.

# Getting Started

**STEP 1. Define your schema.**

`schema.graphql`

```graphql
type User {
  id: Int
  name: String
  isActive: Boolean
}

type Query {
  getUser: User @proxy(get: "http://my-rest-api.com/user")
}
```

**STEP 2. Run your proxy server.**

```sh
graphql-rest-proxy schema.graphql

# => graphql-rest-proxy is running on http://localhost:5252
```

**STEP 3. Request!**

```
curl -XPOST -H 'Content-Type: application/json' \
    -d '{ "query": "{ getUser { id name isActive } }" }' \
    http://localhost:5252/graphql
```

It will return like this:

```
{
  "data": {
    "getUser": {
      "id": 1,
      "name": "Tom",
      "isActive": false
    }
  }
}
```

# Examples

**Basic Query Proxy**

```graphql
type User {
  id: Int
  name: String
}

type Query {
  getUser: User @proxy(get: "http://my-rest-api.com/user")
  getUsers: [User] @proxy(get: "http://my-rest-api.com/users")
}
```

**Query with Parameters**

You can refer the id of query args by `$id`.

```graphql
type User {
  id: Int
  name: String
}

type Query {
  getUserById(id: Int!): User @proxy(get: "http://my-rest-api.com/users/$id")
}
```

**Mutation with Input Parameters**

Mutation forward `variables` to the REST API.

```graphql
type UserInput {
  name: String!
}

type User {
  id: Int
  name: String
}

type Mutation {
  createUser(user: UserInput!): User @proxy(post: "http://my-rest-api.com/users")
  updateUser(id: Int!, user: UserInput!): User @proxy(patch: "http://my-rest-api.com/users/$id")
}
```

Request example:

```javascript
fetch('http://localhost:5252/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: gql`
      mutation UpdateUser($id: Int!, $user: UserInput!) {
        updateUser(id: $id, user: $user) {
          id
          name
        }
      }
    `,
    variables: {
      id: 1,
      user: {
        name: 'acro5piano',
      },
    },
  }),
})
```

**Query Nested Object**

You can refer the id of parent object by `$id`.

```graphql
type Post {
  id: Int
  title: String
}

type User {
  id: Int
  name: String
  posts: [Post] @proxy(get: "http://my-rest-api.com/users/$id/posts")
}

type Query {
  getUser: User @proxy(get: "http://my-rest-api.com/user")
}
```

# Notes

**Request as less as possible**

`graphql-rest-proxy` does not request if proxy response includes child object. This means you can reduce API call if you includes child object.

For example, if the schema is like this:

```graphql
type Post {
  id: Int
  title: String
}

type User {
  id: Int
  name: String
  posts: [Post] @proxy(get: "http://my-rest-api.com/users/$id/posts")
}

type Query {
  getUser: User @proxy(get: "http://my-rest-api.com/user")
}
```

And REST API returns like this:

```sh
curl http://my-rest-api.com/user
```

```json
{
  "id": 1,
  "name": "acro5piano",
  "posts": {
    "id": 1,
    "title": "graphql-rest-proxy"
  }
}
```

In this case, `posts` is embbed in response, so `graphql-rest-proxy` doesn't request to `http://my-rest-api.com/users/$id/posts`.

# Configuration

CLI options are:

```
Usage: graphql-rest-proxy <command> [options]

Commands:
  graphql-rest-proxy <file>        Start graphql-rest-proxy server.          [default]
  graphql-rest-proxy print <file>  Print GraphQL schema

Options:
  --version      Show version number                                   [boolean]
  -c, --config   Specify config file
  -p, --port     Specify port
  -b, --baseUrl  Specify proxy base url
  -h, --help     Show help                                             [boolean]
```

You can also set a config file.

`proxy.config.js`

```javascript
module.exports = {
  baseUrl: 'https://myapi.com',
  port: 3000,
}
```

And run

```sh
graphql-rest-proxy --config proxy.config.js schema.graphql
```

# Development Status

Still in Beta.

TODO:

- [ ] More type support
  - [ ] Fragment
  - [ ] Scalar
- [ ] Refactoring
- [ ] Logging
