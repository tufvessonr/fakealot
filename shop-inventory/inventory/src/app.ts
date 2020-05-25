import { errorHandler, NotFoundError } from '@rtshop/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { CONFIG } from './config';
import { addItemRouter } from './routes/addItem';
import { editItemRouter } from './routes/editItem';
import { getInventoryRouter } from './routes/getInventory';
import { removeItemRouter } from './routes/removeItem';

export const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: !CONFIG.IS_TEST_ENV // supertest defaults to using http instead of https, so secure has to be set to 'false' when running tests
  })
);

app.use(getInventoryRouter);
app.use(addItemRouter);
app.use(editItemRouter);
app.use(removeItemRouter);


app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);