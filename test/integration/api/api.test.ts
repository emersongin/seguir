import axios from 'axios';

describe('testes para API', () => {
  it('efetuar inscrição como motorista!', async () => {
    const newAccount = {
      name: 'João Silva',
      email: 'joao@hotmail.com',
      cpf: '649.731.080-06',
      isDriver: true,
      isPassenger: false,
      carPlate: 'ABC1234'
    };
    const created = await axios.post('http://localhost:3000/signup', newAccount);
    expect(created.status).toBe(201);
    const accountId = created.data.accountId;
    const account = await axios.get(`http://localhost:3000/account/${accountId}`);
    console.log(account.data);
    expect(account.data.accountId).toEqual(accountId);
    expect(account.data.name).toEqual(newAccount.name);
    expect(account.data.email).toEqual(newAccount.email);
    expect(account.data.cpf).toEqual(newAccount.cpf);
    expect(account.data.isDriver).toEqual(newAccount.isDriver);
    expect(account.data.isPassenger).toEqual(newAccount.isPassenger);
    expect(account.data.carPlate).toEqual(newAccount.carPlate);
  });

  it('efetuar inscrição como passageiro!', async () => {
    const newAccount = {
      name: 'Maria Silva',
      email: 'maria@hotmail.com',
      cpf: '649.731.080-06',
      isDriver: false,
      isPassenger: true
    };
    const created = await axios.post('http://localhost:3000/signup', newAccount);
    expect(created.status).toBe(201);
    const accountId = created.data.accountId;
    const account = await axios.get(`http://localhost:3000/account/${accountId}`);
    console.log(account.data);
    expect(account.data.accountId).toEqual(accountId);
    expect(account.data.name).toEqual(newAccount.name);
    expect(account.data.email).toEqual(newAccount.email);
    expect(account.data.cpf).toEqual(newAccount.cpf);
    expect(account.data.isDriver).toEqual(newAccount.isDriver);
    expect(account.data.isPassenger).toEqual(newAccount.isPassenger);
    expect(account.data.carPlate).toEqual(null);
  });
});