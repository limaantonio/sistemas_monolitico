import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "./invoice_item";
import Address from "./value-object/address";

type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  total: number;
  items: InvoiceItem[];
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address;
  private _total: number;
  private _items: InvoiceItem[];

  constructor(props: InvoiceProps) {
    super(props.id);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
    this._total = this.total();
  }

  get items(): InvoiceItem[] {
    return this._items;
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }

  addItem(item: InvoiceItem) {
    this._items.push(item);
    this._total = this.total();
  }

  total = (): number => {
    return this._items.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
  };
}
