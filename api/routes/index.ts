import express, { Router, Request, Response, NextFunction } from 'express';
import helloRouter from './hello';

const router: Router = express.Router();

/* GET home page. */
router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  // This assumes you have a view engine (like Pug or EJS) set up.
  res.render('index', { title: 'Express' });
});

router.use('/hello', helloRouter);

export default router;