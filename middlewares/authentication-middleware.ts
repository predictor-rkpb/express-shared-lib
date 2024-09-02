import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { addUserToRequest } from '../utilities/user-management';

var certificate: string | undefined = undefined

export class AuthenticationMiddleware {
    public authenticate(req: Request, res: Response, next: NextFunction) {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, getKey, {
                algorithms: ['RS256'],
                audience: process.env.KEYCLOAK_AUDIENCE,
                issuer: process.env.KEYCLOAK_ISSUER_URL,
            }, (err, decoded) => {
                if (err) {
                    res.sendStatus(401);
                } else {
                    addUserToRequest(req, decoded as JwtPayload);
                    next();
                }
            });
        } else {
            res.sendStatus(401);
        }
    }
}

function getKey(header: JwtHeader, callback: SigningKeyCallback) {
    if (certificate) {
        callback(null, certificate);
    } else {
        // make a get request using axios to get the public key
        axios.get(process.env.KEYCLOAK_ISSUER_URL as string).then((res: AxiosResponse<any, any>) => {
            certificate = `-----BEGIN PUBLIC KEY-----\n${res.data.public_key}\n-----END PUBLIC KEY-----`;
            callback(null, certificate);
        }, (err) => {
            callback(err);
        })
    }
}