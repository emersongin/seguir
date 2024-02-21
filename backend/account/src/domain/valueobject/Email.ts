export default class Email {
  private value: string;

  constructor(email: string) {
    if (this.isInvalidEmail(email)) throw new Error('Invalid email.');
      this.value = email;
  }

  isInvalidEmail(email: string): boolean {
    return !email.match(/^(.+)@(.+)$/) ? true : false;
  }

  getValue(): string {
    return this.value;
  }
}