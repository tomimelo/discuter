export function normalizePort (port: string | undefined, backupPort: number): number {
  if (port === undefined) return backupPort
  const normalizedPort = parseInt(port, 10)
  return isNaN(normalizedPort)
    ? backupPort
    : normalizedPort >= 0
      ? normalizedPort
      : backupPort
}
