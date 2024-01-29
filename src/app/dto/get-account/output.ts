export default interface OutputGetAccountDto {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  isDriver: boolean;
  isPassenger: boolean;
  carPlate: string | null;
};