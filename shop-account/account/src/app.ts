import { currentUser, errorHandler, NotFoundError } from '@rtshop/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { CONFIG } from './config';
import { addToBasketRouter } from './routes/addToBasket';
import { addToWishListRouter } from './routes/addToWishList';
import { getBasketRouter } from './routes/getBasket';
import { getWishListRouter } from './routes/getWishList';
import { removeFromBasketRouter } from './routes/removeFromBasket';
import { removeFromWishListRouter } from './routes/removeFromWishList';


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

app.use(getBasketRouter);
app.use(getWishListRouter);
app.use(addToBasketRouter);
app.use(addToWishListRouter);
app.use(removeFromBasketRouter);
app.use(removeFromWishListRouter);


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

