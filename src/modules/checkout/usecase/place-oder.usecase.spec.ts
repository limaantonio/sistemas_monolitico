import Id from "../../@shared/domain/value-object/id.value-object";
import { Product } from "../domain/produt.entity";
import { PlaceOrderInputDTO } from "./place-oder.dto";
import PlaceOrderUseCase from "./place-oder.usecase";
const mockDate = new Date(2000, 1, 1);
describe("PlaceOderUseCase unit test", () => {
  describe("Validate products method", () => {
    //@ts-expect-error - no params in constructor
    const placeOderUseCase = new PlaceOrderUseCase();

    it("should throw if no product are selected", async () => {
      const input: PlaceOrderInputDTO = { clientId: "0", products: [] };
      await expect(
        placeOderUseCase["_validateProducts"](input)
      ).rejects.toThrow(new Error("No products selected"));
    });

    it("should throw an error when products is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) => {
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          });
        }),
      };
      //@ts-expect-error - no params in constructor
      placeOderUseCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDTO = {
        clientId: "0",
        products: [{ productId: "1" }],
      };
      await expect(
        placeOderUseCase["_validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is out of stock"));

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(
        placeOderUseCase["_validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is out of stock"));
      expect(mockProductFacade.checkStock).toBeCalledTimes(3);
      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(
        placeOderUseCase["_validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is out of stock"));
      expect(mockProductFacade.checkStock).toBeCalledTimes(5);
    });
  });

  describe("getProducst method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should return a list of products", async () => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    //@ts-expect-error - no params in constructor
    const placeOderUseCase = new PlaceOrderUseCase();

    it("should throw an error when product not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };
      //@ts-expect-error - force set catalogFacade
      placeOderUseCase["_catalogFacade"] = mockCatalogFacade;
      await expect(placeOderUseCase["_getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("should return a product", async () => {
      //@ts-expect-error - no params in constructor
      const placeOderUseCase = new PlaceOrderUseCase();

      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "0",
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        }),
      };
      //@ts-expect-error - force set catalogFacade
      placeOderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOderUseCase["_getProduct"]("0")).resolves.toEqual(
        new Product({
          id: new Id("0"),
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        })
      );

      expect(mockCatalogFacade.find).toBeCalledTimes(1);
    });
  });

  describe("excute method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });
    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };
      //@ts-expect-error - no params in constructor
      const placeOderUseCase = new PlaceOrderUseCase();
      //@ts-expect-error - force set clientFacade
      placeOderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDTO = { clientId: "0", products: [] };

      await expect(placeOderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });
    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue({}),
      };
      //@ts-expect-error - no params in constructor
      const placeOderUseCase = new PlaceOrderUseCase();

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOderUseCase, "_validateProducts")
        //@ts-expect-error -s not return never
        .mockRejectedValue(new Error("No products selected"));

      //@ts-expect-error - force set clientFacade
      placeOderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDTO = { clientId: "0", products: [] };
      await expect(placeOderUseCase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );
      expect(mockValidateProducts).toBeCalledTimes(1);
    });
  });
  describe("place an order", () => {
    const clietProps = {
      id: "0",
      name: "Client 0",
      document: "00000000000",
      email: "client@gmail.com",
      street: "Street 0",
      number: "0",
      complement: "Complement 0",
      city: "City 0",
      state: "State 0",
      zipCode: "00000000",
    };
    const mockClientFacade = {
      find: jest.fn().mockResolvedValue(clietProps),
    };

    const mockPaymentFacade = {
      process: jest.fn(),
    };

    const mockCheckoutRepository = {
      addOrder: jest.fn(),
    };

    const mockInvoiceFacade = {
      create: jest.fn().mockResolvedValue({ id: "0" }),
    };

    const placeOderUseCase = new PlaceOrderUseCase(
      mockClientFacade as any,
      null,
      null,
      mockCheckoutRepository as any,
      mockPaymentFacade as any,
      mockPaymentFacade
    );

    const products = {
      "1p": new Product({
        id: new Id("1p"),
        name: "Product 0",
        description: "Product 0 description",
        salesPrice: 40,
      }),
      "2p": new Product({
        id: new Id("2p"),
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 1,
      }),
    };

    const mockValidateProducts = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOderUseCase, "_validateProducts")
      //@ts-expect-error -s not return never
      .mockResolvedValue(null);

    const mockGetProduct = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOderUseCase, "_getProduct")
      //@ts-expect-error -s not return never
      .mockImplementation((productId: keyof typeof products) => {
        return products[productId];
      });

    it("should not be approved when payment is not approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100,
        status: "error",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDTO = {
        clientId: "1c",
        products: [{ productId: "1p" }, { productId: "2p" }],
      };

      console.log(input);

      let output = await placeOderUseCase.execute(input);

      expect(output.invoiceId).toBeNull();
      expect(output.total).toBe(41);
      expect(output.products).toStrictEqual([
        { productId: "1p" },
        { productId: "2p" },
      ]);

      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockValidateProducts).toHaveBeenCalledWith(input);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(0);
    });

    it("sould be approved when payment is approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDTO = {
        clientId: "1c",
        products: [{ productId: "1p" }, { productId: "2p" }],
      };

      let output = await placeOderUseCase.execute(input);

      expect(output.invoiceId).toBe("1i");

      expect(output.total).toBe(41);
      expect(output.products).toStrictEqual([
        { productId: "1p" },
        { productId: "2p" },
      ]);

      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockValidateProducts).toHaveBeenCalledWith(input);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(1);
      expect(mockInvoiceFacade.create).toHaveBeenCalledWith({
        name: clietProps.name,
        document: clietProps.document,
        email: clietProps.email,
        street: clietProps.street,
        number: clietProps.number,
        complement: clietProps.complement,
        city: clietProps.city,
        state: clietProps.state,
        zipCode: clietProps.zipCode,
        total: output.total,
        items: [
          {
            productId: "1p",
            name: products["1p"].name,
            price: products["1p"].salesPrice,
          },
          {
            productId: "2p",
            name: products["2p"].name,
            price: products["2p"].salesPrice,
          },
        ],
      });

      expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
      expect(mockCheckoutRepository.addOrder).toHaveBeenCalledWith({
        id: output.id,
        clientId: input.clientId,
        invoiceId: output.invoiceId,
        total: output.total,
        products: output.products,
      });
    });
  });
});
