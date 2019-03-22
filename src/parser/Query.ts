import { GraphQLField, Modifier } from './interface'
import { getDirectiveInitializer, getReturnTypeAndModifiers } from './utils'
import { GraphQLString, GraphQLInputObjectType } from 'graphql'

export class Query {
  name: string
  returnTypeName: string
  resolver?: () => any
  arguments?: any

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

  getArgs() {
    const UserInputType = new GraphQLInputObjectType({
      name: 'UserInput',
      fields: {
        name: {
          type: GraphQLString,
        },
      },
    })
    return {
      user: {
        type: UserInputType,
      },
    }
  }
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
