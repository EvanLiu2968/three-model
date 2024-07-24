import { createControls, createRenderer, createHelper, Resizer, Loop } from '@/utils/three';

import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { loadBirds } from './components/birds/birds.js';

import gsap from 'gsap'
import { Howl } from "howler";

class World {
  constructor(container) {
    this.container = container
    this.camera = createCamera();

    this.renderer = createRenderer();
    // 定义threejs输出画布的尺寸(单位:像素px)
    const width = window.innerWidth; //宽度
    const height = window.innerHeight; //高度
    this.renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)

    this.scene = createScene();
    this.camera.lookAt(this.scene.position);
    this.loop = new Loop(this.camera, this.scene, this.renderer);
    this.container.append(this.renderer.domElement);

    this.controls = createControls(this.camera, this.renderer.domElement);

    this.loop.updatables.push(this.controls);

    const { ambientLight, mainLight } = createLights();
    this.scene.add(ambientLight, mainLight);

    if (import.meta.env.MODE === 'development') {
      this.helper = createHelper(this.scene)
    }

    this.resizer = new Resizer(this.container, this.camera, this.renderer);
  }

  async init() {
    const { parrot, flamingo, stork } = await loadBirds();

    this.birds = ['parrot', 'flamingo', 'stork']

    this.controls.target.copy(parrot.position);
    this.loop.updatables.push(parrot, flamingo, stork);
    this.scene.add(parrot, flamingo, stork);

    this.activeBird = ''
    this.focusNext()

    this.audio = new Howl({
      src: '/bird/wind.mp3',
      autoplay: true,
      loop: true,
      volume: 1,
    });
    this.audio.play()

    if (this.helper && this.helper.stats) {
      this.loop.updatables.push({
        tick: () => {
          this.helper.stats.update()
        }
      })
    }
  }

  focusNext() {
    const index = this.birds.findIndex(name => name === this.activeBird)
    const nextBird = index >= (this.birds.length-1) ? this.birds[0] : this.birds[index+1]
    this.activeBird = nextBird
    const target = this.scene.getObjectByName(nextBird)
    gsap.to(this.controls.target, {
      x: target.position.x,
      y: target.position.y,
      z: target.position.z,
      duration: 1,
      ease: 'Bounce.inOut'
    })
    gsap.to(this.camera.position, {
      x: target.position.x-8,
      y: target.position.y+8,
      z: target.position.z+12,
      duration: 1,
      ease: 'Bounce.inOut'
    })
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }

  destroy() {
    this.audio.pause()
    this.stop()
    // this.scene = null
    // this.camera = null
    // this.renderer = null
    // this.controls = null
    // this.loop = null
  }
}

export { World };
