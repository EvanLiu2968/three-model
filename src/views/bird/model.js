import { createControls, createRenderer, createHelper, Resizer, Loop } from '@/utils/three';

import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { loadBirds } from './components/birds/birds.js';

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

    if (import.meta.env.MODE === 'development') {
      this.helper = createHelper(scene)
    }

    resizer = new Resizer(container, camera, renderer);

    loop.updatables.push({
      tick: () => {
        TWEEN.update()
      }
    })
  }

  async init() {
    const { parrot, flamingo, stork } = await loadBirds();

    this.birds = ['parrot', 'flamingo', 'stork']
    this.activeBird = 'parrot'

    controls.target.copy(parrot.position);
    loop.updatables.push(parrot, flamingo, stork);
    scene.add(parrot, flamingo, stork);

    if (this.helper && this.helper.stats) {
      loop.updatables.push({
        tick: () => {
          this.helper.stats.update()
        }
      })
    }
  }

  render() {
    renderer.render(scene, camera);
  }

  focusNext() {
    const index = this.birds.findIndex(name => name === this.activeBird)
    const nextBird = index >= (this.birds.length-1) ? this.birds[0] : this.birds[index+1]
    this.activeBird = nextBird
    const target = scene.getObjectByName(nextBird)
    // controls.target.copy(target.position);
    // 创建平滑过渡的Tween对象
    const tween = new TWEEN.Tween({
      x: controls.target.x,
      y: controls.target.y,
      z: controls.target.z,
      x1: camera.position.x,
      y1: camera.position.y,
      z1: camera.position.z,
    });

    // 定义平滑过渡的动画并设置回调函数更新控制器
    tween.to({
      x: target.position.x,
      y: target.position.y,
      z: target.position.z,
      x1: target.position.x-8,
      y1: target.position.y+8,
      z1: target.position.z+12,
    }, 1000)
     .easing(TWEEN.Easing.Quadratic.Out)
     .onUpdate((e) => {
      // console.log(e)
       controls.target.set(e.x, e.y, e.z);
       camera.position.set(e.x1, e.y1, e.z1);
     })
     .onComplete(() => {
       // 动画完成后的回调函数（可选）
       console.log('Animation complete.');
     })
     .start(); // 启动动画
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
