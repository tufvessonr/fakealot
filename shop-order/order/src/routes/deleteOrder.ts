import { currentUser, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@rtshop/common';
import express, { Request, Response } from 'express';
// import { OrderCancelledPublisher } from '../events/publishers/orderCancelledPublisher';
import { Order } from '../models/order';
// import { natsWrapper } from '../natsWrapper';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('items');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // new OrderCancelledPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   items: order.items,
    // });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };

