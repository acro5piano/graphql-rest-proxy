import { GraphQLArgument } from '../parser/interface'

const methods = ['get', 'post', 'put', 'patch', 'delete']

export function getProxyDirective(args: GraphQLArgument[]) {
  const index = methods.findIndex(method => hasDirectiveArgument(args, method))
  if (index === -1) {
    throw new Error(`at least set one of: ${methods.join(', ')}`)
  }

  console.log(methods[index])

  return function proxy() {
    return {
      name: 'Kazuya',
    }
  }
}

export function hasDirectiveArgument(args: GraphQLArgument[], argument: string) {
  const type = args.find(a => a.name.value === argument)
  return Boolean(type)
}

export function getDirectiveArgument(args: GraphQLArgument[], argument: string): string {
  const type = args.find(a => a.name.value === argument)
  if (!type) {
    throw new Error('argument `type` not found')
  }
  return type.value.value
}
