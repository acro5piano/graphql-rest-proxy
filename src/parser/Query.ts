import { GraphQLField, Modifier } from './interface'
import { getDirectiveInitializer, getReturnTypeAndModifiers } from './utils'
import { getStrict } from './typesProvider'

export interface Argument {
  name: string
  typeName: string
}

export class Query {
  name: string
  returnTypeName: string
  resolver?: () => any

  // TODO: クラスにする, Modifier 仕組み導入
  arguments: Argument[]

  // TODO: Field と共通化する
  returnTypeModifiers: Modifier[]

  constructor(
    name: string,
    returnTypeName: string,
    returnTypeModifiers: Modifier[] = [],
    args: Argument[],
  ) {
    this.name = name
    this.returnTypeName = returnTypeName
    this.returnTypeModifiers = returnTypeModifiers
    this.arguments = args
  }

  setResolver(resolver: any) {
    this.resolver = resolver
  }

  toGraphQLQuery() {}

  getArgs() {
    return this.arguments.reduce((car, cur) => {
      const inputType = getStrict(cur.typeName)
      return {
        ...car,
        [cur.name]: {
          type: inputType.toGraphQLType(),
        },
      }
    }, {})
  }
}

export function parseQueryFromField(field: GraphQLField) {
  const [name, modifiers] = getReturnTypeAndModifiers(field.type)
  const args = field.arguments.map(arg => {
    const [name] = getReturnTypeAndModifiers(arg.type)
    return {
      name: arg.name.value,
      typeName: name,
    }
  })
  const query = new Query(field.name.value, name, modifiers, args)

  field.directives.forEach(d => {
    const resolver = getDirectiveInitializer(d)(d.arguments)
    query.setResolver(resolver)
  })

  return query
}
