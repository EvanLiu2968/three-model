import { PerspectiveCamera } from 'three';

function createCamera() {
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);

  camera.position.set(4-4, 0+8, 0+12);

  return camera;
}

export { createCamera };
