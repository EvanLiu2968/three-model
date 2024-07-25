
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Color,
} from 'three'
import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer' // 二维标签渲染器
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer' // 三维标签渲染器
import { createControls, createRenderer, createHelper, Resizer, Loop } from '@/utils/three';
import Lights from './Lights'

export default class Viewer {
  constructor(dom) {
    this.viewerDom = dom
    this.animateEventList = []
    this.init()
    this.start()
  }
  init() {
    this.initRenderer()
    this.initCamera()
    this.initScene()

    new Resizer(this.viewerDom, this.camera, this.renderer);
    new Resizer(this.viewerDom, this.camera, this.labelRenderer);
    new Resizer(this.viewerDom, this.camera, this.css3DRenderer);

    this.lights = new Lights(this)

    this.controls = createControls(this.camera, this.renderer.domElement);

    this.loop = new Loop(this.camera, this.scene, this.renderer);

    if (import.meta.env.MODE === 'development') {
      this.helper = createHelper(this.scene)
    }
    if (this.helper && this.helper.stats) {
      this.loop.updatables.push({
        tick: () => {
          this.helper.stats.update()
        }
      })
    }

    this.loop.updatables.push(this.controls);

    this.loop.updatables.push({
      tick: () => {
        this.labelRenderer.render(this.scene, this.camera) // 渲染2d标签场景
        this.css3DRenderer.render(this.css3dScene, this.camera) // 渲染3d标签场景
        // 全局的公共动画函数，添加函数可同步执行
        this.animateEventList.forEach((event) => {
          event.fun && event.content && event.fun(event.content)
        })
      }
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
  /**
   * 创建初始化场景界面
   */
  initRenderer() {
    // 初始化渲染器
    this.renderer = new WebGLRenderer({
      // logarithmicDepthBuffer: true, // true/false 表示是否使用对数深度缓冲，true性能不好
      antialias: true, // true/false表示是否开启反锯齿
      alpha: true, // true/false 表示是否可以设置背景色透明
      precision: 'highp', // highp/mediump/lowp 表示着色精度选择
      premultipliedAlpha: true // true/false 表示是否可以设置像素深度（用来度量图像的分辨率）
    })
    this.renderer.clearDepth() // 设置深度缓冲区
    this.renderer.shadowMap.enabled = true // 场景中的阴影自动更新
    this.viewerDom.appendChild(this.renderer.domElement) // 将渲染器添加到画布中
    // 二维标签
    this.labelRenderer = new CSS2DRenderer() // 标签渲染器
    this.labelRenderer.domElement.style.zIndex = 2
    this.labelRenderer.domElement.style.position = 'absolute'
    this.labelRenderer.domElement.style.top = '0px'
    this.labelRenderer.domElement.style.left = '0px'
    this.labelRenderer.domElement.style.pointerEvents = 'none' // 避免HTML标签遮挡三维场景的鼠标事件
    this.viewerDom.appendChild(this.labelRenderer.domElement)

    // 三维标签
    this.css3DRenderer = new CSS3DRenderer() // 标签渲染器
    this.css3DRenderer.domElement.style.zIndex = 0
    this.css3DRenderer.domElement.style.position = 'absolute'
    this.css3DRenderer.domElement.style.top = '0px'
    this.css3DRenderer.domElement.style.left = '0px'
    this.css3DRenderer.domElement.style.pointerEvents = 'none' // 避免HTML标签遮挡三维场景的鼠标事件
    this.viewerDom.appendChild(this.css3DRenderer.domElement)
  }
  /**
   * 渲染相机
   */
  initCamera() {
    this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500000) // 透视相机
    this.camera.position.set(50, 0, 50) // 相机位置
    this.camera.lookAt(0, 0, 0) // 设置相机方向
  }
  /**
   * 渲染场景
   */
  initScene() {
    this.scene = new Scene()
    this.scene.background = new Color('rgb(5,24,38)')
    this.css3dScene = new Scene()
  }
  /**
   * 添加全局的动画事件
   * @param animate 函数加参数对象
   * 传入对象 = { fun: 函数名称, content: 函数参数 }
   */
  addAnimate(animate) {
    this.animateEventList.push(animate)
  }
  /**
   * 移除全局的动画事件
   * @param animate 函数加参数对象
   * 传入对象 = { fun: 函数名称, content: 函数参数 }
   */
  removeAnimate(animate) {
    this.animateEventList.map((val, i) => {
      if (val === animate) this.animateEventList.splice(i, 1)
    })
  }
  /**
   * 添加2d标签
   * @param {*} position
   * @param {*} html html内容
   */
  addCss2dLabel(position = { x: 0, y: 0, z: 0 }, html = "") {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.innerHTML = html
    const label = new CSS2DObject(div)
    label.position.set(position.x, position.y, position.z)
    this.scene.add(label)
    return label
  }
  on(event, callback) {
    this.renderer.domElement.addEventListener(event, (e => {
      const raycaster = new THREE.Raycaster() // 创建射线
      const mouse = new THREE.Vector2() // 创建鼠标坐标
      mouse.x = (e.offsetX / this.renderer.domElement.clientWidth) * 2 - 1
      mouse.y = -(e.offsetY / this.renderer.domElement.clientHeight) * 2 + 1
      raycaster.setFromCamera(mouse, this.camera) // 设置射线的起点和终点
      // TODO: 第一个参数是否需要外部传入，减小监听范围
      const intersects = raycaster.intersectObject(this.scene, true) // 检测射线与模型是否相交
      if (intersects.length) {
        callback(intersects[0].object)
      }
    }))
  }
  // TODO: 目前无法移除on事件
  off(event, callback) {
    this.renderer.domElement.removeEventListener(event, callback)
  }
}
