export interface DatabaseConnector {
    connect: () => Promise<void>
}
