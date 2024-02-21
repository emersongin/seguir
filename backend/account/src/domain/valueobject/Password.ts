export default class Password {
  private readonly value: string;

  constructor(password: string) {
    if (!password || password.length < 1) throw new Error('Invalid password.');
    this.value = password;
  }

  getValue(): string {
    return this.value;
  }
}