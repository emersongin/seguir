import Email from '../../../../src/domain/valueobject/Email';

test.each([
	"email_valido@hotmail.com"
])("Deve testar se o email é válido: %s", function (cpf: string) {
	const isValid = new Email(cpf);
	expect(isValid).toBeDefined();
});

test.each([
  "",
  "email_invalido",
  "erro de digitação"
])("Deve testar se o email é inválido: %s", async function (cpf: any) {
  expect(() => {new Email(cpf)}).toThrow('Invalid email.');
});