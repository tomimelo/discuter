export interface AppConfig {
  env: string;
  api: {
    version: number;
    port: number;
  };
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    options: any;
  };
  auth: {
    user: string;
    password: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshTokenDaysUntilExpire: number;
  };
  logger: {
    level: string;
  };
}
