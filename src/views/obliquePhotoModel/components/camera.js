import { PerspectiveCamera } from 'three';

function createCamera() {
  const camera = new PerspectiveCamera(35, 1, 0.5, 10000);

  camera.position.set(0, 20, 50);

  return camera;
}

export { createCamera };
