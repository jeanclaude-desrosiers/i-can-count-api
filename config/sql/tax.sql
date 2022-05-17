/**
 * Tax; the rates and names for different taxes.
 * Updates to their rates are time-sensitive
 */
CREATE TABLE IF NOT EXISTS tax (
    uuid                SERIAL
                        PRIMARY KEY,

    name                VARCHAR(63)
                        NOT NULL,
    
    rate                DECIMAL(5,4)
                        NOT NULL,
    
    active_from         DATETIME
                        NOT NULL
                        DEFAULT CURRENT_TIMESTAMP,
    
    active_until        DATETIME
                        NOT NULL
);