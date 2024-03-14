import DomainEvent from './DomainEvent';

export default class RideCompletedEvent extends DomainEvent {
  constructor(
    readonly rideId: string, 
    readonly creditCardToken: string, 
    readonly amount: number
  ) {
    super(RideCompletedEvent.name);
  }
}
