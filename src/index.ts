import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  HemisphereLight,
} from "three";
import { Graphics } from "./graphics";
import { PlanetLoop } from "./planets/planet_loop";

window.onload = () => {
  const canvas = document.getElementById("app") as HTMLCanvasElement;
  const scene = new Scene();
  const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  const renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const graphics: Graphics = new Graphics(scene, camera, renderer);

  graphics.camera.position.z = 4;
  graphics.camera.lookAt(0, 0, 0);
  const skyColor = 0xB1E1FF;
  const groundColor = 0x3d3729;
  const intensity = 0.8;
  const light = new HemisphereLight(skyColor, groundColor, intensity);
  graphics.scene.add(light);
 
  const planetLoop = new PlanetLoop(graphics);
  planetLoop.start();
}
