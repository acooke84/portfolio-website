import {
  BufferAttribute,
  BufferGeometry,
  Vector3
} from 'three';
import { BACK, DOWN, FORWARD, LEFT, RIGHT, UP } from '../util';

class Octosphere {
  readonly subdivisions: number;
  public geometry: BufferGeometry;

  public readonly vertices: Array<Vector3>;
  public readonly triangles: Array<number>;

  static readonly vertexPairs: number[] = [ 0, 1, 0, 2, 0, 3, 0, 4, 1, 2, 2, 3, 3, 4, 4, 1, 5, 1, 5, 2, 5, 3, 5, 4 ];
  static readonly edgeTriplets: number[] = [ 0, 1, 4, 1, 2, 5, 2, 3, 6, 3, 0, 7, 8, 9, 4, 9, 10, 5, 10, 11, 6, 11, 8, 7 ];
  static readonly initialVertices: Array<Vector3> = Array.from([ UP, LEFT, BACK, RIGHT, FORWARD, DOWN ]);

  constructor(subdivisions: number, radius: number = 1) {
    this.subdivisions = Math.max(0, subdivisions);
    this.geometry = new BufferGeometry();

    this.computeVertices();

    this.populateGeometry();
  }

  private computeVertices(): void {
    const verticesPerFace: number = (Math.pow((this.subdivisions + 3), 2) - (this.subdivisions + 3)) / 2;
    const numVerts: number = verticesPerFace * 8 - (this.subdivisions + 2) * 12 + 6;
    const trianglesPerFace: number = Math.pow(this.subdivisions + 1, 2);

    const computedVertices = new FixedSizedList<Vector3>(numVerts);
    const computedTriangles = new FixedSizedList<number>(trianglesPerFace * 8 * 3);

    computedVertices.addRange(Octosphere.initialVertices);
  }

  private populateGeometry(): void {
    const verts: Array<number> = [];
    for (var v of this.vertices) {
      verts.push(v.x, v.y, v.z);
    }

    this.geometry.setAttribute('position', new BufferAttribute(new Float32Array(verts), 3));
    this.geometry.setIndex(this.triangles);
    this.geometry.computeVertexNormals();
  }
};

type Edge = Array<number>;

class FixedSizedList<T> {
  public items: Array<T>;
  public nextIndex: number;

  constructor(size: number) {
    this.items = new Array<T>(size);
    this.nextIndex = 0;
  }

  public add(t: T): void {
    this.items[this.nextIndex] = t;
    this.nextIndex++;
  }

  public addRange(ts: Iterable<T>) {
    for (var t of ts) {
      this.add(t);
    }
  }
};
