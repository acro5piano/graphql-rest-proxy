import { Type } from './Type'
import { InputObject } from './InputObject'
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { Query } from './Query'
import { add } from './typesProvider'
import { applyModifiers } from './utils'

type Mutation = Query

interface RootNodeArgs {
  types: Type[]
  queries: Query[]
  mutations: Mutation[]
  inputObjects: InputObject[]
}

export class RootNode {
  types: Type[]
  queries: Query[]
  mutations: Mutation[]
  inputObjects: InputObject[]

  constructor({ types, queries, mutations, inputObjects }: RootNodeArgs) {
    this.types = types
    this.queries = queries
    this.mutations = mutations
    this.inputObjects = inputObjects
  }

  toGraphQLSchema() {
    this.types.forEach(type => {
      add(type)
    })

    return new GraphQLSchema({
      query: this.getGraphQLQueryObject(),
      mutation: this.getGraphQLMutationObject(),
      // types: [UserInput],
    })
  }

  private getGraphQLQueryObject() {
    // graphql-js requires at least one query
    if (this.queries.length === 0) {
      return new GraphQLObjectType({
        name: 'Query',
        fields: {
          ok: {
            type: GraphQLString,
            resolve: () => 'ok',
          },
        },
      })
    }

    const queries = this.queries.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.name]: {
          type: applyModifiers(
            this.getType(cur.returnTypeName).toGraphQLType(),
            cur.returnTypeModifiers,
          ),
          args: cur.getArgs(),
          resolve: cur.resolver,
        },
      }
    }, {})

    return new GraphQLObjectType({
      name: 'Query',
      fields: () => queries,
    })
  }

  private getGraphQLMutationObject() {
    if (this.mutations.length === 0) {
      return undefined
    }

    const mutations = this.mutations.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.name]: {
          type: applyModifiers(
            this.getType(cur.returnTypeName).toGraphQLType(),
            cur.returnTypeModifiers,
          ),
          args: cur.getArgs(),
          resolve: cur.resolver,
        },
      }
    }, {})

    return new GraphQLObjectType({
      name: 'Mutation',
      fields: () => mutations,
    })
  }

  private getType(name: string) {
    const type = this.types.find(type => type.name === name)
    if (!type) {
      throw new Error('type not found')
    }
    return type
  }
}
