import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';
import { natsWrapper } from '../../natsWrapper';

it('emits an order created event', async () => {
  const item = Item.build({
    name: 'Mr Sheen Automatic Dishwasher Detergent Tablets',
    brand: 'Shield',
    price: 26900,
    quantity: 1,
  });

  await item.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ items: [item] })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
