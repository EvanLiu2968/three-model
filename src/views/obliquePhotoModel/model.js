import { createControls, createRenderer, createHelper, Resizer, Loop } from '@/utils/three';
import Measure from '@/utils/three/Measure'

import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { loadModels } from './components/models/models.js';

import gsap from 'gsap'
import * as THREE from 'three'
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

class World {
  constructor(container) {
    this.container = container

    this.scene = createScene();

    this.renderer = createRenderer();

    this.camera = createCamera();
    this.camera.lookAt(this.scene.position);

    // 二维标签
    this.css2dRenderer = new CSS2DRenderer() // 标签渲染器
    this.css2dRenderer.domElement.style.zIndex = 2
    this.css2dRenderer.domElement.style.position = 'absolute'
    this.css2dRenderer.domElement.style.top = '0px'
    this.css2dRenderer.domElement.style.left = '0px'
    this.css2dRenderer.domElement.style.pointerEvents = 'none' // 避免HTML标签遮挡三维场景的鼠标事件
    this.container.appendChild(this.css2dRenderer.domElement)

    new Resizer(this.container, this.camera, this.renderer);
    new Resizer(this.container, this.camera, this.css2dRenderer);
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
        this.css2dRenderer.render(this.scene, this.camera) // 渲染2d标签场景
        this.composer ? this.composer.render() : this.renderer.render(this.scene, this.camera)
      }
    })
  }

  async init() {
    const { part1, part2, part3, part4 } = await loadModels();

    this.modelGroup = new THREE.Group();
    this.modelGroup.add(part1, part2, part3, part4);
    this.modelGroup.position.set(-280, -280, -50);
    this.scene.add(this.modelGroup)

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

  getCameraPosition() {
    return this.camera.position.clone()
  }

  resetCameraView() {
    gsap.to(this.camera.position, {
      x: 0,
      y: -540,
      z: 370,
      duration: 1,
      ease: 'Bounce.inOut'
    })
  }

  measureOpen(mode = 'Distance') {
    this.measure = new Measure(this.renderer, this.scene, this.camera, this.controls, mode, {
      unit: 'm',
      decimalPrecision: 2,
    })
    this.measure.open()
  }

  measureClose() {
    if (this.measure) {
      this.measure.close();
    }
    this.measure = null;
  }

  scaleUp() {
    const { x, y, z } = this.camera.position
    const scale = 0.9
    gsap.to(this.camera.position, {
      x: x * scale,
      y: y * scale,
      z: z * scale,
      duration: 1,
      ease: 'Bounce.inOut'
    })
  }

  scaleDown() {
    const { x, y, z } = this.camera.position
    const scale = 0.9
    gsap.to(this.camera.position, {
      x: x / scale,
      y: y / scale,
      z: z / scale,
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
