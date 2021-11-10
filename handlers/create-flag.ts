import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";

import { DynamoDB } from 'aws-sdk';
import { randomUUID } from 'crypto';

const dynamo = new DynamoDB.DocumentClient();

const tableName = process.env.DB_TABLE_NAME ?? ''
const primaryKey = process.env.DB_PRIMARY_KEY ?? ''


export async function handler(
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
    console.log('event 👉', event);

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "No body provided" })
        }
    }

    const body = JSON.parse(event.body)
    const flag = { ...body, [primaryKey]: randomUUID() }

    await dynamo.put({ TableName: tableName, Item: flag}).promise()

    return {
        body: JSON.stringify(flag),
        headers: { 'ContentType': 'application/json' },
        statusCode: 200,
    };
}