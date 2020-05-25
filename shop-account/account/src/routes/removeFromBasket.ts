import { currentUser, requireAuth } from '@rtshop/common';
import express, { Request, Response } from 'express';
import { Basket } from '../models/basket';
// import { OrderCancelledPublisher } from '../events/publishers/orderCancelledPublisher';
// import { natsWrapper } from '../natsWrapper';

const router = express.Router();

router.delete(
  '/api/basket/:itemId',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { itemId } = req.params;

    await Basket.findOneAndDelete({
      userId: req.currentUser!.id,
      itemId
    });

    // new OrderCancelledPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   items: order.items,
    // });

    res.status(204).send();
  }
);

export { router as removeFromBasketRouter };

