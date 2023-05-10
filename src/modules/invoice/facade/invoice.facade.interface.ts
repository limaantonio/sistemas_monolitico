import Address from "../domain/value-object/address";

export interface InvoiceFacadeInputDto {
  id?: string;
  name: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  items: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface FindInvoiceFacadeInputDto {
  id: string;
}

export interface InvoiceFacadeOutputDto {
  id: string;
  name: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  items: {
    id: string;
    name: string;
    price: number;
  }[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export default interface InvoiceFacadeInterface {
  process(input: InvoiceFacadeInputDto): Promise<InvoiceFacadeOutputDto>;
  find(input: FindInvoiceFacadeInputDto): Promise<InvoiceFacadeOutputDto[]>;
}
