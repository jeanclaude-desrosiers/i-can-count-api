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
                        NOT NULL,

    invalid_logins      TINYINT UNSIGNED
                        NOT NULL
                        DEFAULT 0,
    
    is_locked           TINYINT(1)
                        DEFAULT FALSE,

    locked_date         DATETIME
);