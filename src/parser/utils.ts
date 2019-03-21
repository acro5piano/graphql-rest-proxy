import { GraphQLField } from './interface'
import { getProxyDirective } from '../directives/proxy'
import { GraphQLDirective } from './interface'

export function getTypeName(field: GraphQLField): string {
  if (field.name) {
    return field.name.value
  }
  if (!field.type || !field.type.name || typeof field.type.name === 'string') {
    throw new Error(`type is wrong: ${field}`)
  }

  return field.type.name.value
}

export function getDirectiveInitializer(directive: GraphQLDirective) {
  switch (directive.name.value) {
    case 'proxy':
      return getProxyDirective
    default:
      throw new Error('directive not found')
  }
}
