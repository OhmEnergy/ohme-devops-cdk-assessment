export interface AppConfig {
  [index: string]: {
    appName: string;
    appDescription: string;
    lambda: {
      timeoutSecs: number;
      ecrRepo: string;
      environmentVariables: Record<string, any>
    }
    database: {
      pk: string;
      sk: string;
    }
  }
}