import { NextFunction, Request, Response } from 'express';
import { DatabaseClient } from '../model/db';
import { JWT } from '../model/jwt';
import { User } from '../model/user';

/**
 * Middleware function restricting access to requests with a valid JWT token
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export function restrict_to_user(req: Request, res: Response, next: NextFunction) {
    let auth_header = req.get('Authorization');

    if (auth_header) {
        let [bearer, token, ...rest] = auth_header.split(' ');

        if (bearer.toLowerCase() === 'bearer' && rest.length === 0) {
            let db = new DatabaseClient();

            JWT.to_user(db, token)
                .then((user: User | undefined) => {
                    if (user) {
                        next();
                    } else {
                        res.json({ err: 'Invalid JWT' })
                            .status(400).end();
                    }
                })
                .finally(() => db.close());
        } else {
            res.json({ err: 'Malformed Authorization header, expected "Bearer <JWT>"' })
                .status(400).end();
        }
    } else {
        res.json({ err: 'Need a JWT in the Authorization header' })
            .status(401).end();
    }
}