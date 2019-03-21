import { resolve } from 'path'

export function gql(literals: TemplateStringsArray) {
  return literals[0]
}

export const testConfig = {
  basePath: resolve(__dirname),
  resolvers: resolve(__dirname, 'resolvers'),
  directives: [resolve(__dirname, 'directives')],
}
