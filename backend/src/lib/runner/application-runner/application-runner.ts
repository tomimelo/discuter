import { Runner } from '../runner'

export class ApplicationRunner implements Runner {
  public async run (func: Function): Promise<void> {
    func()
  }
}
