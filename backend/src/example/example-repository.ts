import { Repository } from '../db/repository'
import { Example } from './example'

export class ExampleRepository implements Repository<Example> {
  private collection: Array<Example> = []
  public constructor () {
  }

  public async find (): Promise<ReadonlyArray<Example>> {
    // Add proper implementation to retrieve documents
    return this.collection
  }

  public async create (exampleData: Example): Promise<Example> {
    // Add proper implementation to create documents
    const createdExample = exampleData
    this.collection.push(createdExample)
    return createdExample
  }
}
