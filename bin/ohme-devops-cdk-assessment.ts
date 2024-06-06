#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DevAppStack } from '../lib/dev/dev-app-stack';

const app = new cdk.App();
new DevAppStack(app, 'DevAppStack', {
  env: { account: '226002539315', region: 'eu-west-1' },
});