import Order from "../domain/order.entity";

export default interface CheckoutGateway {
  addOrder(order: Order): Promise<void>;
  findOrderById(id: string): Promise<Order | null>;
}
