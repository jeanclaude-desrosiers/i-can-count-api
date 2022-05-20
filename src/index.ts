import express from 'express';
import { application as app_config } from './res/config.json';
import jwt from './controller/jwt';
import item from './controller/item';

const app = express();

app.use(express.json());

app.use('/jwt', jwt);
app.use('/item', item);

app.listen(app_config.port, () =>
    console.log(`App listening on port ${app_config.port}`)
);