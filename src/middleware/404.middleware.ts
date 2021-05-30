import HttpException from "../common/httpexception";
import { Request, Response, NextFunction } from "express";

export const NotFoundHandler = (
    _request: Request,
    _response: Response,
    next: NextFunction
) => {
    next(new HttpException(404, "Not found"));
}