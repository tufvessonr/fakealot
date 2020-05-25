import express, { Request, Response } from 'express';
import { Item } from '../models/item';

const router = express.Router();

router.get('/api/inventory/', async (req: Request, res: Response) => {
   const items = await Item.find();
   res.status(200).send(items);
});

export { router as getInventoryRouter };

