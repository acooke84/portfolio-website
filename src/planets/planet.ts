import {
  Material,
  Mesh,
  ShaderMaterial,
  Color,
} from 'three';
import { Octosphere } from './octosphere';
import { OctosphereFactory } from './octosphere_factory';
import { RenderObject } from '../render_loop';
import * as planet_shader from './shaders/planet_shader.glsl';

export class Planet extends RenderObject {
  private octosphere: Octosphere;
  private material: Material;
  private mesh: Mesh;
  private uniforms;
  
  constructor(planet: string, subdivisions: number) {
    super(planet);
      
    // Octosphere geometry
    this.octosphere = OctosphereFactory.getIcosphere(subdivisions);

    // Shader material
    this.uniforms = {
      colorA: { type: 'vec3', value: new Color(0xACB6E5) },
      colorB: { type: 'vec3', value: new Color(0x74ebd5) },
    }
    this.material = new ShaderMaterial({
      vertexShader: planet_shader.vertex,
      fragmentShader: planet_shader.fragment,
      uniforms: this.uniforms,
      wireframe: false,
    });

    // Mesh creation
    this.mesh = new Mesh(this.octosphere.geometry, this.material);
  }

  tick(dt: number): void {
    this.mesh.rotateX(dt * 0.1);
    this.mesh.rotateY(dt * 0.05);
  }

  getMesh(): Mesh {
    return this.mesh;
  }
};
