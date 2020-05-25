import { currentUser, NotFoundError, requireAuth } from '@rtshop/common';
import express, { Request, Response } from 'express';
import { Item } from '../models/item';

const router = express.Router();

router.delete(
  '/api/inventory/remove/:itemId',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {    
    const { itemId: id } = req.params;

    const deletedItem = await Item.findByIdAndDelete(id);    
    if(!deletedItem){      
      throw new NotFoundError();
    }

    res.status(204).send();
    
  }
);

export { router as removeItemRouter };

