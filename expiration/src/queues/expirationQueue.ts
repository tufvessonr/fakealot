import Queue from 'bull';
import { CONFIG } from '../config';
import { ExpirationCompletePublisher } from '../events/publishers/expirationCompletePublisher';
import { natsWrapper } from '../natsWrapper';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: CONFIG.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };

