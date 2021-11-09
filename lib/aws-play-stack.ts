import * as cdk from '@aws-cdk/core';
// import * as s3 from '@aws-cdk/aws-s3';
import * as gateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';



// import * as sqs from '@aws-cdk/aws-sqs';

export class AwsPlayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const pingHandler = new lambda.Function(this, 'PingHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'ping.handler',
      code: lambda.Code.fromAsset('handlers'),
    });
    
    
    const api = new gateway.RestApi(this, "PingAPI")
    api.root.addMethod('GET', new gateway.LambdaIntegration(pingHandler))


    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsPlayQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
