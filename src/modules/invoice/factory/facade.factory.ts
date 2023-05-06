import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.respository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
  static create(): InvoiceFacade {
    const invoiceRepository = new InvoiceRepository();
    const find = new FindInvoiceUseCase(invoiceRepository);
    const process = new GenerateInvoiceUseCase(invoiceRepository);

    const facade = new InvoiceFacade({
      processUseCase: process,
      findUseCase: find,
    });
    return facade;
  }
}
