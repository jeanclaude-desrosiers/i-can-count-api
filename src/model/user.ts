import { DatabaseClient } from './db';
import bcrypt from 'bcrypt';
import { application } from '../res/config.json';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export type UserProperties = {
    uuid: number,
    is_admin: boolean,
    username: string,
    passw_hash_salt: string
};

export class User {
    public uuid: number;
    public is_admin: boolean;
    public username: string;
    public passw_hash_salt: string;

    public constructor({ uuid, is_admin = false, username, passw_hash_salt }: UserProperties) {
        this.uuid = uuid;
        this.is_admin = is_admin;
        this.username = username;
        this.passw_hash_salt = passw_hash_salt;
    }

    private static USER_PARSER = (user_properties: UserProperties) => new User(user_properties);

    private static select_by_uuid(db: DatabaseClient, uuid: number): Promise<User | undefined> {
        return db.select_first<User, UserProperties>(
            'SELECT * FROM user WHERE uuid = ?',
            User.USER_PARSER,
            uuid
        );
    }

    public static select_by_username(db: DatabaseClient, username: string): Promise<User | undefined> {
        return db.select_first<User, UserProperties>(
            'SELECT * FROM user WHERE username = ?',
            User.USER_PARSER,
            username
        );
    }

    public static create(db: DatabaseClient, username: string,
        password: string, is_admin: boolean = false): Promise<User | undefined> {
        return bcrypt.hash(password, application.bcrypt_rounds)
            .then((hash: string) =>
                db.insert('INSERT INTO user (is_admin, username, passw_hash_salt) VALUES(?, ?, ?)',
                    is_admin, username, hash)
            )
            .then((insert_id: number) => {
                if (typeof insert_id === 'number') {
                    return User.select_by_uuid(db, insert_id);
                } else {
                    return undefined;
                }
            });
    }
}