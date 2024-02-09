import Coord from '../../../../src/domain/valueobject/Coord';

test.each([
	{
    lat: 0,
    long: 0
  },
  {
    lat: 90,
    long: 180
  },
  {
    lat: -90,
    long: -180
  },
  {
    lat: 90,
    long: -180
  },
  {
    lat: -90,
    long: 180
  },
  {
    lat: 0,
    long: 180
  },
  {
    lat: 0,
    long: -180
  },
  {
    lat: 90,
    long: 0
  },
  {
    lat: -90,
    long: 0
  },
  {
    lat: 0,
    long: 90
  },
  {
    lat: 0,
    long: -90
  },
  {
    lat: 90,
    long: 90
  },
  {
    lat: -90,
    long: -90
  },
  {
    lat: 90,
    long: -90
  },
  {
    lat: -90,
    long: 90
  }
])("Deve testar se a coordenada é válida: %s", function ({ lat, long }: {
  lat: number,
  long: number
}) {
	const isValid = new Coord(lat, long);
	expect(isValid).toBeDefined();
});

test.each([
	{
    lat: 91,
    long: 0
  },
  {
    lat: -91,
    long: 0
  }
])("Deve testar se a coordenada de latitude não é válida: %s", async function ({ lat, long }: {
  lat: number,
  long: number
}) {
  expect(() => {new Coord(lat, long)}).toThrow('Invalid latitude.');
});

test.each([
  {
    lat: 0,
    long: 181
  },
  {
    lat: 0,
    long: -181
  }
])("Deve testar se a coordenada de longitude não é válida: %s", async function ({ lat, long }: {
  lat: number,
  long: number
}) {
  expect(() => {new Coord(lat, long)}).toThrow('Invalid longitude.');
});