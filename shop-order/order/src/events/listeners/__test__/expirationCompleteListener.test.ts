import { ExpirationCompleteEvent, OrderStatus } from '@rtshop/common';
import { Message } from 'node-nats-streaming';
import { Item } from '../../../models/item';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../natsWrapper';
import { ExpirationCompleteListener } from '../expirationCompleteListener';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const item = Item.build({
    name: 'Mr Sheen Automatic Dishwasher Detergent Tablets',
    brand: 'Shield',
    price: 26900,
    quantity: 1,
  });

  await item.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'alskdfj',
    expiresAt: new Date(),
    items: [item],
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, item, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
