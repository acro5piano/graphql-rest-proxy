[![npm version](https://badge.fury.io/js/graphql-rest-proxy.svg)](https://badge.fury.io/js/graphql-rest-proxy)
[![CircleCI](https://circleci.com/gh/acro5piano/graphql-rest-proxy.svg?style=svg)](https://circleci.com/gh/acro5piano/graphql-rest-proxy)

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

However, it requires a lot of effort to replace your current REST api with a brand new GraphQL server.

`graphql-rest-proxy` comes in to address this issues. It proxies GraphQL to REST api according to the defined schema.

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
# TODO: create cli soon
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

# Development Status

Still in Beta.

TODO:

- [x] Create CLI
- [ ] Parameter proxy
- [ ] Input object
