import { currentUser, errorHandler, NotFoundError } from '@rtshop/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { CONFIG } from './config';
import { createOrderRouter } from './routes/createOrder';
import { deleteOrderRouter } from './routes/deleteOrder';
import { indexOrderRouter } from './routes/index';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: CONFIG.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(createOrderRouter);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

