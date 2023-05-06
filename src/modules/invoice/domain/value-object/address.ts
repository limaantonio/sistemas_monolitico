export default class Address {
  _street: string;
  _number: string;
  _complement: string;
  _city: string;
  _state: string;
  _zipCode: string;

  constructor(
    street: string,
    number: string,
    complement: string,
    city: string,
    state: string,
    zipCode: string
  ) {
    this._street = street;
    this._number = number;
    this._city = city;
    this._zipCode = zipCode;
    this._complement = complement;
    this._state = state;
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get city(): string {
    return this._city;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get complement(): string {
    return this._complement;
  }

  get state(): string {
    return this._state;
  }
}
