import { Request, Response } from 'express'

export interface Route {
    pathname: string
    get?(request: Request, response: Response): void
    post?(request: Request, response: Response): void
    put?(request: Request, response: Response): void
    delete?(request: Request, response: Response): void
    handle?(request: Request, response: Response): void
}
