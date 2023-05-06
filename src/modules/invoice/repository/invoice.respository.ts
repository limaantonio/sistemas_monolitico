import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice_item";
import Address from "../domain/value-object/address";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<Invoice> {
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item: any) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total(),
    });
    return new Invoice({
      id: invoice.id,
      name: invoice.name,
      document: invoice.document,
      address: invoice.address,
      items: invoice.items,
      total: invoice.total(),
    });
  }

  async find(id: any): Promise<Invoice> {
    let invoiceModel;
    try {
      invoiceModel = await InvoiceModel.findOne({
        where: { id },
        include: [InvoiceItemModel],
      });
    } catch (error) {
      throw new Error("Invoice not found");
    }

    const invoiceItems = invoiceModel.items.map((item) => {
      return new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      });
    });

    const invoice = new Invoice({
      id: new Id(invoiceModel.id),
      name: invoiceModel.name,
      document: invoiceModel.document,
      address: new Address(
        invoiceModel.street,
        invoiceModel.number,
        invoiceModel.complement,
        invoiceModel.city,
        invoiceModel.state,
        invoiceModel.zipCode
      ),
      items: invoiceItems,
      total: invoiceModel.total,
    });
    return invoice;
  }
}
