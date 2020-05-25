import { currentUser, requireAuth, validateRequest } from '@rtshop/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
// import { natsWrapper } from '../natsWrapper';
import mongoose from 'mongoose';
// import { OrderCreatedPublisher } from '../events/publishers/orderCreatedPublisher';
import { Basket } from '../models/basket';

const router = express.Router();

router.post(
  '/api/basket',
  currentUser,
  requireAuth,
  [
    body('itemId') 
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Item id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    
    const { itemId } = req.body;
    
    const basket = Basket.build({
      userId: req.currentUser!.id,
      itemId
    });
    await basket.save();
    
    // new OrderCreatedPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   status: order.status,
    //   userId: order.userId,
    //   expiresAt: order.expiresAt.toISOString(),
    //   items: order.items,
    // });

    res.status(201).send(basket);
  }
);

export { router as addToBasketRouter };

