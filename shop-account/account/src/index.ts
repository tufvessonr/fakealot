import mongoose from 'mongoose';
import { app } from './app';
import { CONFIG } from './config';
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
