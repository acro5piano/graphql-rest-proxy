import { Request, Response } from 'express'

export interface Root {
  req: Request
  res: Response
}
