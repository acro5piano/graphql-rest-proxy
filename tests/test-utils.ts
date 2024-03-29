import { start } from './mock-server'
import getPort from 'get-port'
import { parse, setSchema } from '../src'

export function gql(literals: TemplateStringsArray) {
  return literals[0]
}

export async function prepareTestWithSchema(schemaString: string, givenPort?: number) {
  const port = givenPort || (await getPort())
  const schema = parse(schemaString.replace(/PORT/g, String(port)))
  setSchema(schema)
  await start(port)
}
