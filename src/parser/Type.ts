import { Field } from './Field'
import { GraphQLField } from './interface'
import { getTypeName } from './utils'
import {
  GraphQLObjectType,
  GraphQLString,
  // GraphQLInt,
  // GraphQLNonNull,
  // GraphQLList,
  // GraphQLInputObjectType,
} from 'graphql'

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
      fields: {
        name: {
          type: GraphQLString,
        },
      },
    })
    this.compiled = type
    return type
  }

  getGraphQLField() {
    return this.fields.map(f => f.toGraphQLField()).reduce((acc, cur) => ({ ...acc, cur }), {})
  }
}

export function parseTypeFromField(field: GraphQLField) {
  const fields = field.fields.map(f => {
    if (!f.type || !f.type.name || typeof f.type.name === 'string' || !f.type.name.value) {
      throw new Error('field type is null')
    }
    return new Field(f.name.value, f.type.name.value)
  })
  return new Type(getTypeName(field), fields)
}
