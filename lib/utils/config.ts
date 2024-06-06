import * as fs from 'fs';
import * as YAML from 'yaml';

export interface RepoEntry {
  readonly repo: string;
  readonly owner: string;
  readonly branch: string;
  readonly pipelineName: string;
}

export interface CiCdConfig {
  readonly codestarConnectionArn: string;
  readonly repo: RepoEntry;
  readonly env: Env;
}

export interface Env {
  readonly name: string;
  readonly account: string;
  readonly region: string;
  readonly context: string;
}

export interface AppConfig {}

export interface BaseAppConfig {
  readonly env: Env;
}

export interface AppEnvConfig extends BaseAppConfig {}

export class Config {
  readonly cicd: CiCdConfig;
  readonly dev: AppEnvConfig;
  readonly beta: AppEnvConfig;
  readonly prod: AppEnvConfig;

  constructor() {
    const filename = 'config.yml';
    const file = fs.readFileSync(filename, 'utf-8');

    const yaml = YAML.parse(file);

    this.dev = yaml.dev;
    this.beta = yaml.beta;
    this.prod = yaml.prod;
    this.cicd = yaml.cicd;
  }
}