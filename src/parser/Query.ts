import { GraphQLField } from './interface'
import { getDirectiveInitializer } from './utils'

type Modifier = 'list' | 'nonnull'

export class Query {
  name: string
  returnTypeName: string
  resolver?: () => any
  returnTypeModifiers: Modifier[]

  constructor(name: string, returnTypeName: string, returnTypeModifiers: Modifier[] = []) {
    this.name = name
    this.returnTypeName = returnTypeName
    this.returnTypeModifiers = returnTypeModifiers
  }

  setResolver(resolver: any) {
    this.resolver = resolver
  }

  toGraphQLQuery() {}
}

export function parseQueryFromField(field: GraphQLField) {
  const [name, modifiers] = getReturnTypeAndModifiers(field.type)
  const query = new Query(field.name.value, name, modifiers)

  field.directives.forEach(d => {
    const resolver = getDirectiveInitializer(d)(d.arguments)
    query.setResolver(resolver)
  })

  return query
}

function getReturnTypeAndModifiers(type: any) {
  if (type.name) {
    return [type.name.value, []]
  }
  if (type.kind === 'ListType') {
    return [type.type.name.value, ['list']]
  }
  throw new Error('cannnot get return type')
}
