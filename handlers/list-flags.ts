import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";

import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();


export async function handler(
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
    console.log('event 👉', event);

    const flags = await dynamo.scan({TableName: process.env.DB_TABLE_NAME ?? ''}).promise()

    return {
        body: JSON.stringify({ flags: flags.Items }),
        headers: { 'ContentType': 'application/json' },
        statusCode: 200,
    };
}