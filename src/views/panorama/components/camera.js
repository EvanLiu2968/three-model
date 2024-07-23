import { PerspectiveCamera } from 'three';

function createCamera() {
  const width = 400;
  const height = 300;

  const camera = new PerspectiveCamera(60, width / height, 1, 1000);
  camera.zoom = 1;
  camera.updateProjectionMatrix();
  camera.position.set(0, 50, -30);

  return camera;
}

export { createCamera };
