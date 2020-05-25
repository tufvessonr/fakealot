import { OrderCancelledEvent, Publisher, Subjects } from '@rtshop/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
