/**
 * account for users of the system
 */
CREATE TABLE IF NOT EXISTS user (
    uuid                SERIAL
                        PRIMARY KEY,
    
    is_admin            TINYINT(1)
                        DEFAULT FALSE,

    username            VARCHAR(63)
                        NOT NULL
                        UNIQUE,

    passw_hash_salt     CHAR(60)
                        NOT NULL
);