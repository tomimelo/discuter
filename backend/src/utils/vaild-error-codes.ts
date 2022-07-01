export const validToShowErrorMessage = (code: number): boolean => {
  const codes = [
    40,
    1000
  ]
  return codes.includes(code)
}
