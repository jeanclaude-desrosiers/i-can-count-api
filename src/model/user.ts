import { DatabaseClient } from './db';
import bcrypt from 'bcrypt';
import { application } from '../res/config.json';

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

    /**
     * Creates a single User record.
     * The 'C' in 'CRUD'
     * 
     * @param db 
     * @param username 
     * @param password clear-text password
     * @param is_admin 
     * 
     * @returns The created User if successful, undefined otherwise
     */
    public static create(db: DatabaseClient, username: string,
        password: string, is_admin: boolean = false): Promise<User | undefined> {
        return bcrypt.hash(password, application.bcrypt_rounds)
            .then((hash: string) =>
                db.insert('INSERT INTO user (is_admin, username, passw_hash_salt) VALUES(?, ?, ?)',
                    is_admin, username, hash)
            )
            .then((insert_id: number) => {
                if (typeof insert_id === 'number') {
                    return User.read(db, insert_id);
                } else {
                    return undefined;
                }
            });
    }

    /**
     * Reads a single User record, by uuid.
     * The 'R' in 'CRUD'
     * 
     * @param db 
     * @param uuid 
     * 
     * @returns The User if it exists, undefined otherwise
     */
    public static read(db: DatabaseClient, uuid: number): Promise<User | undefined> {
        return db.select_first<User, UserProperties>(
            'SELECT * FROM user WHERE uuid = ?',
            User.USER_PARSER,
            uuid
        );
    }

    /**
     * Reads all User records.
     * The 'R' in 'CRUD'
     * 
     * @param db 
     * 
     * @returns An array of all User records, potentially empty
     */
    public static read_all(db: DatabaseClient): Promise<User[]> {
        return db.select_all<User, UserProperties>(
            'SELECT * FROM user',
            User.USER_PARSER
        );
    }

    /**
     * Reads a single User record, by username.
     * The 'R' in 'CRUD'
     * 
     * @param db 
     * @param username 
     * 
     * @returns The User if it exists, undefined otherwise
     */
    public static read_by_username(db: DatabaseClient, username: string): Promise<User | undefined> {
        return db.select_first<User, UserProperties>(
            'SELECT * FROM user WHERE username = ?',
            User.USER_PARSER,
            username
        );
    }

    /**
     * Updates a single User record's password.
     * The 'U' in 'CRUD'
     * 
     * @param db 
     * @param new_password clear-text password
     * 
     * @returns The updated User if successful, undefined otherwise
     */
    public update_password(db: DatabaseClient, new_password: string): Promise<User | undefined> {
        return bcrypt.hash(new_password, application.bcrypt_rounds)
            .then((hash: string) => {
                let copy_of_user = new User(this);
                copy_of_user.passw_hash_salt = hash;
                return copy_of_user;
            })
            .then((updated_user: User) => User.update(db, updated_user));
    }

    /**
     * Updates a single User record.
     * The 'U' in 'CRUD'
     * 
     * @param db 
     * @param updated_user 
     * 
     * @returns The updated User if successful, undefined otherwise
     */
    public static update(db: DatabaseClient, updated_user: User): Promise<User | undefined> {
        return db.update_one('UPDATE user SET username = ?, passw_hash_salt = ?, is_admin = ? WHERE uuid = ?',
            updated_user.username, updated_user.passw_hash_salt, updated_user.is_admin, updated_user.uuid)
            .then(success => success ? User.read(db, updated_user.uuid) : undefined);
    }

    /**
     * Deletes a single User record.
     * The 'D' in 'CRUD'
     * 
     * @param db 
     * @param uuid uuid of the User to delete
     * 
     * @returns true if successful, false otherwise
     */
    public static delete(db: DatabaseClient, uuid: number): Promise<boolean> {
        return db.delete_one('DELETE FROM user WHERE uuid = ?', uuid);
    }
}