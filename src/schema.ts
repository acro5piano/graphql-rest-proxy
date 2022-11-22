import { resolve } from 'path'
import { readFile } from 'fs'
import { promisify } from 'util'
import chalk from 'chalk'
import { setSchema } from './store'
import { parse } from './parser/parse'

const readFilePromise = promisify(readFile)

export async function initSchema(file: string) {
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
