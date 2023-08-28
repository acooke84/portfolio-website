import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Graphics } from "../graphics";
import { RenderLoop, RenderObject } from "../render_loop";
import { Octosphere } from "./octosphere";
import { OctosphereFactory } from "./octosphere_factory";
import { Mesh } from "three/src/objects/Mesh";
import { GUI } from "dat.gui";

class Planet extends RenderObject {
  private octosphere: Octosphere;
  private mesh: Mesh;
  private subdivisions: number;

  constructor(planetName: string, graphics: Graphics) {
    super(planetName);

    this.subdivisions = 0;

    this.octosphere = OctosphereFactory.getIcosphere(this.subdivisions);
    const material = new MeshBasicMaterial();
    material.wireframe = true;
    this.mesh = new Mesh(this.octosphere.geometry, material);
    
    graphics.scene.add(this.mesh);

    const gui = new GUI();
  }

  tick(dt: number): void {
    this.mesh.rotateX(dt * 0.1);
    this.mesh.rotateY(dt * 0.05);
  }
}

export class PlanetLoop extends RenderLoop {
  private planet: Planet;

  constructor(graphics: Graphics) {
    super(graphics);

    this.planet = new Planet("TEST_PLANET", graphics);
    this.addRenderObject(this.planet);
  }
};
