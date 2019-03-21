import { Field } from './Field'
import { GraphQLField } from './interface'
import { getTypeName } from './utils'
import { GraphQLObjectType } from 'graphql'
import { getDirectiveInitializer, getReturnTypeAndModifiers } from './utils'

export class Type {
  name: string
  fields: Field[]
  compiled?: GraphQLObjectType = undefined

  constructor(name: string, fields: Field[]) {
    this.name = name
    this.fields = fields
  }

  toGraphQLType() {
    if (this.compiled) {
      return this.compiled
    }
    const type = new GraphQLObjectType({
      name: this.name,
      fields: this.getGraphQLField(),
    })
    this.compiled = type
    return type
  }

  private getGraphQLField(): any {
    return this.fields
      .map(f => f.toGraphQLField())
      .reduce((acc, cur) => {
        return {
          ...acc,
          ...cur,
        }
      }, {})
  }
}

export function parseTypeFromField(field: GraphQLField) {
  const fields = field.fields.map(f => {
    const [name, modifiers] = getReturnTypeAndModifiers(f.type)
    const createdField = new Field(f.name.value, name, modifiers)
    f.directives.forEach(d => {
      const resolver = getDirectiveInitializer(d)(d.arguments)
      createdField.setResolver(resolver)
    })
    return createdField
  })
  return new Type(getTypeName(field), fields)
}
