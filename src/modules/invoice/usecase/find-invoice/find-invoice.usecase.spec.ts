import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../../store-catalog/domain/product.entity";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice_item";
import Address from "../../domain/value-object/address";
import FindInvoiceUseCase from "./find-invoice.usecase";

const address = new Address(
  "Rua 1",
  "123",
  "São Paulo",
  "12345678",
  "Casa",
  "SP"
);

const product = new InvoiceItem({
  id: new Id("1"),
  name: "Product",
  price: 100,
});

const invoce = new Invoice({
  name: "John Doe",
  document: "12345678900",
  address: address,
  items: [product],
  total: 100,
});

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoce)),
  };
};

describe("Find Invoice usecase unit test", () => {
  it("should find an invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);
    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(result.id).toBeDefined;
  });
});
