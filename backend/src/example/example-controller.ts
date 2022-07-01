import { NextFunction, Request, Response } from 'express'
import { BaseController } from '../lib/base-controller/base-controller'
import { Logger } from '../types/logger'
import { ExampleService } from './example-service'

// Extend class controller from BaseController to autoBind methods and be compatible with express route handler
export class ExampleController extends BaseController {
  public constructor (private readonly exampleService: ExampleService, private readonly logger: Logger) {
    super()
  }

  public async getExamples (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const examples = await this.exampleService.getExamples()
      res.json({
        ok: true,
        examples
      })
    } catch (error) {
      this.handleError(error, next)
    }
  }

  public async createExample (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const example = req.body
      const exampleCreated = await this.exampleService.createExample(example)
      res.json({
        ok: true,
        example: exampleCreated
      })
    } catch (error) {
      this.handleError(error, next)
    }
  }

  public handleError (error: any, next: NextFunction): void {
    this.logger.error(error.message)
    next(error)
  }
}
