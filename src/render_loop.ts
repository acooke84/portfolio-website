import { Graphics } from "./graphics";

export abstract class RenderObject {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  start(): void {};
  abstract tick(dt: number): void;
  public render(): void {}
};

export abstract class RenderLoop {
  private lastTimestamp: number = 0;
  private renderObjects: Map<string, RenderObject> = new Map<string, RenderObject>();
  protected graphics: Graphics;

  constructor(graphics: Graphics) {
    this.graphics = graphics;
  }

  private init(): void {}

  tick(dt: number): void {
    this.renderObjects.forEach((obj: RenderObject, _: string) => {
      obj.tick(dt);
    });
  }

  render(): void {
    this.renderObjects.forEach((obj: RenderObject, _: string) => {
      obj.render();
    });
    
    this.graphics.render();
  }

  private mainGameLoop() {
    const deltaTime = (Date.now() - this.lastTimestamp) / 1000;
    this.tick(deltaTime);
    this.render();
    this.lastTimestamp = Date.now();

    window.requestAnimationFrame(() => this.mainGameLoop());
  }

  start(): void {
    this.init();

    this.renderObjects.forEach((obj: RenderObject, _: string) => {
      obj.start();
    });

    window.requestAnimationFrame(() => {
      this.lastTimestamp = Date.now();
      this.mainGameLoop();
    })
  }

  addRenderObject(obj: RenderObject): void {
    this.renderObjects.set(obj.id, obj);
  }

  removeRenderObject(obj: RenderObject): boolean {
    return this.renderObjects.delete(obj.id);
  }
};
