import mongoose from 'mongoose';
import { app } from './app';
import { CONFIG } from './config';
import { ExpirationCompleteListener } from './events/listeners/expirationCompleteListener';
import { PaymentCreatedListener } from './events/listeners/paymentCreatedListener';
import { natsWrapper } from './natsWrapper';

const start = async () => {
  try {
    await natsWrapper.connect(
      CONFIG.NATS_CLUSTER_ID,
      CONFIG.NATS_CLIENT_ID,
      CONFIG.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(CONFIG.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
