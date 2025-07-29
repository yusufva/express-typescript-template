import express, { Router } from 'express';
import { getHello } from '@api/controller/hello.controller';

const router: Router = express.Router();

/* GET /hello */
router.get('/', getHello);

export default router;