import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";


export async function handler(
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
    console.log('event 👉', event);

    return {
        body: JSON.stringify({ message: 'Pong' }),
        headers: {'ContentType': 'application/json'},
        statusCode: 200,
    };
}