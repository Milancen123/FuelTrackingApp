import { NextResponse } from "next/server";
import { RequestError } from "../http-errors";

export type ResponseType = 'api' | 'server';


const formatResponse= (
    responseType:ResponseType,
    status:number,
    message:string,
    errors?:Record<string, string[]> | undefined
) => {
    const responseContent = {
        success:false,
        error: {
            message,
            details:errors,
        },
    };

    return responseType === 'api'
    ? NextResponse.json(responseContent, {status})
    : {status, ...responseContent};
};

export const handleError = (error:unknown, responseType:ResponseType = 'server') => {
    if (error instanceof RequestError){
        return formatResponse(responseType, error.statusCode, error.message, error.errors);
    }

    if (error instanceof Error) {
        return formatResponse(responseType, 500, error.message);
    }

    return formatResponse(responseType, 500, "An unexpected error occurred");
}