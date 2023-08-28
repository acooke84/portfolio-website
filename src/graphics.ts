import { Camera, Renderer, Scene } from "three";

class Graphics {
  public scene: Scene;
  public camera: Camera;
  public renderer: Renderer;

  constructor(scene: Scene, camera: Camera, renderer: Renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}

export { Graphics };
