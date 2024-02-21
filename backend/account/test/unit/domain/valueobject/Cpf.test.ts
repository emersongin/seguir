import Cpf from '../../../../src/domain/valueobject/Cpf';

test.each([
	"97456321558",
	"71428793860",
	"87748248800"
])("Deve testar se o cpf é válido: %s", function (cpf: string) {
	const isValid = new Cpf(cpf);
	expect(isValid).toBeDefined();
});

test.each([
	"8774824880",
	null,
	undefined,
	"11111111111"
])("Deve testar se o cpf é inválido: %s", async function (cpf: any) {
  expect(() => {new Cpf(cpf)}).toThrow('Invalid cpf.');
});