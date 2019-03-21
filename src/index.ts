import { readFile } from 'fs'
import { promisify } from 'util'
import { printSchema } from 'graphql'
import { runserver } from './server'
import { setSchema } from './store'
import { parse } from './parser/parse'
import { getVersion } from './version'
import yargs from 'yargs'

const readFilePromise = promisify(readFile)

export async function run() {
  yargs
    .version(await getVersion())
    .command(['serve <file>', '$0 <file>'], 'Start graphql-rest-proxy server.', {}, async args => {
      await initSchema(args.file as string)
      runserver()
    })
    .command('print <file>', 'Print GraphQL schema', {}, async args => {
      const schema = await initSchema(args.file as string)
      console.log(printSchema(schema))
    })
    .help()
    .parse()
}

async function initSchema(file: string) {
  const schemaString = await readFilePromise(file, 'utf8')
  const schema = parse(schemaString)
  setSchema(schema)
  return schema
}
