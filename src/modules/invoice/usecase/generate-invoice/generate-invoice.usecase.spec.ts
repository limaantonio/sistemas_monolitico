import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};
describe("GenerateInvoiceUseCase unit test", () => {
  it("should generate an invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);
    const input = {
      name: "John Doe",
      document: "12345678900",
      street: "Rua 1",
      number: "123",
      complement: "Casa",
      city: "São Paulo",
      state: "SP",
      zipCode: "12345678",

      items: [
        {
          id: "123",
          name: "Product 1",
          price: 100,
        },
        {
          id: "456",
          name: "Product 2",
          price: 200,
        },
      ],
      total: 300,
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.generate).toHaveBeenCalled();
    expect(result.id).toBeDefined;
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.city).toBe(input.city);
    expect(result.zipCode).toBe(input.zipCode);
  });
});
