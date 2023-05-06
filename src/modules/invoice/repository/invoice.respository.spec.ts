import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../../store-catalog/domain/product.entity";
import ProductModel from "../../store-catalog/repository/product.model";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice_item";
import Address from "../domain/value-object/address";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.respository";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should save a invoice", async () => {
    const invoiceItem = new InvoiceItem({
      id: new Id("1"),
      name: "name",
      price: 100,
    });

    const address = new Address(
      "Rua 1",
      "123",
      "Casa",
      "São Paulo",
      "SP",
      "12345678"
    );

    const invoice = new Invoice({
      id: new Id("1"),
      name: "name",
      document: "document",
      address: address,
      items: [invoiceItem],
      total: 100,
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const result = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: [InvoiceItemModel],
    });

    expect(result.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
  });

  it("should find a invoice", async () => {
    const invoiceItem = new InvoiceItem({
      id: new Id("1"),
      name: "name",
      price: 100,
    });

    const invoice = await InvoiceModel.create({
      id: "1",
      name: "name",
      document: "document",
      street: "Rua 1",
      number: "123",
      complement: "Casa",
      city: "São Paulo",
      state: "SP",
      zipCode: "12345678",
      items: [invoiceItem],
      total: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new InvoiceRepository();

    const result = await repository.find(invoice.id);

    expect(result).toBeDefined();
    expect(result.id.id).toBe(invoice.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
  });
});
