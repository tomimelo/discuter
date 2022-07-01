import { Repository } from '../db/repository'
import { Example } from './example'

export class ExampleService {
  public constructor (private readonly exampleRepository: Repository<Example>) {}

  public getExamples (): Promise<ReadonlyArray<Example>> {
    return this.exampleRepository.find()
  }

  public createExample (example: Example): Promise<Example> {
    return this.exampleRepository.create(example)
  }
}
