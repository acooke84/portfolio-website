import { Graphics } from "../graphics";
import { RenderLoop } from "../render_loop";
import { Planet } from "./planet";

export class PlanetLoop extends RenderLoop {
  private planet: Planet;

  constructor(graphics: Graphics) {
    super(graphics);

    this.planet = new Planet("earth", 20);
    graphics.scene.add(this.planet.getMesh());
    this.addRenderObject(this.planet);
  }
};
