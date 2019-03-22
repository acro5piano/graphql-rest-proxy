import { GraphQLString, GraphQLInt } from 'graphql'
import { get } from './typesProvider'
import { Modifier } from './interface'
import { applyModifiers } from './utils'

export class Field {
  name: string
  type: string
  resolver?: Function
  modifiers: Modifier[]

  constructor(name: string, type: string, modifiers = []) {
    this.name = name
    this.type = type
    this.modifiers = modifiers
  }

  toGraphQLField() {
    const obj = {
      [this.name]: {
        type: applyModifiers(this.getGraphQLType(), this.modifiers),
        resolve: this.resolver,
      },
    }
    if (!this.resolver) {
      delete obj[this.name].resolve
    }
    return obj
  }

  setResolver(resolver: any) {
    this.resolver = resolver
  }

  private getGraphQLType(): any {
    switch (this.type) {
      case 'Int':
      case 'Int!':
        return GraphQLInt
      case 'String':
      case 'String!':
        return GraphQLString
      default:
        const maybeType = get(this.type)
        if (!maybeType) {
          throw new Error('cannot convert type')
        }
        return maybeType.toGraphQLType()
    }
  }
}
