import crypto from 'crypto';

export default class Transaction {
  constructor(
    readonly id: string,
    readonly rideId: string,
    readonly amount: number,
    private date: Date,
    private status: string
  ) {
    this.date = new Date();
    this.status = status;
  }

  static create(rideId: string, amount: number): Transaction {
    const id = crypto.randomUUID();
    const status = 'pending';
    const dateNow = new Date();
    return new Transaction(
      id,
      rideId,
      amount,
      dateNow,
      status
    );
  }

  paid(): void {
    if (this.status === 'paid') throw new Error('Transaction already paid');
    this.status = 'paid';
  }

  getDate(): Date {
    return this.date;
  }

  getStatus(): string {
    return this.status;
  }
}