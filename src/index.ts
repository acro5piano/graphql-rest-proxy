import express from 'express'
import { parse } from './parser'

console.log(parse)

const app = express()

app.get('/', (_req, res) => {
  res.send('ok')
})

app.listen(9292, () => {
  console.log('listening')
})

function foo(n: string): void {
  console.log(n)
}

foo('bar')
