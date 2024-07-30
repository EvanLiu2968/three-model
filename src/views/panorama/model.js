import * as THREE from 'three'
import { createControls, createRenderer, createHelper, Resizer, Loop } from '@/utils/three';

import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { Howl } from "howler";

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
    console.log('initModel begins . ');
    const boxGeo = new THREE.SphereGeometry(250, 50, 50);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
    });
    this.box = new THREE.Mesh(boxGeo, material);
    this.scene.add(this.box);
    this.textureLoader = new THREE.TextureLoader();
    this.box.material.map = this.textureLoader.load('/panorama/city.webp');
    // const listener = new THREE.AudioListener();
    // this.audio = new THREE.Audio(listener);
    // const audioLoader = new THREE.AudioLoader();
    // audioLoader.load(
    //   '/panorama/city.mp3',
    //   (audioBuffer) => {
    //     this.audio.setBuffer(audioBuffer);
    //     this.audio.setLoop(true);
    //     this.audio.setVolume(1);
    //     this.container.addEventListener('mousemove', () => {
    //       console.log('start autoplay music...');
    //       this.audio.play()
    //     }, { once: true });
    //   }
    // );
    this.audio = new Howl({
      src: '/panorama/city.mp3',
      autoplay: true,
      loop: true,
      volume: 1,
    });
    this.audio.play()
    this.isRotatePlay = false
    this.box.tick = () => {
      if (this.isRotatePlay) {
        this.box.rotateY(0.002);
      }
    }
    this.loop.updatables.push(this.box);
    if (this.helper && this.helper.stats) {
      this.loop.updatables.push({
        tick: () => {
          this.helper.stats.update()
        }
      })
    }
  }

  toggleAudio(isAudioPlay) {
    if (isAudioPlay) {
      this.audio.play();
      
    } else {
      this.audio.pause();
    }
  }

  toggleRotate() {
    this.isRotatePlay = !this.isRotatePlay;
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
