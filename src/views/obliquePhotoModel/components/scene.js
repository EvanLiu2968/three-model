import * as THREE from 'three'

function createScene() {
  const scene = new THREE.Scene();

  const loaderbox = new THREE.CubeTextureLoader() // 加载贴图
  const sky = loaderbox.load([
    `/bird/sky/posx.jpg`,
    `/bird/sky/negx.jpg`,
    `/bird/sky/posy.jpg`,
    `/bird/sky/negy.jpg`,
    `/bird/sky/posz.jpg`,
    `/bird/sky/negz.jpg`
  ])
  scene.background = sky

  // scene.background = new THREE.Color('skyblue');

  return scene;
}

export { createScene };
