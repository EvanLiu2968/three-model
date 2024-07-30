
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Color,
} from 'three'
import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer' // 二维标签渲染器
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer' // 三维标签渲染器
// outline postprocessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
// utils
import { createControls, createHelper, Resizer, Loop } from '@/utils/three';
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
    new Resizer(this.viewerDom, this.camera, this.css2DRenderer);
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
        this.composer ? this.composer.render() : this.renderer.render(this.scene, this.camera)
        this.css2DRenderer.render(this.scene, this.camera) // 渲染2d标签场景
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
    this.helper && this.helper.remove()
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
    this.css2DRenderer = new CSS2DRenderer() // 标签渲染器
    this.css2DRenderer.domElement.style.zIndex = 2
    this.css2DRenderer.domElement.style.position = 'absolute'
    this.css2DRenderer.domElement.style.top = '0px'
    this.css2DRenderer.domElement.style.left = '0px'
    this.css2DRenderer.domElement.style.pointerEvents = 'none' // 避免HTML标签遮挡三维场景的鼠标事件
    this.viewerDom.appendChild(this.css2DRenderer.domElement)

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
    this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100) // 透视相机500000 | 100
    this.resetView()
  }
  /**
   * 渲染场景
   */
  initScene() {
    this.scene = new Scene()
    this.scene.background = new Color('rgb(5,24,38)')
    this.css3dScene = new Scene()
  }
  initComposer() {
    // 效果组合器
    this.composer = new EffectComposer(this.renderer)
    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    // 选择模型外边框
    this.outlinePass = new OutlinePass(new THREE.Vector2(window.clientWidth, window.clientHeight), this.scene, this.camera)
    this.outlinePass.edgeStrength = 5 // 边缘强度
    this.outlinePass.edgeThickness = 1 // 边缘厚度
    this.outlinePass.edgeGlow = 1
    this.outlinePass.pulsePeriod = 2
    this.outlinePass.visibleEdgeColor.set('#0B33EC') // 可见边缘颜色
    this.outlinePass.hiddenEdgeColor.set('#3449A9') // 隐藏边缘颜色
    this.composer.addPass(this.outlinePass)
    // composer抗锯齿
    const effectFXAA = new ShaderPass(FXAAShader)
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight)
    this.composer.addPass(effectFXAA)
  }
  initPlayer(model) {
    this.isPlayerView = false
    const player = model.object
    this.player = player
    let currentAction = ''
    const idle = () => {
      if (currentAction === 'idle') return
      currentAction = 'idle'
      console.log('休闲状态')
      model.stopAnimal()
      model.startAnimal(2)
    }
    const run = () => {
      if (currentAction === 'run') return
      currentAction = 'run'
      console.log('跑步状态')
      model.stopAnimal()
      model.startAnimal(3)
    }
    const walk = () => {
      if (currentAction === 'walk') return
      currentAction = 'walk'
      console.log('步行状态')
      model.stopAnimal()
      model.startAnimal(6)
    }
    this.keyStates = {
      W: false,
      A: false,
      S: false,
      D: false,
    }
    // 用三维向量表示玩家角色(人)运动漫游速度
    const v = new THREE.Vector3(0, 0, 0);//初始速度设置为0
    const a = 8;//加速度：调节按键加速快慢
    const vMax = 5;//限制玩家角色最大速度
    const damping = -0.04;//阻尼 当没有WASD加速的时候，人、车等玩家角色慢慢减速停下来
    this.loop.updatables.push({
      tick: (deltaTime) => {
        const vL = v.length();
        if (vL < vMax && this.isPlayerView) { //限制最高速度
          if (this.keyStates.W) {
            const front = new THREE.Vector3();
            player.getWorldDirection(front);//获取玩家角色(相机)正前方
            v.add(front.multiplyScalar(a * deltaTime));
          }
          if (this.keyStates.S) {
            const front = new THREE.Vector3();
            player.getWorldDirection(front);//获取玩家角色(相机)正前方
            v.add(front.multiplyScalar(-a * deltaTime));
          }
          if (this.keyStates.A) {
            const front = new THREE.Vector3();
            player.getWorldDirection(front);
            const up = new THREE.Vector3(0, 1, 0);//y方向

            const left = up.clone().cross(front);
            v.add(left.multiplyScalar(a * deltaTime));
          }
          if (this.keyStates.D) {
            const front = new THREE.Vector3();
            player.getWorldDirection(front);
            const up = new THREE.Vector3(0, 1, 0);//y方向
            //叉乘获得垂直于向量up和front的向量 左右与叉乘顺序有关,可以用右手螺旋定则判断，也可以代码测试结合3D场景观察验证
            const right = front.clone().cross(up);
            v.add(right.multiplyScalar(a * deltaTime));
          }
        }
        if (vL < 0.2) {
          idle()
        } else if (vL >= 0.2 && vL < 1) {
          walk()
        } else if (vL >= 1) {
          run()
        }
        v.addScaledVector(v, damping);//阻尼减速
        //更新玩家角色的位置
        const deltaPos = v.clone().multiplyScalar(deltaTime);
        player.position.add(deltaPos);
        if (this.isPlayerView) {
          // this.camera.position.set(player.position.x, player.position.y+3, player.position.z-3);
          // this.camera.lookAt(player.position.x, player.position.y, player.position.z);
          
          this.controls.target.copy(player.position);
        }
      }
    })
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyW') this.keyStates.W = true
      if (event.code === 'KeyA') this.keyStates.A = true
      if (event.code === 'KeyS') this.keyStates.S = true
      if (event.code === 'KeyD') this.keyStates.D = true
    })
    document.addEventListener('keyup', (event) => {
      if (event.code === 'KeyW') this.keyStates.W = false
      if (event.code === 'KeyA') this.keyStates.A = false
      if (event.code === 'KeyS') this.keyStates.S = false
      if (event.code === 'KeyD') this.keyStates.D = false
    })
    const cameraGroup = new THREE.Group();
    cameraGroup.add(this.camera);
    this.cameraGroup = cameraGroup
    // 上下俯仰角度范围
    const angleMin = THREE.MathUtils.degToRad(-15);//角度转弧度
    const angleMax = THREE.MathUtils.degToRad(15);
    document.addEventListener('mousemove', (event) => {
      if(this.isPlayerView){
        // 左右旋转
        player.rotation.y -= event.movementX / 600;
        // 鼠标上下滑动，让相机视线上下转动
        // 相机父对象cameraGroup绕着x轴旋转,camera跟着转动
        cameraGroup.rotation.x -= event.movementY / 600;
        // 一旦判断.rotation.x小于-15，就设置为-15，大于15，就设置为15
        if (cameraGroup.rotation.x < angleMin) {
          cameraGroup.rotation.x = angleMin;
        }
        if (this.camera.rotation.x > angleMax) {
          cameraGroup.rotation.x = angleMax
        };
      }
    });
  }
  toggleView() {
    this.isPlayerView = !this.isPlayerView
    if (this.isPlayerView) {
      document.body.requestPointerLock();
      this.outlinePass.selectedObjects = []
      const player = this.player
      if (this.player && this.cameraGroup) {
        this.player.add(this.cameraGroup);
      }
      this.camera.position.set(player.position.x, player.position.y, player.position.z);
      this.camera.lookAt(player.position.x, player.position.y, player.position.z);
      // this.camera.position.set(player.position.x, player.position.y+0.5, player.position.z-1);
      // this.camera.lookAt(player.position.x, player.position.y+0.5, player.position.z+1);
    } else {
      document.exitPointerLock();
      this.resetView()
    }
  }
  resetView() {
    this.isPlayerView = false
    if (this.player && this.cameraGroup) {
      this.player.remove(this.cameraGroup);
    }
    this.camera.position.set(50, 0, 50) // 相机位置
    this.camera.lookAt(0, 0, 0) // 设置相机方向
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
  // 监听事件
  on(event, callback) {
    const _callback = (e => {
      if (this.isPlayerView) return
      const raycaster = new THREE.Raycaster() // 创建射线
      const mouse = new THREE.Vector2() // 创建鼠标坐标
      mouse.x = (e.offsetX / this.renderer.domElement.clientWidth) * 2 - 1
      mouse.y = -(e.offsetY / this.renderer.domElement.clientHeight) * 2 + 1
      raycaster.setFromCamera(mouse, this.camera) // 设置射线的起点和终点
      // TODO: 第一个参数是否需要外部传入，减小监听范围
      const intersects = raycaster.intersectObject(this.scene, true) // 检测射线与模型是否相交
      if (intersects.length) {
        const model = intersects[0].object
        callback(model)
      }
    })
    this.renderer.domElement.addEventListener(event, _callback)
    return _callback
  }
  // 移除事件，需要传入on返回的callback
  off(event, callback) {
    this.renderer.domElement.removeEventListener(event, callback)
  }
}
