import { currentUser, OrderStatus, requireAuth, validateRequest } from '@rtshop/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
// import { OrderCreatedPublisher } from '../events/publishers/orderCreatedPublisher';
import { ItemAttrs } from '../models/item';
import { Order } from '../models/order';
// import { natsWrapper } from '../natsWrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60 * 15;

router.post(
  '/api/orders',
  currentUser,
  requireAuth,
  [
    body('items')
      .isArray({min:1})
      .custom((input: ItemAttrs) => true)
      .withMessage('Invalid items'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    
    const { items } = req.body;

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      items: items.map((item: any) => {
        item._id = item.id;
        return item;
      }),
    });
    await order.save();
    
    // new OrderCreatedPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   status: order.status,
    //   userId: order.userId,
    //   expiresAt: order.expiresAt.toISOString(),
    //   items: order.items,
    // });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };

