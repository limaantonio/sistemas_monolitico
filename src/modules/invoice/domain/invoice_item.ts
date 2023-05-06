import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type InvoiceProps = {
  id?: Id;
  name: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class InvoiceItem extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _price: number;

  constructor(props: InvoiceProps) {
    super(props.id);
    this._price = props.price;
    this._name = props.name;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }
}
