import { Modifier } from './interface'
import { getGraphQLType, applyModifiers } from './utils'

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
        type: applyModifiers(getGraphQLType(this.type), this.modifiers),
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
}
