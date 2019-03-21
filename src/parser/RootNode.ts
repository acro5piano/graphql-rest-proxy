import { Type } from './Type'
import { InputObject } from './InputObject'
import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { Query } from './Query'
import { add } from './typesProvider'

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

    const queries = this.queries.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.name]: {
          type: this.getType(cur.returnTypeName).toGraphQLType(),
          resolve: cur.resolver,
        },
      }
    }, {})

    const query = new GraphQLObjectType({
      name: 'Query',
      fields: () => queries,
    })

    return new GraphQLSchema({
      query,
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
