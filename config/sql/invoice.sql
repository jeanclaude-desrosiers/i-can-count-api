/**
 * Invoice; confirmation of a transaction
 * an exchange of a set of goods/services
 * for money, or vice-versa
 */
CREATE TABLE IF NOT EXISTS invoice (
    uuid                SERIAL
                        PRIMARY KEY,

    id                  VARCHAR(63)
                        NOT NULL
                        UNIQUE,
    
    is_sell             TINYINT(1)
                        NOT NULL,

    category            BIGINT UNSIGNED
                        NOT NULL
                        REFERENCES invoice_category(uuid)
                        ON DELETE RESTRICT
                        ON UPDATE CASCADE,

    transaction_date    DATETIME
                        NOT NULL
                        DEFAULT CURRENT_TIMESTAMP
);