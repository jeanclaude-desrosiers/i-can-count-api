import express, { NextFunction, Request, Response } from 'express';
import { DatabaseClient } from '../model/db';
import { JWT } from '../model/jwt';
import { User } from '../model/user';

export function restrict_to_user(req: Request, res: Response, next: NextFunction) {
    let auth_header = req.get('Authorization');
    console.log(auth_header);

    if (auth_header) {
        let [bearer, token, ...rest] = auth_header.split(' ');

        if (bearer.toLowerCase() === 'bearer' && rest.length === 0) {
            let db = new DatabaseClient();

            JWT.to_user(db, token)
                .then((user: User | undefined) => {
                    if (user) {
                        console.log('valid!');
                        next();
                    } else {
                        res.status(403).end();
                    }
                })
                .finally(() => db.close());
        } else {
            res.status(403).end();
        }
    } else {
        res.status(403).end();
    }
}