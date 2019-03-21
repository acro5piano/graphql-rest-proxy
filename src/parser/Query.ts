import { GraphQLField, Modifier } from './interface'
import { getDirectiveInitializer, getReturnTypeAndModifiers } from './utils'

export class Query {
  name: string
  returnTypeName: string
  resolver?: () => any

  // TODO: Field と共通化する
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
