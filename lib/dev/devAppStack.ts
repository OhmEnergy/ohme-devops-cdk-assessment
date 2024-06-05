import * as cdk from "aws-cdk-lib";
import {aws_dynamodb, aws_iam, aws_lambda, aws_logs, aws_ecr} from "aws-cdk-lib";
import {Construct} from "constructs";

import {AppConfig} from "../utils/types";
import * as _appConfig from "../../appConfig.json";


export class DevAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appConfig = _appConfig as AppConfig;

    // Energy Team App
    const energyAppConfig = appConfig["energy"];
    const energyAppLogs = new aws_logs.LogGroup(this, "", {
      logGroupName: `/aws/lambda/ohme-dev-${energyAppConfig.appName}`,
      logGroupClass: aws_logs.LogGroupClass.STANDARD,
      retention: aws_logs.RetentionDays.THREE_DAYS,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const energyAppDb = new aws_dynamodb.Table(this, "", {
      tableName: `ohme-dev-${energyAppConfig.appName}`,
      tableClass: aws_dynamodb.TableClass.STANDARD,
      partitionKey: {name: energyAppConfig.database.sk, type: aws_dynamodb.AttributeType.STRING},
      sortKey: {name: energyAppConfig.database.pk, type: aws_dynamodb.AttributeType.NUMBER},
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    })

    const energyAppRole = new aws_iam.Role(this, "", {
      roleName: "LambdaAppServiceRole_" + energyAppConfig.appName,
      description: "",
      assumedBy: new aws_iam.ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        "LogsAccess": new aws_iam.PolicyDocument({
          statements: [
            new aws_iam.PolicyStatement({
              effect: aws_iam.Effect.ALLOW,
              actions: ["logs:*"],
              resources: ["*"]
            })
          ]
        }),
        "DynamoDBAccess": new aws_iam.PolicyDocument({
          statements: [
            new aws_iam.PolicyStatement({
              effect: aws_iam.Effect.ALLOW,
              actions: ["dynamodb:*"],
              resources: [
                energyAppDb.tableArn,
                energyAppDb.tableArn + "/*"
              ]
            })
          ]
        })
      }
    })

    const energyAppLambda = new aws_lambda.DockerImageFunction(this, "", {
      functionName: "ohme-dev-" + energyAppConfig.appName,
      description: energyAppConfig.appDescription,
      timeout: cdk.Duration.seconds(energyAppConfig.lambda.timeoutSecs),
      code: aws_lambda.DockerImageCode.fromEcr(
        aws_ecr.Repository.fromRepositoryArn(this, "", energyAppConfig.lambda.ecrRepo)
      ),
      role: energyAppRole,
      logGroup: energyAppLogs,
      tracing: aws_lambda.Tracing.ACTIVE,
      environment: energyAppConfig.lambda.environmentVariables
    })

    energyAppLambda.addEnvironment("APP_SERVICE_TABLE", energyAppDb.tableName);
  }
}