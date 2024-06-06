import {Stage, StageProps} from "aws-cdk-lib";
import {AppEnvConfig} from "./utils/config";
import {Construct} from "constructs";

interface AppStageProps extends StageProps {
  readonly config: AppEnvConfig;
  readonly environment: string;
}

export class AppStage extends Stage {
  constructor(scope: Construct, id: string, props: AppStageProps) {
    super(scope, id, props);


  }
}

