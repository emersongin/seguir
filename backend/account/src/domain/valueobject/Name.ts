export default class Name {
  private readonly value: string;

  constructor(name: string) {
    if (this.isInvalidName(name)) throw new Error('Invalid user name.');
    this.value = name;
  }

  isInvalidName(name: string): boolean {
    return !name.match(/[a-zA-Z] [a-zA-Z]/);
  }

  getValue(): string {
    return this.value;
  }
}