export class Signal<TValue> {
  name: string;
  description: string;
  value: TValue;
  private _update?: (value: TValue) => void | undefined;

  constructor(
    name: string,
    description: string,
    initialValue: TValue,
    update?: (value: TValue) => void,
  ) {
    this.name = name;
    this.description = description;
    this.value = initialValue;
    this._update = update;
  }

  update(value: TValue) {
    this.value = value;
    if (this._update) {
      this._update(value);
    }
  }
}
