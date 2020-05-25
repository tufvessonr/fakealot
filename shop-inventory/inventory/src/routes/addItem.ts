import { BadRequestError, currentUser, requireAuth, validateRequest } from '@rtshop/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Item } from '../models/item';

const router = express.Router();

router.post(
  '/api/inventory/add',
  currentUser,
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Name required'),
    body('description').not().isEmpty().withMessage('Description required'),
    body('brand').not().isEmpty().withMessage('Brand required'),
    body('quantity').isNumeric().optional(),
    body('price').isNumeric().exists().withMessage('Price required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {     
    console.log(req.body);

    
    const { name, description, brand, quantity, price, discountFixed, discountPercentage, images } = req.body;

    try {
      const existingItem = await Item.findOne({name, brand});
      if(existingItem){      
        throw new BadRequestError('Item already exists')
      }
      
      const item = Item.build({
        name,
        description,
        brand,
        quantity,
        price,
        discountFixed,
        discountPercentage,
        images
      });
  
      await item.save();
  
      res.status(201).send(item);
      
    } catch (error) {
      console.log(error);
      
      res.status(500).send(error);
    }
    
  }
);

export { router as addItemRouter };

