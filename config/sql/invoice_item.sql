/**
 * Join table between invoice and item
 */
CREATE TABLE IF NOT EXISTS invoice_item (
    invoice     BIGINT UNSIGNED
                NOT NULL
                REFERENCES invoice(uuid)
                ON DELETE CASCADE
                ON UPDATE CASCADE,

    item        BIGINT UNSIGNED
                NOT NULL
                REFERENCES item(uuid)
                ON DELETE RESTRICT
                ON UPDATE CASCADE,
    
    quantity    SMALLINT UNSIGNED
                NOT NULL
                DEFAULT 1,

    unit_price  DECIMAL(8,2)
                NOT NULL,

    has_tax     BIT(1)
                NOT NULL
);