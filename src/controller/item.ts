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

export default router;