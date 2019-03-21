import { readFile } from 'fs'
import { resolve } from 'path'
import { promisify } from 'util'

const readFilePromise = promisify(readFile)

export async function getVersion() {
  const packageJsonContent = await readFilePromise(resolve(__dirname, '../package.json'), 'utf-8')
  const { version } = JSON.parse(packageJsonContent)
  return version
}
