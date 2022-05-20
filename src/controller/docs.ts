import { Router } from 'express';
import express from 'express';
import path from 'path';

const router = Router();

router.get('/*', express.static(path.join(__dirname, '..', 'public')));

export default router;