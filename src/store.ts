import { GraphQLSchema } from 'graphql'

export interface Config {
  baseUrl?: string
  port?: number
  graphiql?: boolean
}

const _schemaStore = new Map<string, GraphQLSchema>()
let _config: Config = {}

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

export function setConfig(config: Config) {
  _config = { ..._config, ...config }
}

export function getConfig() {
  return _config
}
