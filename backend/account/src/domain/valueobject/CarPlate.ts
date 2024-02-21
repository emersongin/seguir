export default class CarPlate {
  private readonly value: string;

  constructor(carPlate: string) {
    if (this.isInvalidCarPlate(carPlate)) throw new Error('Invalid car plate.');
    this.value = carPlate;
  }

  isInvalidCarPlate(carPlate: string): boolean {
    return !carPlate.match(/[A-Z]{3}[0-9]{4}/);
  }

  getValue() {
    return this.value;
  }
}