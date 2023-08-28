export abstract class RenderObject {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  start(): void {};
  abstract tick(dt: number): void;
  abstract render(): void;
};

export abstract class RenderLoop {
  private lastTimestamp: number = 0;
  private renderObjects: Map<string, RenderObject> = new Map<string, RenderObject>(); 

  tick(dt: number): void {
    this.renderObjects.forEach((obj: RenderObject, _: string) => {
      obj.tick(dt);
    });
  }

  render(): void {
    this.renderObjects.forEach((obj: RenderObject, _: string) => {
      obj.render();
    });
  }

  private mainGameLoop() {
    const deltaTime = (Date.now() - this.lastTimestamp) / 1000;
    this.tick(deltaTime);
    this.render();
    this.lastTimestamp = Date.now();
  }

  start(): void {
    this.renderObjects.forEach((obj: RenderObject, _: string) => {
      obj.start();
    });


    this.lastTimestamp = Date.now();
    this.mainGameLoop();
  }
};
