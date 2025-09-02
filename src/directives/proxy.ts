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
    options.uri = buildUri(options.uri, parent, args)
    options.headers = {
      ...req.headers,
      ...options.headers,
    }

    // Setting content-length may cause problem in proxy
    delete (options.headers as any)['content-length']

    // The incoming host is reset to be able to send cross-domain requests
    delete (options.headers as any)['host']

    options.body = args
    return rp(options)
  }
}

function buildUri(uri: string, parent?: any, args?: any) {
  let builtUri = uri

  const parentWithArgs = Object.assign(parent, args);
  if (parentWithArgs) {
    // Legacy way to replace $param in the uri
    let temparr = builtUri.split('/');
    temparr.forEach((item, index) => {
      if (item.includes('$')) {
        temparr[index] = String(parentWithArgs[item.replace('$', '')]);
      }
    });
    builtUri = temparr.join('/');

    // New way to replace ^param in the uri
    Object.keys(parentWithArgs).forEach(key => {
      builtUri = builtUri.replace(
        new RegExp(`\\^${key}`, 'g'),
        encodeURIComponent(String(parentWithArgs[key]))
      );
    });
  }

  if (builtUri.startsWith('http')) {
    return builtUri
  }
  const { baseUrl } = getConfig()
  return `${baseUrl}${builtUri}`
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
