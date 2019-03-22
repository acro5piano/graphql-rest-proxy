import rp from 'request-promise'
import { Context } from '../interface'
import { GraphQLArgument } from '../parser/interface'
import { getConfig } from '../store'

const methods = ['get', 'post', 'put', 'patch', 'delete']

export function getProxyDirective(args: GraphQLArgument[]) {
  const index = methods.findIndex(method => hasDirectiveArgument(args, method))
  if (index === -1) {
    throw new Error(`at least set one of: ${methods.join(', ')}`)
  }
  const method = methods[index]
  const baseUri = getDirectiveArgument(args, method)

  const options = {
    uri: baseUri,
    method,
    // qs: {
    //   access_token: 'xxxxx xxxxx', // -> uri + '?access_token=xxxxx%20xxxxx'
    // },
    headers: {
      'User-Agent': 'graphql-rest-proxy',
    },
    json: true, // Automatically parses the JSON string in the response
  }

  return async function proxy(root: any, _args: any, { req }: Context, _all: any) {
    const currentPath = _all.fieldNodes[0].name.value
    if (currentPath in root) {
      return root[currentPath]
    }
    options.uri = buildUri(options.uri, root.id)
    options.headers = {
      ...req.headers,
      ...options.headers,
    }
    return rp(options)
  }
}

function buildUri(uri: string, id: any) {
  const idReplaced = uri.replace(/$id/g, id)
  if (uri.startsWith('http')) {
    return idReplaced
  }
  const { baseUrl } = getConfig()
  return `${baseUrl}${idReplaced}`
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
