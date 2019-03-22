import { resolve } from 'path'
import { readFile, existsSync } from 'fs'
import { promisify } from 'util'
import yargs from 'yargs'
import chalk from 'chalk'
import { printSchema } from 'graphql'
import { runserver } from './server'
import { setSchema, setConfig, getConfig, Config } from './store'
import { parse } from './parser/parse'
import { getVersion } from './version'

const readFilePromise = promisify(readFile)

function requireFromCwd(path: string) {
  return require(`${process.cwd()}/${path}`)
}

export async function run() {
  yargs
    .version(await getVersion())
    .usage('Usage: $0 <command> [options]')
    .command(['$0 <file>'], 'Start graphql-rest-proxy server.', {}, async args => {
      if (args.config) {
        const path = String(args.config)
        if (!existsSync(path)) {
          console.log(chalk.yellow(`Config file is not found: ${resolve(path)}`))
          console.log(chalk.yellow('Make sure your config file is set properly and it exists.'))
          process.exit(2)
        }
        try {
          const config: Config = requireFromCwd(path)
          setConfig(config)
        } catch {
          console.log(chalk.yellow(`Cannot read config file: ${resolve(path)}`))
          process.exit(2)
        }
      }

      // CLI option is prior to file config
      const config = getConfig()
      if (args.port) {
        config.port = Number(args.port)
      }
      if (args.baseUrl) {
        config.baseUrl = String(args.baseUrl)
      }
      setConfig(config)
      await initSchema(args.file as string)
      runserver()
    })
    .command('print <file>', 'Print GraphQL schema', {}, async args => {
      const schema = await initSchema(args.file as string)
      console.log(printSchema(schema))
    })
    .alias('c', 'config')
    .alias('p', 'port')
    .alias('b', 'baseUrl')
    .help('h')
    .parse()
}

async function initSchema(file: string) {
  let schemaString: string = ''
  try {
    schemaString = await readFilePromise(file, 'utf8')
  } catch {
    console.log(chalk.yellow(`Cannot read schema file: ${resolve(file)}`))
    process.exit(1)
  }
  if (!schemaString) {
    console.log(chalk.yellow('Schema file is empty or not exist.'))
    process.exit(1)
  }
  try {
    const schema = parse(schemaString)
    setSchema(schema)
    return schema
  } catch {
    console.log(chalk.yellow(`Cannot read schema file: ${resolve(file)}`))
    process.exit(1)
    return '' as any // TS hack
  }
}
