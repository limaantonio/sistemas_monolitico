import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceGateway from "../../gateway/invoice.gateway";
import Address from "../../domain/value-object/address";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.dto";
import InvoiceItem from "../../domain/invoice_item";

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(_invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = _invoiceRepository;
  }

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const address = new Address(
      input.address.street,
      input.address.number,
      input.address.complement,
      input.address.city,
      input.address.state,
      input.address.zipCode
    );

    let items: InvoiceItem[] = [];

    input.items.forEach((item) => {
      items.push(
        new InvoiceItem({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        })
      );
    });

    const props = {
      name: input.name,
      document: input.document,
      address: address,
      items: items,
      total: 0,
    };

    const invoice = new Invoice(props);
    this._invoiceRepository.generate(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total(),
    };
  }
}
