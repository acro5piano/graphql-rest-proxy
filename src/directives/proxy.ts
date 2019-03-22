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

  const getBaseOptions = () => ({
    uri: baseUri,
    method,
    headers: {
      'User-Agent': 'graphql-rest-proxy',
    },
    body: {},
    json: true,
  })

  return async function proxy(parent: any, args: any, { req }: Context, { fieldName }: any) {
    if (fieldName in parent) {
      return parent[fieldName]
    }
    const options = getBaseOptions()
    options.uri = buildUri(options.uri, parent.id)
    options.headers = {
      ...req.headers,
      ...options.headers,
    }

    // Setting content-length may cause problem in proxy
    delete (options.headers as any)['content-length']

    options.body = args
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
