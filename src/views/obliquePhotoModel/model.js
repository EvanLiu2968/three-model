import { createControls, createRenderer, createHelper, Resizer, Loop } from '@/utils/three';

import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { loadModels } from './components/models/models.js';

import gsap from 'gsap'
import * as THREE from 'three'

class World {
  constructor(container) {
    this.container = container

    this.scene = createScene();

    this.renderer = createRenderer();

    this.camera = createCamera();
    this.camera.lookAt(this.scene.position);

    new Resizer(this.container, this.camera, this.renderer);
    this.container.append(this.renderer.domElement);

    this.loop = new Loop(this.camera, this.scene, this.renderer);

    this.controls = createControls(this.camera, this.renderer.domElement);

    this.loop.updatables.push(this.controls);

    const { ambientLight, mainLight } = createLights();
    this.scene.add(ambientLight, mainLight);

    if (import.meta.env.MODE === 'development') {
      this.helper = createHelper(this.scene)
    }

    this.loop.updatables.push({
      tick: () => {
        this.composer ? this.composer.render() : this.renderer.render(this.scene, this.camera)
      }
    })
  }

  async init() {
    const { part1, part2, part3, part4 } = await loadModels();

    this.modelGroup = new THREE.Group();
    this.modelGroup.add(part1, part2, part3, part4);
    this.modelGroup.scale.set(0.1, 0.1, 0.1);
    this.modelGroup.position.set(-28, -28, -5);
    this.scene.add(this.modelGroup)

    console.log(this.scene)
    setTimeout(() => {
      this.resetCameraView()
    }, 2000)

    if (this.helper && this.helper.stats) {
      this.loop.updatables.push({
        tick: () => {
          this.helper.stats.update()
        }
      })
    }
  }

  getPosition() {
    console.log('控制器：', this.controls.target)
    console.log('相机：', this.camera.position)
  }

  resetCameraView() {
    gsap.to(this.camera.position, {
      x: 0,
      y: -54,
      z: 37,
      duration: 1,
      ease: 'Bounce.inOut'
    })
  }

  scaleUp() {
    const { x, y, z } = this.scene.scale
    const scale = 0.2
    gsap.to(this.scene.scale, {
      x: x + scale,
      y: y + scale,
      z: z + scale,
      duration: 1,
      ease: 'Bounce.inOut'
    })
  }

  scaleDown() {
    const { x, y, z } = this.scene.scale
    const scale = 0.2
    gsap.to(this.scene.scale, {
      x: x - scale,
      y: y - scale,
      z: z - scale,
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
    this.stop()
  }
}

export { World };
