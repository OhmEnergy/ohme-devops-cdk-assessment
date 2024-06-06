import {
  StackProps,
  Stack
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppEnvConfig, RepoEntry } from './utils/config';
import { AppStage } from './app-stage';

interface AppDeploymentPipelineProps extends StackProps {
  readonly codestarConnectionArn: string;
  readonly repo: RepoEntry;
  readonly dev: AppEnvConfig;
  readonly beta: AppEnvConfig;
  readonly prod: AppEnvConfig;
}

export class AppDeploymentPipeline extends Stack {
  constructor(scope: Construct, id: string, props: AppDeploymentPipelineProps) {
    super(scope, id, props);


  }
}