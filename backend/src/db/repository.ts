
export interface Repository<T> {
  find(): Promise<ReadonlyArray<T>>
  create(data: T): Promise<T>
}
