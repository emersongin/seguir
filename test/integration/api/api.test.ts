import axios from 'axios';

describe('testes para API', () => {
  it('efetuar inscrição como motorista!', async () => {
    const newAccount = {
      name: 'João Silva',
      email: 'joao@hotmail.com',
      password: '123456',
      cpf: '649.731.080-06',
      isDriver: true,
      isPassenger: false,
      carPlate: 'ABC1234'
    };
    const created = await axios.post('http://localhost:3000/signup', newAccount);
    const accountId = created.data.accountId;
    const account = await axios.get(`http://localhost:3000/account/${accountId}`);
    expect(account.data.accountId).toEqual(accountId);
    expect(account.data.accountName).toEqual(newAccount.name);
    expect(account.data.accountEmail).toEqual(newAccount.email);
    expect(account.data.accountCpf).toEqual(newAccount.cpf);
    expect(account.data.accountIsDriver).toEqual(newAccount.isDriver);
    expect(account.data.accountIsPassenger).toEqual(newAccount.isPassenger);
    expect(account.data.accountCarPlate).toEqual(newAccount.carPlate);
  });

  it('efetuar inscrição como passageiro!', async () => {
    const newAccount = {
      name: 'Maria Silva',
      email: 'maria@hotmail.com',
      password: '123456',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: true
    };
    const created = await axios.post('http://localhost:3000/signup', newAccount);
    const accountId = created.data.accountId;
    const account = await axios.get(`http://localhost:3000/account/${accountId}`);
    expect(account.data.accountId).toEqual(accountId);
    expect(account.data.accountName).toEqual(newAccount.name);
    expect(account.data.accountEmail).toEqual(newAccount.email);
    expect(account.data.accountCpf).toEqual(newAccount.cpf);
    expect(account.data.accountIsDriver).toEqual(newAccount.isDriver);
    expect(account.data.accountIsPassenger).toEqual(newAccount.isPassenger);
  });
});