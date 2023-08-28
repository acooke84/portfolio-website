import {
  Vector3
} from 'three';

class Octosphere {
  private vertices: Array<Vector3> = Array.from([
    new Vector3(0, -1, 0),
    new Vector3(0, 0, 1),
    new Vector3(-1, 0, 0),
    new Vector3(0, 0, -1),
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0)
  ]);

  private triangles: Array<number> = Array.from([
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 1,
    5, 2, 1,
    5, 3, 2,
    5, 4, 3,
    5, 1, 4
  ]);

  constructor(subdivisions: number, radius: number = 1) {
    for (let i = 0; i < this.vertices.length; i++) {
      
    }
  }
};
