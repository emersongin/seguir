export default class DomainEvent {
  readonly occurredOn: Date = new Date();

  constructor(readonly eventName: string) {}
}