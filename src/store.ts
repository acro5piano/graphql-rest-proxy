const _schemaStore = new Map<string, any>()

export function setSchema(schema: any) {
  _schemaStore.set('schema', schema)
}

export function getSchema() {
  return _schemaStore.get('schema')
}
