import * as THREE from 'three'
import { createControls, createRenderer, Resizer, Loop } from '@/utils/three';

import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

let camera;
let controls;
let renderer;
let scene;
let loop;
let resizer;

class World {
  constructor(container) {
    this.container = container
    camera = createCamera();

    renderer = createRenderer();
    // 定义threejs输出画布的尺寸(单位:像素px)
    const width = window.innerWidth; //宽度
    const height = window.innerHeight; //高度
    renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)

    scene = createScene();
    camera.lookAt(scene.position);
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement);

    loop.updatables.push(controls);

    const { ambientLight, mainLight } = createLights();
    scene.add(ambientLight, mainLight);

    resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    console.log('initModel begins . ');
    const boxGeo = new THREE.SphereGeometry(250, 50, 50);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
    });
    this.box = new THREE.Mesh(boxGeo, material);
    scene.add(this.box);
    const listener = new THREE.AudioListener();
    this.audio = new THREE.Audio(listener);
    this.textureLoader = new THREE.TextureLoader();
    this.box.material.map = this.textureLoader.load(
      '/panorama/panorama.jpg',
      () => {
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load(
          '/panorama/music/pipa.mp3',
          (audioBuffer) => {
            this.audio.setBuffer(audioBuffer);
            this.audio.setLoop(true);
            this.audio.setVolume(0.3);
            this.container.addEventListener('mousemove', () => {
              console.log('start autoplay music...');
              this.audio.play()
            }, { once: true });
          },
          (xhr) => {
            if (xhr.total === xhr.loaded) {
              console.log('onProgress xhr.total === xhr.loaded.');
            }
          },
          () => {
            /**/
          },
        );
        this.isRotatePlay = true
        this.box.tick = () => {
          if (this.isRotatePlay) {
            this.box.rotateY(0.002);
          }
        }
        loop.updatables.push(this.box);
      },
    );
  }

  render() {
    renderer.render(scene, camera);
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
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
