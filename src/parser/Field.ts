import {
  GraphQLString,
  GraphQLInt,
  // GraphQLNonNull,
  // GraphQLList,
  // GraphQLInputObjectType,
} from 'graphql'
// import { GraphQLField } from './interface'

export class Field {
  name: string
  type: string
  resolver?: Function

  constructor(name: string, type: string, resolver?: Function) {
    this.name = name
    this.type = type
    this.resolver = resolver
  }

  toGraphQLField() {
    return {
      [this.name]: {
        type: this.getGraphQLType(),
      },
    }
  }

  private getGraphQLType() {
    switch (this.name) {
      case 'Int':
        return GraphQLInt
      case 'String':
        return GraphQLString
      default:
        throw new Error('cannot convert type')
    }
  }
}

// export function parseFieldFromField(field: GraphQLField) {
//   return new Field(getTypeName(field), [new Field('id', 'Int')])
// }
