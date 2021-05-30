import HttpException from "../common/httpexception";
import { Request, Response, NextFunction } from "express";

export const ErrorHandler = (
    error: HttpException,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const status = error.statusCode || error.status || 500;

    response.status(status).send(error);
};