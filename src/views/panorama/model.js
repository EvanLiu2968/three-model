import * as THREE from 'three'
import { Howl } from "howler";

import { createControls, createRenderer, createScene, createHelper, Resizer, Loop } from '@/utils/three';

class World {
  constructor(container) {
    this.container = container

    this.scene = createScene();

    this.renderer = createRenderer();

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    this.camera.position.set(-10, 20, -54);

    new Resizer(this.container, this.camera, this.renderer);
    this.container.append(this.renderer.domElement);

    this.loop = new Loop(this.camera, this.scene, this.renderer);

    this.controls = createControls(this.camera, this.renderer.domElement);

    this.loop.updatables.push(this.controls);

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
    const boxGeo = new THREE.SphereGeometry(250, 50, 50);
    const params = {
      color: '#ffffff'
    }
    const material = new THREE.MeshBasicMaterial({
      color: params.color,
      lightMapIntensity: 1,
      side: THREE.BackSide,
    });
    this.helper.gui.addColor(params, 'color').onChange((val) => {
      material.color.set(val);
    });
    this.box = new THREE.Mesh(boxGeo, material);
    this.scene.add(this.box);
    this.textureLoader = new THREE.TextureLoader();
    const textureBg = this.textureLoader.load('/panorama/city.webp');
    textureBg.mapping = THREE.EquirectangularReflectionMapping
    textureBg.colorSpace = THREE.SRGBColorSpace // 显示为原图颜色
    this.box.material.map = textureBg
    this.isRotatePlay = false
    this.loop.updatables.push({
      tick: () => {
        if (this.isRotatePlay) {
          this.box.rotateY(0.002);
        }
      }
    });
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
