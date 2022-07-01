export const createCustomError = (err: any, code: number, message?: string): Error => {
  const error: any = new Error(message || err.message)
  if (err.stack) error.stack = err.stack
  error.status = err.status
  error.code = err.code || code
  error.data = err.data
  return error
}
