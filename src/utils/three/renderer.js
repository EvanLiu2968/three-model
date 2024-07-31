import { WebGLRenderer, Scene } from 'three';

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });

  renderer.physicallyCorrectLights = true;

  return renderer;
}

function createScene() {
  const scene = new Scene();

  return scene;
}

export { createRenderer, createScene };
