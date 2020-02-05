import graphql from 'graphql-tag'
import { RootNode } from './RootNode'
import { parseQueryFromField } from './Query'
import { parseTypeFromField } from './Type'
import { GraphQLTree, GraphQLField } from './interface'
import { GraphQLSchema } from 'graphql'

function isTypeDef(field: GraphQLField) {
  return !['Query', 'Mutation'].includes(field.name.value)
}

function buildSchema(schemaStructure: GraphQLTree): RootNode {
  const typeDefs = schemaStructure.definitions
    .filter(isTypeDef)
    .map(args => parseTypeFromField(args))

  const queryDef = schemaStructure.definitions.find(def => def.name.value === 'Query')
  const queries = queryDef ? queryDef.fields.map(f => parseQueryFromField(f)) : []

  const mutationDef = schemaStructure.definitions.find(def => def.name.value === 'Mutation')
  const mutations = mutationDef ? mutationDef.fields.map(f => parseQueryFromField(f)) : []

  return new RootNode({
    types: typeDefs,
    queries,
    mutations,
  } as any)
}

export function parse(schema: string): GraphQLSchema {
  return buildSchema(graphql(schema as any) as any).toGraphQLSchema()
}
