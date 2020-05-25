import { OrderStatus } from '@rtshop/common';
import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';
import { Order } from '../../models/order';
import { natsWrapper } from '../../natsWrapper';

it('marks an order as cancelled', async () => {
  const item = Item.build({
    name: 'Mr Sheen Automatic Dishwasher Detergent Tablets',
    brand: 'Shield',
    price: 26900,
    quantity: 1,
  });

  await item.save();

  const user = global.signin();  

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ items: [item] })
    .expect(201);

    
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  const item = Item.build({
    name: 'Mr Sheen Automatic Dishwasher Detergent Tablets',
    brand: 'Shield',
    price: 26900,
    quantity: 1,
  });

  await item.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({items: [item]})
    .expect(201);


  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
