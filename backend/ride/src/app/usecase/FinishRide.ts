import RideRepository from '../../infra/repository/RideRepository';
import PositionRepository from '../../infra/repository/PositionRepository';
import AccountGateway from '../../infra/gateway/AccountGateway';
import PaymentGateway from '../../infra/gateway/PaymentGateway';
import RideCompletedEvent from '../../domain/events/RideCompletedEvent';

export default class FinishRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly positionRepository: PositionRepository,
    private readonly accountGateway: AccountGateway,
    private readonly paymentGateway: PaymentGateway
  ) {}

  async execute(rideId: string): Promise<void> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error('ride not found');
    const account = await this.accountGateway.getById(ride.passengerId);
    if (!account) throw new Error('account not found');
    if (!account.creditCardToken) throw new Error('account has no credit card');
    const creditCardToken = account.creditCardToken;
    const positions = await this.positionRepository.getAllPositionByRideId(rideId);
    ride.register(RideCompletedEvent.name, async (event: RideCompletedEvent) => {
      await this.paymentGateway.processPayment({
        rideId: event.rideId,
        creditCardToken: event.creditCardToken,
        amount: event.amount
      });
    });
    ride.finishRide(positions, creditCardToken);
    await this.rideRepository.update(ride);
  }
}
