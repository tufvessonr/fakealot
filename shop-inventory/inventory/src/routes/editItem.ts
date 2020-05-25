import { currentUser, NotFoundError, requireAuth, validateRequest } from '@rtshop/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import lodash from 'lodash';
import { Item } from '../models/item';

const router = express.Router();

router.post(
  '/api/inventory/edit',
  currentUser,
  requireAuth,
  [
    body('id').not().isEmpty().withMessage('Id required'),
    body('name').isString().optional(),
    body('description').isString().optional(),
    body('brand').isString().optional(),
    body('quantity').isNumeric().optional(),
    body('price').isNumeric().optional(),
    body('discountFixed').isNumeric().optional(),
    body('discountPercentage').isNumeric().optional(),
    body('images').isArray().optional(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      id,
      name,
      description,
      brand,
      quantity,
      price,
      discountFixed,
      discountPercentage,
      images,
    } = req.body;

    const existingItem = await Item.findById(id);
    if (!existingItem) {
      throw new NotFoundError();
    }

    const updateValues = lodash.pickBy(
      {
        name,
        description,
        brand,
        quantity,
        price,
        discountFixed,
        discountPercentage,
        images,
      },
      (value) => value
    );

    Object.assign(existingItem, updateValues);

    await existingItem.save();

    res.status(200).send(existingItem);
  }
);

export { router as editItemRouter };

