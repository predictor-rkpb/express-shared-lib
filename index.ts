import express, { Request, Response, NextFunction } from 'express';

export interface RequestWithBody<T> extends Request {
    body: T
}

export { AuthenticationMiddleware } from './middlewares/authentication-middleware'
export { getUserFromRequest } from './utilities/user-management'