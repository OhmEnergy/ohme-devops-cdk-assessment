#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppDeploymentPipeline } from '../lib/app-pipeline';
import {Config} from "../lib/utils/config";

const config = new Config();

const app = new cdk.App();
new AppDeploymentPipeline(app, 'AppDeploymentPipeline', {
  codestarConnectionArn: config.cicd.codestarConnectionArn,
  repo: config.cicd.repo,
  env: config.cicd.env,
  dev: config.dev,
  beta: config.beta,
  prod: config.prod
});