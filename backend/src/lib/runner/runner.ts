export interface Runner {
  run (func: Function): Promise<void>;
}
