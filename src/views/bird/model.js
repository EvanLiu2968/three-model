import * as THREE from 'three'
import gsap from 'gsap'
import { Howl } from "howler";

import { createControls, createRenderer, createHelper, Resizer, Loop } from '@/utils/three';
import Lights from '@/utils/three/Lights'
import { loadBirds } from './birds/index.js';


class World {
  constructor(container) {
    this.container = container

    this.scene = new THREE.Scene();

    this.renderer = createRenderer();

    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    this.camera.position.set(0, 20, 50);

    new Resizer(this.container, this.camera, this.renderer);
    this.container.append(this.renderer.domElement);

    this.loop = new Loop(this.camera, this.scene, this.renderer);

    this.controls = createControls(this.camera, this.renderer.domElement);

    this.loop.updatables.push(this.controls);

    this.lights = new Lights(this.scene);
    this.lights.addDirectionalLight()
    this.lights.addHemisphereLight()

    if (import.meta.env.MODE === 'development') {
      this.helper = createHelper(this.scene, { sky: 'day'})
    }

    this.loop.updatables.push({
      tick: () => {
        this.composer ? this.composer.render() : this.renderer.render(this.scene, this.camera)
      }
    })
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
    this.helper && this.helper.remove()
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
