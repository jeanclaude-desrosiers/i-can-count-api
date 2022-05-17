import mysql from 'mysql2';
import mysql_promise, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { database } from '../res/config.json';

const connection_options: mysql.ConnectionOptions = {
    host: database.host,
    port: database.port,
    user: database.username,
    password: database.password,
    database: database.name,
    timezone: 'local',
    dateStrings: true
};

export class DatabaseClient {
    private connection: mysql_promise.Connection;

    public constructor() {
        this.connection = mysql.createConnection(connection_options).promise();
    }

    public query(query: string, ...args: any[]) {
        return this.connection.query(query, args);
    }

    public select_first<T, T_Properties>(query: string, parse: (properties: T_Properties) => T, ...args: any[]): Promise<T | undefined> {
        return this.query(query, args)
            .then(result => {
                let row_result = (result[0] as RowDataPacket);
                if (Array.isArray(row_result) && row_result.length > 0) {
                    let properties = (row_result[0] as T_Properties);

                    return parse(properties);
                }
            });
    }

    public select_all<T, T_Properties>(query: string, parse: (properties: T_Properties) => T, ...args: any[]): Promise<T[]> {
        return this.query(query, args)
            .then(result => {
                let row_result = (result[0] as RowDataPacket);
                if (Array.isArray(row_result) && row_result.length > 0) {
                    return row_result.map(result => parse(result as T_Properties));
                } else {
                    return [];
                }
            });
    }

    public insert(query: string, ...args: any[]): Promise<number | undefined> {
        return this.query(query, args)
            .then(result => (result[0] as ResultSetHeader).insertId);
    }

    public update_one(query: string, args: any[]): Promise<boolean> {
        return this.connection.beginTransaction()
            .then(() => this.query(query, args))
            .then(result => {
                let affected_rows = (result[0] as ResultSetHeader).affectedRows;

                if (affected_rows === 1) {
                    return this.connection.commit().then(() => true);
                } else {
                    return this.connection.rollback().then(() => false);
                }
            })
    }

    public delete_one(query: string, args: any[]): Promise<boolean> {
        return this.update_one(query, args);
    }

    close() {
        return this.connection.end();
    }
}