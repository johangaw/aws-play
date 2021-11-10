import * as cdk from '@aws-cdk/core';
import * as gateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb'
import { RemovalPolicy } from '@aws-cdk/core';


export class AwsPlayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const flagsTablePrimaryKey = 'flagId'
    const flagsTable = new Table(this, 'Flags', {
      partitionKey: {
        name: flagsTablePrimaryKey,
        type: AttributeType.STRING
      },
      tableName: 'flags',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const createFlag = new lambda.NodejsFunction(this, 'CreateFlag', {
      entry: 'handlers/create-flag.ts',
      environment: {
        DB_TABLE_NAME: flagsTable.tableName,
        DB_PRIMARY_KEY: flagsTablePrimaryKey,
      }
    });

    const listFlags = new lambda.NodejsFunction(this, 'ListFlags', {
      entry: 'handlers/list-flags.ts',
      environment: {
        DB_TABLE_NAME: flagsTable.tableName,
        DB_PRIMARY_KEY: flagsTablePrimaryKey,
      }
    });

    const api = new gateway.RestApi(this, "FlagAPI")
    const flags = api.root.addResource('flags')
    flags.addMethod('POST', new gateway.LambdaIntegration(createFlag))
    flags.addMethod('GET', new gateway.LambdaIntegration(listFlags))

    flagsTable.grantReadWriteData(createFlag)
    flagsTable.grantReadWriteData(listFlags)
  }
}
