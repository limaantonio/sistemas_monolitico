import Id from "../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacade from "../../invoice/facade/invoice.facade";
import InvoiceFacadeInterface from "../../invoice/facade/invoice.facade.interface";
import GenerateInvoiceFacadeInterface from "../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../payment/facade/facade.interface";
import ProductAdmFacade from "../../product-adm/facade/product-adm.facade";
import StoreCatalogFacadeInterface from "../../store-catalog/facade/store-catalog.facade.interface";
import { Client } from "../domain/client.entity";
import Order from "../domain/order.entity";
import { Product } from "../domain/produt.entity";
import CheckoutGateway from "../gateway/checkout.gateway";

import { PlaceOrderInputDTO, PlaceOrderOutputDTO } from "./place-oder.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacade;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _repository: CheckoutGateway;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;
  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacade,
    catalogFacade: StoreCatalogFacadeInterface,
    repository: CheckoutGateway,
    invoiceFacade: GenerateInvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._repository = repository;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
  }

  async execute(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }
    await this._validateProducts(input);

    const products = await Promise.all(
      input.products.map(async (p) => await this._getProduct(p.productId))
    );

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
    });

    const order = new Order({
      client: myClient,
      products,
    });

    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    const invoice =
      payment.status === "aproved"
        ? await this._invoiceFacade.process({
            name: client.name,
            document: client.document,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            items: order.products.map((p) => {
              return {
                id: p.id.id,
                name: p.name,
                price: p.salesPrice,
              };
            }),
          })
        : null;

    payment.status === "aproved" && order.approved();
    this._repository.addOrder(order);

    //recuperar os produtos
    //criar o objeto do cliente
    //criar o objeto do oder (client, products)
    //processpayment -> paymentface.processs (orderid, amout)
    //caso pagamento aprovado -> gerar invoice
    //mudar o status da order para aproved
    //retornar dto

    return {
      id: order.id.id,
      invoiceId: payment.status === "aproved" ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => {
        return {
          productId: p.id.id,
        };
      }),
    };
  }

  private async _validateProducts(input: PlaceOrderInputDTO): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const p of input.products) {
      const stock = await this._productFacade.checkStock({
        productId: p.productId,
      });
      if (stock.stock <= 0) {
        throw new Error(`Product ${p.productId} is not available in stock`);
      }
    }
  }

  private async _getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId });
    if (!product) {
      throw new Error(`Product not found`);
    }
    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
    return new Product(productProps);
  }
}
