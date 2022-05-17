import fs from 'fs';
import { exit } from 'process';
import path from 'path';
import get_database_config from './config_db.mjs';
import get_application_config from './config_app.mjs';
import prepare_db from './prepare_db.mjs';

/* https://stackoverflow.com/a/64383997 */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG = {};

console.log('==========================');
console.log('= Database Configuration =');
console.log('==========================\n');

CONFIG.database = await get_database_config();

console.log('=============================');
console.log('= Application Configuration =');
console.log('=============================\n');

CONFIG.application = get_application_config();

try {
    fs.writeFileSync(
        path.join(__dirname, '..', 'src', 'config.json'),
        JSON.stringify(CONFIG, null, 4)
    );

    console.log("\nWrote the configuration to file!\n");
} catch (exc) {
    console.error(`\nCould not write configuration to file :\n${exc}\n`);

    console.log('Exiting\n');
    exit(1);
}

console.log('========================');
console.log('= Database Preparation =');
console.log('========================\n');

prepare_db({
    ...CONFIG.database,
    bcrypt_rounds: CONFIG.application.bcrypt_rounds
})
    .then(() => console.log("\nFinished preparing the DB!\n"))
    .catch(exc => console.error(`\nCould not prepare DB :\n${exc}\n`));