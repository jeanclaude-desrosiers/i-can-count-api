/**
 * Item; a good/service that can be exchanged
 * for money, or vice-versa
 */
CREATE TABLE IF NOT EXISTS item (
    uuid                SERIAL
                        PRIMARY KEY,

    id                  VARCHAR(63)
                        NOT NULL
                        UNIQUE,

    name                VARCHAR(63)
                        NOT NULL,

    description         TEXT,

    default_price       DECIMAL(8,2),

    default_has_tax     BIT(1),

    parent_uuid         BIGINT UNSIGNED
                        REFERENCES item(uuid)
                        ON DELETE SET NULL
                        ON UPDATE CASCADE
);