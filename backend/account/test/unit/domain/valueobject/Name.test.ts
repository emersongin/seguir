import Name from '../../../../src/domain/valueobject/Name';

test.each([
	"nome usuario",
	"a a"
])("Deve testar se o nome é válido: %s", function (name: string) {
	const isValid = new Name(name);
	expect(isValid).toBeDefined();
});

test.each([
	"tudoJunto",
	"111111 222222",
	"1111111111111",
	"1",
	"11abc 22abc"
])("Deve testar se o nome é inválido: %s", async function (name: any) {
  expect(() => {new Name(name)}).toThrow('Invalid user name.');
});