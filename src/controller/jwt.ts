import { Router } from 'express';
import { User } from '../model/user';
import bcrypt from 'bcrypt';
import { DatabaseClient } from '../model/db';
import { application as app_config } from '../res/config.json';
import { JWT } from '../model/jwt';

const router = Router();

router.post('/', (req, res) => {
    let db = new DatabaseClient();
    let { username, password } = req.body;

    User.read_by_username(db, username)
        .then((user: User | undefined) => {
            let passw_hash_salt: string;

            if (user) {
                passw_hash_salt = user.passw_hash_salt;
            } else {
                passw_hash_salt = app_config.bcrypt_time_waster_hash;
            }

            return bcrypt.compare(password, passw_hash_salt)
                .then((success: boolean) => success ? user : undefined);
        })
        .then((user: User | undefined) => user ? JWT.from_user(user) : undefined)
        .then((jwt: string) => res.json({ jwt }))
});

export default router;