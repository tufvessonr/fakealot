import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';

const buildItem = async (name: string, brand: string, price: number, quantity: number) => {
  const item = Item.build({
    name,
    brand,
    price,
    quantity,
  });

  await item.save();

  return item;
};

it('fetches orders for an particular user', async () => {
  const itemOne = await buildItem('Mr Sheen Automatic Dishwasher Detergent Tablets', 'shield', 26900, 1);
  const itemTwo = await buildItem('Air Conditioning Treatment - Fogger', 'shield', 3200, 1);
  const itemThree = await buildItem('Upholstery Cleaner with Bristles', 'shield', 3700, 1);
  const itemFour = await buildItem('Tyre Shine Silicone', 'shield', 3800, 1);

  const userOne = global.signin();
  const userTwo = global.signin();

  // User one
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ items: [itemOne] })
    .expect(201);


  // User two
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ items: [itemTwo]})
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ items: [itemThree, itemFour]})
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);  
  
  expect(response.body[0].items[0].id).toEqual(itemTwo.id);
  expect(response.body[1].items[0].id).toEqual(itemThree.id);
  expect(response.body[1].items[1].id).toEqual(itemFour.id);
});
