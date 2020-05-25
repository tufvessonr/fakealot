import { currentUser, requireAuth } from '@rtshop/common';
import express, { Request, Response } from 'express';
import { WishList } from '../models/wishlist';

const router = express.Router();

router.get(
  '/api/wishlist',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const wishList = await WishList.find({
      userId: req.currentUser!.id
    });

    res.send(wishList);
  }
);

export { router as getWishListRouter };

