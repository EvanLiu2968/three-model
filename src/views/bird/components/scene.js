import * as THREE from 'three'

function createScene() {
  const scene = new THREE.Scene();

  const loaderbox = new THREE.CubeTextureLoader() // 加载贴图
  const sky = loaderbox.load([
    `/assets/sky/posx.jpg`,
    `/assets/sky/negx.jpg`,
    `/assets/sky/posy.jpg`,
    `/assets/sky/negy.jpg`,
    `/assets/sky/posz.jpg`,
    `/assets/sky/negz.jpg`
  ])
  scene.background = sky

  // scene.background = new THREE.Color('skyblue');

  return scene;
}

export { createScene };
