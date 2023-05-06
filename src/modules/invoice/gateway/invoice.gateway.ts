import Invoice from "../domain/invoice";

export default interface InvoiceGateway {
  generate(invoice: Invoice): Promise<Invoice>;
  find(id: string): Promise<Invoice>;
}
