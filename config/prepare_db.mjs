import mysql from 'mysql2';
import fs_promises from 'fs/promises';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import path from 'path';
import { string_question, password_question } from "./utils.mjs";

/* https://stackoverflow.com/a/64383997 */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SQL_FILES = [
    "user.sql", "invoice_category.sql", "invoice.sql",
    "invoice_item.sql", "item.sql", "tax.sql"
];

function create_account({ db, bcrypt_rounds, is_admin = false }) {
    let username = string_question({
        msg: is_admin ? "Admin username" : "Username",
        default_value: is_admin ? "admin" : `u_${crypto.randomBytes(4).toString('hex')}`
    });

    let password = password_question({
        msg: is_admin ? "Admin password" : "Password"
    });

    return bcrypt.hash(password, bcrypt_rounds)
        .then(hash =>
            db.query('INSERT INTO user (is_admin, username, passw_hash_salt) VALUES(?, ?, ?)',
                [is_admin, username, hash])
        );
}

/**
 * Helper function to execute an SQL file async
 * 
 * @param {object} param
 * @param {Connection} param.db
 * @param {string} param.sql name of the sql file, not its path
 * 
 * @returns a promise
 */
function exec_sql_file({ db, sql }) {
    return () => fs_promises
        .readFile(path.join(__dirname, 'sql', sql), 'utf-8')
        .then(sql_commands => db.query(sql_commands));
}

/**
 * 
 * @param {object} param 
 * @param {string} param.host
 * @param {string} param.username
 * @param {string} param.password
 * @param {string} param.name
 * @param {number} param.port
 * @param {number} param.bcrypt_rounds
 * 
 */
export default function prepare_db({ host, username, password, name, port, bcrypt_rounds }) {
    let db = mysql.createConnection({
        host,
        port,
        user: username,
        password,
        database: name,
        multipleStatements: true
    }).promise();

    let promise_chain = new Promise(res => res());

    SQL_FILES.forEach(sql => {
        promise_chain =
            promise_chain.then(exec_sql_file({ db, sql }));
    });

    promise_chain = promise_chain.then(() =>
        console.log("Executed the sql scripts!\n"))

    promise_chain = promise_chain.then(() =>
        create_account({ db, bcrypt_rounds, is_admin: true }));

    return promise_chain.finally(() => db && db.end());
}