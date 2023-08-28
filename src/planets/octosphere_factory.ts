import { Octosphere } from './octosphere';

export class OctosphereFactory {
  static readonly meshMap: Map<number, Octosphere> = new Map<number, Octosphere>([
    [0, new Octosphere(0)],
    [10, new Octosphere(10)],
    [20, new Octosphere(20)],
    [30, new Octosphere(30)],
    [40, new Octosphere(40)],
    [50, new Octosphere(50)],
    [100, new Octosphere(100)],
    [200, new Octosphere(200)],
    [300, new Octosphere(300)],
  ]);

  static getIcosphere(subdivisions: number): Octosphere {
    const octosphere = OctosphereFactory.meshMap.has(subdivisions) ? 
      OctosphereFactory.meshMap.get(subdivisions) :
      OctosphereFactory.meshMap.get(0);

    if (octosphere) {
      return octosphere;
    } else {
      return new Octosphere(0);
    }
  }
};
