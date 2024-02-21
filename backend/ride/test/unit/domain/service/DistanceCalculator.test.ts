import DistanceCalculator from '../../../../src/domain/service/DistanceCalculator';
import Coord from '../../../../src/domain/valueobject/Coord';

describe('testes para serviço de dominio para calcular distancia', () => {
  it('deve calcular a distancia entre dois pontos e ser zero', () => {
    const distance = DistanceCalculator.calculate(
      new Coord(-23.56168, -46.62543),
      new Coord(-23.56168, -46.62543)
    );
    expect(distance).toBe(0);
  });

  it('deve calcular a distancia entre dois pontos e ser maior que zero', () => {
    const distance = DistanceCalculator.calculate(
      new Coord(-23.56168, -46.62543),
      new Coord(-23.58168, -46.63543)
    );
    expect(distance).toBeGreaterThan(0);
  });
});