import { userInfo } from 'os';
import mysql from 'mysql2';
import { exit } from 'process';
import { confirm_config, string_question, password_question } from "./utils.mjs";

const default_database_host = '127.0.0.1';
const default_database_username = userInfo().username;
const default_database_name = 'i_can_count';
const default_database_port = '3306';

/**
 * Gets the user input for the value of database parameters
 * 
 * @returns user-chosen paramater values
 */
function get_user_input() {
    let host = string_question({
        msg: "Database host name",
        default_value: default_database_host
    });

    let username = string_question({
        msg: "Database username",
        default_value: default_database_username
    });

    let password = password_question({
        msg: "Database password"
    });

    let name = string_question({
        msg: "Database name",
        default_value: default_database_name
    });

    let port = string_question({
        msg: "Database port",
        default_value: default_database_port
    });
    port = Number.parseInt(port);

    return { host, username, password, name, port };
}

/**
 * Tests the user-chosen database configuration
 * 
 * @param {object} config 
 * 
 * @returns an error if one occurs, undefined otherwise
 */
async function test_database_config(config) {
    let error;

    let database_connection;
    try {
        database_connection = mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.username,
            password: config.password,
            database: config.name
        }).promise();

        await database_connection.ping();
    } catch (exc) {
        error = exc;
    } finally {
        if (database_connection) {
            database_connection.end();
        }
    }

    return error;
}

/**
 * Gets the database configuration from the user. Tests it as well
 * 
 * @returns {{
 *      host: string,
 *      username: string,
 *      password: string,
 *      name: string,
 *      port: number
 * }}
 */
export default async function get_database_config() {
    let database_config = {};

    /* Ask database parameters until user confirms */
    do {
        database_config = get_user_input();
    } while (!confirm_config(database_config));

    console.log('\nTesting database connection...')
    let error = await test_database_config(database_config);
    if (error) {
        console.error(`\nCould not connect to database :\n${error}\n`);

        console.log('Exiting\n');
        exit(1);
    } else {
        console.log('Connection successful!\n');
    }

    return database_config;
}