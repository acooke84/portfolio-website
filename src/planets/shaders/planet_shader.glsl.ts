import simplexGlsl from "./simplex.glsl";
import { ShaderChunk } from "three";

export const vertex = simplexGlsl + /* glsl */`
varying vec3 vUv;
varying vec3 nor;

void main() {
  vUv = position;
  nor = normal;
  float noise = snoise(vUv) * 0.1f;

  vec4 modelViewPosition = modelViewMatrix * vec4(position + noise, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
`;

export const fragment = /* glsl */`
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;

varying vec3 vUv;
varying vec3 nor;

float lambert(vec3 N, vec3 L) {
  vec3 nrmN = normalize(N);
  vec3 nrmL = normalize(L);
  float result = dot(nrmN, nrmL);
  return max(result, 0.0);
}

void main() {
  vec3 result = diffuse * lambert(nor, vec3(0, 0, 4));
  gl_FragColor = vec4(result.rgb, 1.0);
}
`;
