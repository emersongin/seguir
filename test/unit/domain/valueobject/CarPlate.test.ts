import CarPlate from '../../../../src/domain/valueobject/CarPlate';

test.each([
	"ABC1234"
])("Deve testar se o placa de carro é válido: %s", function (carPlate: string) {
	const isValid = new CarPlate(carPlate);
	expect(isValid).toBeDefined();
});

test.each([
  "",
	"1234ABC",
  "12345678910",
  "12bc",
  "abc",
  "1c4"
])("Deve testar se o placa de carro é inválido: %s", async function (carPlate: any) {
  expect(() => {new CarPlate(carPlate)}).toThrow('Invalid car plate.');
});