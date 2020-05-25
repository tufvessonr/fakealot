import { currentUser, requireAuth } from '@rtshop/common';
import express, { Request, Response } from 'express';
import { Basket } from '../models/basket';

const router = express.Router();

router.get(
  '/api/basket',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const basket = await Basket.find({
      userId: req.currentUser!.id,
    });

    res.send(basket);
  }
);

export { router as getBasketRouter };

