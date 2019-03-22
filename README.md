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

# Usage

**STEP 1. Define your schema.**

`schema.graphql`

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

**STEP 2. Run your proxy server.**

```sh
graphql-rest-proxy schema.graphql

# => graphql-rest-proxy is running on http://localhost:5252
```

**STEP 3. Request!**

```
curl -XPOST http://localhost:5252/graphql -d query='query {
  getUser {
    id
    posts {
      id
    }
  }
}'
```

# Features

**Reference ID**

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
```

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

You can set a config file.

`proxy.config.js`

```javascript
module.exports = {
  // Base url.
  // If this setting is enabled, you can set relative path like `@proxy(get: "/user")`
  baseUrl: 'https://myapi.com',

  // Server listen port. Defualt to 5252.
  port: 3000,
}
```

```
graphql-rest-proxy -c examples/proxy.config.js
```

# Development Status

Still in Beta.

TODO:

- [x] Create CLI
- [ ] Mutation
- [ ] Parameter proxy
- [ ] Input object
- [ ] Logging
