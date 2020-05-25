import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from '@rtshop/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/orderCancelledPublisher';
import { queueGroupName } from './queueGroupName';

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  queueGroupName = queueGroupName;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('items');

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      items: order.items
    });

    msg.ack();
  }
}
