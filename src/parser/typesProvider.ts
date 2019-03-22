import { Type } from './Type'

const types: Type[] = []

export function get(typeName: string) {
  const type = types.find(type => type.name === typeName)
  return type
}

export function getStrict(typeName: string) {
  const type = get(typeName)
  if (!type) {
    throw new Error('type not found')
  }
  return type
}

export function add(type: Type) {
  types.push(type)
}
