import { OrderCreatedEvent, Publisher, Subjects } from '@rtshop/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
