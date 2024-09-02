import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

const userHeader = 'x-user';

export function addUserToRequest(req: Request, user: JwtPayload) {
    req.headers[userHeader] = JSON.stringify(user);
}

export function getUserFromRequest(req: Request): JwtPayload | undefined {
    if (req.headers && req.headers[userHeader]) {
        return JSON.parse(req.headers[userHeader] as string) as JwtPayload
    }
}