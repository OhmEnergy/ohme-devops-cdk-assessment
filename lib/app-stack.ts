import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {AppEnvConfig} from "./utils/config";


interface AppStackProps extends StackProps {
  readonly config: AppEnvConfig;
  readonly environment: string;
}


export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);


  }
}