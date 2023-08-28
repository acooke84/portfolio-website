import { Vector3 } from 'three';

export const FORWARD : Vector3 = new Vector3(0, 0, 1);
export const BACK    : Vector3 = new Vector3(0, 0, -1);
export const UP      : Vector3 = new Vector3(0, 1, 0);
export const DOWN    : Vector3 = new Vector3(0, -1, 0);
export const RIGHT   : Vector3 = new Vector3(1, 0, 0);
export const LEFT    : Vector3 = new Vector3(-1, 0, 0);

export function slerp(start: Vector3, end: Vector3, percent: number): Vector3 {
  const dot: number = Math.max(-1.0, Math.min(1.0, start.dot(end)));
  const theta: number = Math.acos(dot) * percent;
  const relativeVec: Vector3 = start.clone().multiplyScalar(dot).negate().add(end);
  relativeVec.normalize();
  const result: Vector3 = start.clone().multiplyScalar(Math.cos(theta));
  result.add(relativeVec.multiplyScalar(Math.sin(theta)));
  return result;
};

export class FixedSizedList<T> {
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

