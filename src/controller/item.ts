import { Router } from 'express';
import { DatabaseClient } from '../model/db';
import { restrict_to_user } from '../middleware/access';
import { Item } from '../model/item';

const router = Router();

router.use(restrict_to_user);

router.get('/', (req, res) => {
    let db = new DatabaseClient();

    Item.read_all(db)
        .then((items: Item[]) => res.json(items))
        .finally(() => db.close());
});

router.get('/:uuid(\\d+)', (req, res) => {
    let db = new DatabaseClient();
    let uuid = Number.parseInt(req.params.uuid)

    if (uuid !== NaN) {
        Item.read(db, uuid)
            .then((item: Item | undefined) => {
                if (item) {
                    res.json(item);
                } else {
                    res.json({ err: `Item with uuid (${uuid}) not found` })
                        .status(404).end();
                }
            })
            .finally(() => db.close());
    } else {
        res.json({ err: 'Required "uuid" parameter missing' })
            .status(400).end();
    }
});

export default router;