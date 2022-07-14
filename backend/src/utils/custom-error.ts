export class CustomError extends Error {
  public readonly status: number
  public readonly message: string

  public constructor (message: string, status: number = 500) {
    super(message)
    this.status = status
    this.message = message
  }
}
