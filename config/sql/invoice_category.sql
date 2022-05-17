/**
 * Invoice Category; this could be the company/group
 * to which an invoice belongs. Exists as a way of
 * grouping invoices
 */
CREATE TABLE IF NOT EXISTS invoice_category (
    uuid            SERIAL
                    PRIMARY KEY,

    name            VARCHAR(63)
                    NOT NULL
);