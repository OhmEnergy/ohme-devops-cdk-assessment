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
    const energyAppLogs = new aws_logs.LogGroup(this, "DevLogs-Energy", {
      logGroupName: `/aws/lambda/ohme-dev-${energyAppConfig.appName}`,
      logGroupClass: aws_logs.LogGroupClass.STANDARD,
      retention: aws_logs.RetentionDays.THREE_DAYS,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const energyAppDb = new aws_dynamodb.Table(this, "DevDynamoDB-Energy", {
      tableName: `ohme-dev-${energyAppConfig.appName}`,
      tableClass: aws_dynamodb.TableClass.STANDARD,
      partitionKey: {name: energyAppConfig.database.sk, type: aws_dynamodb.AttributeType.STRING},
      sortKey: {name: energyAppConfig.database.pk, type: aws_dynamodb.AttributeType.NUMBER},
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    })

    const energyAppRole = new aws_iam.Role(this, "DevRole-Energy", {
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

    const energyAppLambda = new aws_lambda.DockerImageFunction(this, "DevLambda-Energy", {
      functionName: "ohme-dev-" + energyAppConfig.appName,
      description: energyAppConfig.appDescription,
      timeout: cdk.Duration.seconds(energyAppConfig.lambda.timeoutSecs),
      code: aws_lambda.DockerImageCode.fromEcr(
        aws_ecr.Repository.fromRepositoryArn(this, "DevEcrRepo-Energy", energyAppConfig.lambda.ecrRepo)
      ),
      role: energyAppRole,
      logGroup: energyAppLogs,
      tracing: aws_lambda.Tracing.ACTIVE,
      environment: energyAppConfig.lambda.environmentVariables
    })

    energyAppLambda.addEnvironment("APP_SERVICE_TABLE", energyAppDb.tableName);

    // Customer Team App
    const customerAppConfig = appConfig["customer"];
    const customerAppLogs = new aws_logs.LogGroup(this, "DevLogs-Customer", {
      logGroupName: `/aws/lambda/ohme-dev-${customerAppConfig.appName}`,
      logGroupClass: aws_logs.LogGroupClass.STANDARD,
      retention: aws_logs.RetentionDays.THREE_DAYS,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const customerAppDb = new aws_dynamodb.Table(this, "DevDynamoDB-Customer", {
      tableName: `ohme-dev-${customerAppConfig.appName}`,
      tableClass: aws_dynamodb.TableClass.STANDARD,
      partitionKey: {name: customerAppConfig.database.sk, type: aws_dynamodb.AttributeType.STRING},
      sortKey: {name: customerAppConfig.database.pk, type: aws_dynamodb.AttributeType.NUMBER},
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    const customerAppRole = new aws_iam.Role(this, "DevRole-Customer", {
      roleName: "LambdaAppServiceRole_" + customerAppConfig.appName,
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
                customerAppDb.tableArn,
                customerAppDb.tableArn + "/*"
              ]
            })
          ]
        })
      }
    })

    const customerAppLambda = new aws_lambda.DockerImageFunction(this, "DevLambda-Customer", {
      functionName: "ohme-dev-" + customerAppConfig.appName,
      description: customerAppConfig.appDescription,
      timeout: cdk.Duration.seconds(customerAppConfig.lambda.timeoutSecs),
      code: aws_lambda.DockerImageCode.fromEcr(
        aws_ecr.Repository.fromRepositoryArn(this, "DevEcrRepo-Customer", customerAppConfig.lambda.ecrRepo)
      ),
      role: customerAppRole,
      logGroup: customerAppLogs,
      tracing: aws_lambda.Tracing.ACTIVE,
      environment: customerAppConfig.lambda.environmentVariables
    })

    customerAppLambda.addEnvironment("APP_SERVICE_TABLE", customerAppDb.tableName);

    // Pricing Team App
    const pricingAppConfig = appConfig["pricing"];
    const pricingAppLogs = new aws_logs.LogGroup(this, "DevLogs-Pricing", {
      logGroupName: `/aws/lambda/ohme-dev-${pricingAppConfig.appName}`,
      logGroupClass: aws_logs.LogGroupClass.STANDARD,
      retention: aws_logs.RetentionDays.THREE_DAYS,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const pricingAppDb = new aws_dynamodb.Table(this, "DevDynamoDB-Pricing", {
      tableName: `ohme-dev-${pricingAppConfig.appName}`,
      tableClass: aws_dynamodb.TableClass.STANDARD,
      partitionKey: {name: pricingAppConfig.database.sk, type: aws_dynamodb.AttributeType.STRING},
      sortKey: {name: pricingAppConfig.database.pk, type: aws_dynamodb.AttributeType.NUMBER},
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    })

    const pricingAppRole = new aws_iam.Role(this, "DevRole-Pricing", {
      roleName: "LambdaAppServiceRole_" + pricingAppConfig.appName,
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
                pricingAppDb.tableArn,
                pricingAppDb.tableArn + "/*"
              ]
            })
          ]
        })
      }
    })

    const pricingAppLambda = new aws_lambda.DockerImageFunction(this, "DevLambda-Pricing", {
      functionName: "ohme-dev-" + pricingAppConfig.appName,
      description: pricingAppConfig.appDescription,
      timeout: cdk.Duration.seconds(pricingAppConfig.lambda.timeoutSecs),
      code: aws_lambda.DockerImageCode.fromEcr(
        aws_ecr.Repository.fromRepositoryArn(this, "DevEcrRepo-Pricing", pricingAppConfig.lambda.ecrRepo)
      ),
      role: pricingAppRole,
      logGroup: pricingAppLogs,
      tracing: aws_lambda.Tracing.ACTIVE,
      environment: pricingAppConfig.lambda.environmentVariables
    })

    pricingAppLambda.addEnvironment("APP_SERVICE_TABLE", pricingAppDb.tableName);

    // Order Team App
    const orderAppConfig = appConfig["order"];
    const orderAppLogs = new aws_logs.LogGroup(this, "DevLogs-Order", {
      logGroupName: `/aws/lambda/ohme-dev-${orderAppConfig.appName}`,
      logGroupClass: aws_logs.LogGroupClass.STANDARD,
      retention: aws_logs.RetentionDays.THREE_DAYS,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const orderAppDb = new aws_dynamodb.Table(this, "DevDynamoDB-Order", {
      tableName: `ohme-dev-${orderAppConfig.appName}`,
      tableClass: aws_dynamodb.TableClass.STANDARD,
      partitionKey: {name: orderAppConfig.database.sk, type: aws_dynamodb.AttributeType.STRING},
      sortKey: {name: orderAppConfig.database.pk, type: aws_dynamodb.AttributeType.NUMBER},
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    })

    const orderAppRole = new aws_iam.Role(this, "DevRole-Order", {
      roleName: "LambdaAppServiceRole_" + orderAppConfig.appName,
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
                orderAppDb.tableArn,
                orderAppDb.tableArn + "/*"
              ]
            })
          ]
        })
      }
    })

    const orderAppLambda = new aws_lambda.DockerImageFunction(this, "DevLambda-Order", {
      functionName: "ohme-dev-" + orderAppConfig.appName,
      description: orderAppConfig.appDescription,
      timeout: cdk.Duration.seconds(orderAppConfig.lambda.timeoutSecs),
      code: aws_lambda.DockerImageCode.fromEcr(
        aws_ecr.Repository.fromRepositoryArn(this, "DevEcrRepo-Order", orderAppConfig.lambda.ecrRepo)
      ),
      role: orderAppRole,
      logGroup: orderAppLogs,
      tracing: aws_lambda.Tracing.ACTIVE,
      environment: orderAppConfig.lambda.environmentVariables
    })

    orderAppLambda.addEnvironment("APP_SERVICE_TABLE", orderAppDb.tableName);
  }
}