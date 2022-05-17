import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { hrtime } from 'process';
import { confirm_config, string_question } from "./utils.mjs";

const default_bcrypt_delay_ms = '250';
const default_application_port = '8080';

function get_application_port() {
    let app_port = string_question({
        msg: "Application port",
        default_value: default_application_port
    });

    return Number.parseInt(app_port);
}

function get_bcrypt_rounds() {
    let expected_delay = string_question({
        msg: "Encryption delay in ms",
        default_value: default_bcrypt_delay_ms
    });
    expected_delay = Number.parseInt(expected_delay);

    let rounds = 0, delay_ms = 0;

    while (delay_ms < expected_delay) {
        delay_ms = 0;
        rounds++;

        for (let i = 0; i < 3; i++) {
            let actual_delay_ms = benchmark_bcrypt_time_cost(rounds);
            /* 
             * Cumulative average, see :
             * https://en.wikipedia.org/wiki/Moving_average#Cumulative_average
             */
            delay_ms += (actual_delay_ms - delay_ms) / (i + 1);
        }

        console.log(`${rounds} rounds(s)\t = ${Math.round(delay_ms)}ms\n`);
    }

    rounds = string_question({
        msg: "How many rounds",
        default_value: rounds
    });

    return Number.parseInt(rounds);
}

/**
 * Benchmarks the time it takes to hash a password using bcrypt,
 * with the given number of rounds, on the current machine
 * 
 * @param rounds 
 * @returns the number of milliseconds it took to hash
 */
function benchmark_bcrypt_time_cost(rounds) {
    const start = hrtime.bigint();

    bcrypt.hashSync('my_benchmark_password', rounds);

    const end = hrtime.bigint();

    return Number((end - start) / 1_000_000n);
}

/**
 * Gets the application configuration from the user
 * 
 * @returns {{
 *      bcrypt_rounds: number,
 *      bcrypt_time_waster_hash: string,
 *      port: number
 * }}
 */
export default function get_application_config() {
    let application_config = {};
    do {
        let bcrypt_rounds = get_bcrypt_rounds();

        let bcrypt_time_waster =
            crypto.randomBytes(32).toString('hex')
        let bcrypt_time_waster_hash =
            bcrypt.hashSync(bcrypt_time_waster, bcrypt_rounds);

        let port = get_application_port();

        application_config = {
            bcrypt_rounds,
            bcrypt_time_waster_hash,
            port
        };
    } while (!confirm_config(application_config));

    return application_config;
}