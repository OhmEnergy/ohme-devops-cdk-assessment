# Welcome to your CDK Coding Test

There are 4 engineering teams who would like to deploy their lambda docker 
services using a config driven approach. They all follow the same framework of a lambda, 
that writes to dynamodb, writes logs to cloudwatch logs and each have a specific IAM role.

### Assumptions:
1. Each team has a working optimised lambda repo in ECR
2. Deployment role has permissions to get these repos from the designated account
3. Other teams may want their applications deployed using the same pattern

### Setup:
1. clone the repo
2. install the packages
3. synthesize the project to ensure you're setup correctly

### Tasks:
1. How would you refactor this Infrastructure? 
   2. Hint: Create a custom construct, use a single stack, stage & pipeline
2. Can you please ensure The Lambdas only have permission to write to their own logs? 
   3. Hint: Reduce the scope of the resources from all
3. Create a VPC that has access to the internet. Some Lambdas require a consistent IP for interacting with external services
