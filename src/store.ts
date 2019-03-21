import { GraphQLSchema } from 'graphql'

const _schemaStore = new Map<string, GraphQLSchema>()

export function setSchema(schema: GraphQLSchema) {
  _schemaStore.set('schema', schema)
}

export function getSchema() {
  const schema = _schemaStore.get('schema')
  if (!schema) {
    throw new Error('Schema is not initialized')
  }
  return schema
}
