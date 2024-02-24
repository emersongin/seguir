export default interface AccountGateway {
  getById(accountId: string): Promise<GetAccountOutputDto | undefined>;
  signup(input: SignupInputDto): Promise<SignupOutputDto | undefined>;
}

export type GetAccountOutputDto = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  isDriver: boolean;
  isPassenger: boolean;
  carPlate: string | null;
  creditCardToken: string | null;
};

export type SignupInputDto = {
  name: string;
  email: string;
	password: string;
  cpf: string;
  isDriver: boolean;
  isPassenger: boolean;
  carPlate: string | null;
  creditCardToken: string | null;
};

export type SignupOutputDto = {
  accountId: string;
};