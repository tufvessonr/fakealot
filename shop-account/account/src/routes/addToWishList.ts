import { currentUser, requireAuth, validateRequest } from '@rtshop/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
// import { natsWrapper } from '../natsWrapper';
import mongoose from 'mongoose';
import { WishList } from '../models/wishlist';

const router = express.Router();

router.post(
  '/api/wishlist',
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
    
    const wishListItem = WishList.build({
      userId: req.currentUser!.id,
      itemId,

    });
    await wishListItem.save();
    
    // new OrderCreatedPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   status: order.status,
    //   userId: order.userId,
    //   expiresAt: order.expiresAt.toISOString(),
    //   items: order.items,
    // });

    res.status(201).send(wishListItem);
  }
);

export { router as addToWishListRouter };

