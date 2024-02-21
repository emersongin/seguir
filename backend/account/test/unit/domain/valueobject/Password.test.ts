import Password from '../../../../src/domain/valueobject/Password';

test.each([
	"senhaUsuario",
])("Deve testar se o senha é válido: %s", function (password: string) {
	const isValid = new Password(password);
	expect(isValid).toBeDefined();
});

test.each([
	""
])("Deve testar se o senha é inválido: %s", async function (password: any) {
  expect(() => {new Password(password)}).toThrow('Invalid password.');
});