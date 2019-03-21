import graphql from 'graphql-tag'
import { RootNode } from './RootNode'
import { parseQueryFromField } from './Query'
import { parseTypeFromField } from './Type'
import { GraphQLTree, GraphQLField } from './interface'
import {
  GraphQLSchema,
  // GraphQLObjectType,
  // GraphQLString,
  // GraphQLInt,
  // GraphQLNonNull,
  // GraphQLList,
  // GraphQLInputObjectType,
} from 'graphql'

function isTypeDef(field: GraphQLField) {
  return !['Query', 'Mutation'].includes(field.name.value)
}

function buildSchema(schemaStructure: GraphQLTree): RootNode {
  const typeDefs = schemaStructure.definitions
    .filter(isTypeDef)
    .map(args => parseTypeFromField(args))

  const queryDef = schemaStructure.definitions.find(def => def.name.value === 'Query')
  if (!queryDef) {
    throw new Error('cannot find Query definition')
  }
  const queries = queryDef.fields.map(f => parseQueryFromField(f))

  return new RootNode({
    types: typeDefs,
    queries,
  } as any)
}

export function parse(schema: string): GraphQLSchema {
  return buildSchema(graphql(schema)).toGraphQLSchema()
}
