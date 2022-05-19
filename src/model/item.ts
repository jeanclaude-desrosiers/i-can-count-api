import { DatabaseClient } from './db';

export type ItemProperties = {
    uuid: number,
    id: string,
    name: string,
    description: string,
    default_price: number | undefined,
    default_has_tax: boolean | undefined,
    parent_uuid: number | undefined
};

export class Item {
    public uuid: number;
    public id: string;
    public name: string;
    public description: string;
    public default_price: number | undefined;
    public default_has_tax: boolean | undefined;
    public parent_uuid: number | undefined;

    public constructor({ uuid, id, name, description,
        default_price, default_has_tax, parent_uuid }: ItemProperties) {
        this.uuid = uuid;
        this.id = id;
        this.name = name;
        this.description = description;
        this.default_price = default_price;
        this.default_has_tax = default_has_tax;
        this.parent_uuid = parent_uuid;
    }

    private static ITEM_PARSER = (item_properties: ItemProperties) => new Item(item_properties);

    /**
     * Creates a single Item record.
     * The 'C' in 'CRUD'
     * 
     * @param db 
     * @param item_properties uuid is ignored if present
     * 
     * @returns The created Item if successful, undefined otherwise
     */
    public static create(db: DatabaseClient, item_properties: ItemProperties): Promise<Item | undefined> {
        let { id, name, description, default_price, default_has_tax, parent_uuid } = item_properties;

        return db.insert('INSERT INTO item (id, name, description, default_price, default_has_tax, parent_uuid) '
            + 'VALUES (?, ?, ?, ?, ?, ?)', id, name, description, default_price, default_has_tax, parent_uuid)
            .then((insert_id: number) => {
                if (typeof insert_id === 'number') {
                    return Item.read(db, insert_id);
                }
            })
    }

    /**
     * Reads a single Item record, by uuid.
     * The 'R' in 'CRUD'
     * 
     * @param db 
     * @param uuid
     * 
     * @returns The Item if it exists, undefined otherwise
     */
    public static read(db: DatabaseClient, uuid: number): Promise<Item | undefined> {
        return db.select_first('SELECT * FROM item WHERE uuid = ?', Item.ITEM_PARSER, uuid);
    }

    /**
     * Updates a single Item record.
     * The 'U' in 'CRUD'
     * 
     * @param db 
     * @param updated_item 
     * 
     * @returns The updated Item if successful, undefined otherwise
     */
    public static update(db: DatabaseClient, updated_item: Item): Promise<Item | undefined> {
        let { uuid, id, name, description, default_price, default_has_tax, parent_uuid } = updated_item;

        return db.update_one('UPDATE item SET id = ?, name = ?, description = ?, ' +
            'default_price = ?, default_has_tax = ?, parent_uui = ? WHERE uuid = ?',
            id, name, description, default_price, default_has_tax, parent_uuid, uuid)
            .then((success: boolean) => success ? Item.read(db, uuid) : undefined);
    }

    /**
     * Deletes a single Item record.
     * The 'D' in 'CRUD'
     * 
     * @param db 
     * @param uuid uuid of the Item to delete
     * 
     * @returns true if successful, false otherwise
     */
    public static delete(db: DatabaseClient, uuid: number): Promise<boolean> {
        return db.delete_one('DELETE FROM item WHERE uuid = ?', uuid);
    }
}