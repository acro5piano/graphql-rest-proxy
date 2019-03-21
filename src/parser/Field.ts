import {
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  // GraphQLInputObjectType,
} from 'graphql'
import { get } from './typesProvider'
import { Modifier } from './interface'

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
    return {
      [this.name]: {
        type: this.getModifierFns().reduce((acc: any, g: any) => g(acc), this.getGraphQLType()),
        resolve: this.resolver,
      },
    }
  }

  setResolver(resolver: any) {
    this.resolver = resolver
  }

  private getModifierFns() {
    const fns: any = []

    if (this.modifiers.includes('list')) {
      fns.push(GraphQLList)
    }

    if (this.modifiers.includes('nonnull')) {
      fns.push(GraphQLNonNull)
    }

    return fns
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
