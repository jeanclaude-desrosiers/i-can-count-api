import { User } from "./user";
import fs from 'fs/promises';
import path from 'path';
import { importSPKI, SignJWT, jwtVerify, KeyLike, importPKCS8, JWTVerifyResult } from "jose";
import { DatabaseClient } from "./db";

const RSA_PRIV_PATH = path.join(__dirname, '..', 'res', 'rsa.priv.pem');
const RSA_PUB_PATH = path.join(__dirname, '..', 'res', 'rsa.pub.pem');
const ISSUER = 'icancount'

export class JWT {

    public static from_user(user: User): Promise<string> {
        return fs.readFile(RSA_PRIV_PATH, 'utf-8')
            .then((rsa_priv_str: string) => importPKCS8(rsa_priv_str, 'RS256'))
            .then((priv_key: KeyLike) => {
                return new SignJWT({ uuid: user.uuid })
                    .setProtectedHeader({ alg: 'RS256' })
                    .setIssuedAt()
                    .setIssuer(ISSUER)
                    .setExpirationTime('5h')
                    .sign(priv_key);
            })
    }

    public static to_user(db: DatabaseClient, jwt: string): Promise<User | undefined> {
        return fs.readFile(RSA_PUB_PATH, 'utf-8')
            .then((rsa_pub_str: string) => importSPKI(rsa_pub_str, 'RS256'))
            .then((pub_key: KeyLike) => jwtVerify(jwt, pub_key, { issuer: ISSUER }))
            .then((result: JWTVerifyResult) => result.payload.uuid as number)
            .then((uuid: number) => User.read(db, uuid))
    }
}