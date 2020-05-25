import { currentUser, requireAuth } from '@rtshop/common';
import express, { Request, Response } from 'express';
// import { OrderCancelledPublisher } from '../events/publishers/orderCancelledPublisher';
import { WishList } from '../models/wishlist';
// import { natsWrapper } from '../natsWrapper';

const router = express.Router();

router.delete(
  '/api/wishlist/:itemId',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { itemId } = req.params;

    await WishList.findOneAndDelete({
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

export { router as removeFromWishListRouter };

