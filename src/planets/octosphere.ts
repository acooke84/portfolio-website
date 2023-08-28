import {
  BufferAttribute,
  BufferGeometry,
  Vector3
} from 'three';
import {
  BACK, DOWN, FORWARD, LEFT, RIGHT, UP,
  slerp,
  FixedSizedList
} from '../util';

export class Octosphere {
  readonly subdivisions: number;
  public geometry: BufferGeometry;

  public readonly vertices: Array<Vector3>;
  public readonly triangles: Array<number>;

  private computedVertices: FixedSizedList<Vector3>;
  private computedTriangles: FixedSizedList<number>;

  static readonly vertexPairs: number[] = [ 0, 1, 0, 2, 0, 3, 0, 4, 1, 2, 2, 3, 3, 4, 4, 1, 5, 1, 5, 2, 5, 3, 5, 4 ];
  static readonly edgeTriplets: number[] = [ 0, 1, 4, 1, 2, 5, 2, 3, 6, 3, 0, 7, 8, 9, 4, 9, 10, 5, 10, 11, 6, 11, 8, 7 ];
  static readonly initialVertices: Array<Vector3> = Array.from([ UP, LEFT, BACK, RIGHT, FORWARD, DOWN ]);

  constructor(subdivisions: number, radius: number = 1) {
    this.subdivisions = Math.max(0, subdivisions);
    this.geometry = new BufferGeometry();

    const verticesPerFace: number = (Math.pow((this.subdivisions + 3), 2) - (this.subdivisions + 3)) / 2;
    const numVerts: number = verticesPerFace * 8 - (this.subdivisions + 2) * 12 + 6;
    const trianglesPerFace: number = Math.pow(this.subdivisions + 1, 2);

    this.computedVertices = new FixedSizedList<Vector3>(numVerts);
    this.computedTriangles = new FixedSizedList<number>(trianglesPerFace * 8 * 3);

    this.computedVertices.addRange(Octosphere.initialVertices);

    this.computeVertices(verticesPerFace);

		this.vertices = this.computedVertices.items;
		this.triangles = this.computedTriangles.items;

    this.populateGeometry();
  }

  private computeVertices(verticesPerFace: number): void {
    const computedEdges: Array<Edge> = new Array<Edge>(12);
    for (let i = 0; i < Octosphere.vertexPairs.length; i += 2) {
			const startVertex: Vector3 = this.computedVertices.items[Octosphere.vertexPairs[i]];
			const endVertex: Vector3 = this.computedVertices.items[Octosphere.vertexPairs[i + 1]];

			const edgeVertexIndices: Array<number> = new Array<number>(this.subdivisions + 2);
			edgeVertexIndices[0] = Octosphere.vertexPairs[i];

			// Add vertices along edge
			for (let divisionIndex: number = 0; divisionIndex < this.subdivisions; divisionIndex++) {
			  const t: number = (divisionIndex + 1.0) / (this.subdivisions + 1.0);
				edgeVertexIndices[divisionIndex + 1] = this.computedVertices.nextIndex;
        const res: Vector3 = slerp(startVertex, endVertex, t);
        this.computedVertices.add(res);
			}
			edgeVertexIndices[this.subdivisions + 1] = Octosphere.vertexPairs[i + 1];
			const edgeIndex: number = i / 2;
			computedEdges[edgeIndex] = edgeVertexIndices;
		}
    for (let i: number = 0; i < Octosphere.edgeTriplets.length; i += 3) {
			const faceIndex: number = i / 3;
			const reverse: boolean = faceIndex >= 4;
			this.createFace(
        computedEdges[Octosphere.edgeTriplets[i]], 
        computedEdges[Octosphere.edgeTriplets[i + 1]], 
        computedEdges[Octosphere.edgeTriplets[i + 2]], 
        reverse,
        verticesPerFace
      );
		}

  }

  private createFace(sideA: Edge,
                     sideB: Edge,
                     bottom: Edge,
                     reverse: boolean,
                     verticesPerFace: number): void {
    const numPointsInEdge: number = sideA.length;
		var vertexMap = new FixedSizedList<number>(verticesPerFace);
		vertexMap.add(sideA[0]); // top of triangle

		for (let i = 1; i < numPointsInEdge - 1; i++) {
			// Side A vertex
			vertexMap.add(sideA[i]);

			// Add vertices between sideA and sideB
			const sideAVertex: Vector3 = this.computedVertices.items[sideA[i]];
			const sideBVertex: Vector3 = this.computedVertices.items[sideB[i]];
			const numInnerPoints: number = i - 1;
			for (let j = 0; j < numInnerPoints; j++) {
				const t: number = (j + 1.0) / (numInnerPoints + 1.0);
				vertexMap.add(this.computedVertices.nextIndex);
				this.computedVertices.add(slerp(sideAVertex, sideBVertex, t));
			}

			// Side B vertex
			vertexMap.add(sideB[i]);
		}

		// Add bottom edge vertices
		for (let i = 0; i < numPointsInEdge; i++) {
			vertexMap.add(bottom[i]);
		}

		// Triangulate
		const numRows: number = this.subdivisions + 1;
		for (let row = 0; row < numRows; row++) {
			// vertices down left edge follow quadratic sequence: 0, 1, 3, 6, 10, 15...
			// the nth term can be calculated with: (n^2 - n)/2
			let topVertex: number = ((row + 1) * (row + 1) - row - 1) / 2;
			let bottomVertex: number = ((row + 2) * (row + 2) - row - 2) / 2;

			const numTrianglesInRow: number = 1 + 2 * row;
			for (let column = 0; column < numTrianglesInRow; column++) {
        let v0: number;
        let v1: number;
        let v2: number;

				if (column % 2 == 0) {
					v0 = topVertex;
					v1 = bottomVertex + 1;
					v2 = bottomVertex;
					topVertex++;
					bottomVertex++;
				} else {
					v0 = topVertex;
					v1 = bottomVertex;
					v2 = topVertex - 1;
				}

				this.computedTriangles.add(vertexMap.items[v0]);
				this.computedTriangles.add(vertexMap.items[(reverse) ? v2 : v1]);
				this.computedTriangles.add(vertexMap.items[(reverse) ? v1 : v2]);
			}
		}
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
