import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { loadBirds } from './components/birds/birds.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import * as TWEEN from '@tweenjs/tween.js'

let camera;
let controls;
let renderer;
let scene;
let loop;
let resizer;

class World {
  constructor(container) {
    camera = createCamera();

    renderer = createRenderer();
    // 定义threejs输出画布的尺寸(单位:像素px)
    const width = window.innerWidth; //宽度
    const height = window.innerHeight; //高度
    renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)

    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement);

    loop.updatables.push(controls);

    const { ambientLight, mainLight } = createLights();
    scene.add(ambientLight, mainLight);

    resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    const { parrot, flamingo, stork } = await loadBirds();

    this.birds = ['parrot', 'flamingo', 'stork']
    this.activeBird = 'parrot'

    controls.target.copy(parrot.position);
    loop.updatables.push(parrot, flamingo, stork);
    scene.add(parrot, flamingo, stork);
  }

  render() {
    renderer.render(scene, camera);
  }

  focusNext() {
    const index = this.birds.findIndex(name => name === this.activeBird)
    const nextBird = index >= (this.birds.length-1) ? this.birds[0] : this.birds[index+1]
    this.activeBird = nextBird
    const target = scene.getObjectByName(nextBird)
    controls.target.copy(target.position);
    // 创建平滑过渡的Tween对象
    // const tween = new TWEEN.Tween({ position: camera.position, target: controls.target });

    // // 定义平滑过渡的动画并设置回调函数更新控制器
    // tween.to({ position: target.position, target: target.position }, 2000)
    //  .easing(TWEEN.Easing.Quadratic.Out)
    //  .onUpdate((object) => {
    //   console.log(object)
    //    camera.position.set(object.x1, object.y1, object.z1);
    //    controls.target.set(object.x2, object.y2, object.z2);
    //  })
    //  .onComplete(() => {
    //    // 动画完成后的回调函数（可选）
    //    console.log('Animation complete.');
    //  })
    //  .start(); // 启动动画
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
