import { CONFIG } from './config';
import { OrderCreatedListener } from './events/listeners/orderCreatedListener';
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

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
