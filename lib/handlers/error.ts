import {NextResponse} from "next/server";
import {RequestError,ValidationError} from "@/lib/http-errors";
import {ZodError} from "zod";
import logger from "@/lib/logger";

export type ResponseType = 'api'| 'server';

interface ServerResponse {
    status: number;
    success: boolean;
    errors: {
        message: string;
        details?: Record<string, string[]>;
    };
}

const formatResponse = (
    responseType: ResponseType,
    status: number,
    message: string,
    errors?: Record<string , string[]> | undefined,
) => {
    const responseContent = {
        success: false,
        errors: {
            message: message,
            details: errors,
        },
    }
    return responseType === 'api'
        ? NextResponse.json(responseContent, {status})
        : {status, ...responseContent};
}


function handleError(error: unknown, responseType: 'api'): NextResponse;
function handleError(error: unknown, responseType: 'server'): ServerResponse;
function handleError(error: unknown, responseType : ResponseType = 'server'): NextResponse | ServerResponse {
    if (error instanceof RequestError) {
        logger.error({err: error}, `${responseType.toUpperCase()} ${error.message} Error ${error.message}`);
        return formatResponse(responseType,error.statusCode, error.message , error.errors)
    }

    if (error instanceof ZodError) {
        const validationError = new ValidationError(error.flatten().fieldErrors as Record<string, string[]>) ;
        logger.error({err: error}, `Validation Error: ${validationError.message}`)
        return formatResponse(responseType,validationError.statusCode ,validationError.message,validationError.errors)
    }

    if(error instanceof Error) {
        logger.error(error.message)
        return formatResponse(responseType,500,error.message)
    }

    logger.error({err: error} , 'An unexpected error occurred.')
    return formatResponse(responseType,500,"unexpected error occurred.")
}

export default handleError;