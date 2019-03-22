import { GraphQLField } from './interface'
import { getProxyDirective } from '../directives/proxy'
import { GraphQLDirective } from './interface'
import { Modifier } from './interface'
import { GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql'
import { get } from './typesProvider'

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

export function getReturnTypeAndModifiers(type: any) {
  if (type.name) {
    return [type.name.value, []]
  }
  if (type.kind === 'ListType') {
    return [type.type.name.value, ['list']]
  }
  if (type.kind === 'NonNullType') {
    return [type.type.name.value, ['nonnull']]
  }
  console.log(type.kind)
  throw new Error('cannnot get return type')
}

export function applyModifiers(type: any, modifiers: Modifier[]) {
  const fns: any = []

  if (modifiers.includes('list')) {
    fns.push(GraphQLList)
  }

  if (modifiers.includes('nonnull')) {
    fns.push(GraphQLNonNull)
  }

  return fns.reduce((acc: any, g: any) => g(acc), type)
}

export function getGraphQLType(type: string): any {
  switch (type) {
    case 'Int':
    case 'Int!':
      return GraphQLInt
    case 'String':
    case 'String!':
      return GraphQLString
    default:
      const maybeType = get(type)
      if (!maybeType) {
        throw new Error('cannot convert type')
      }
      return maybeType.toGraphQLType()
  }
}
