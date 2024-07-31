<template>
  <video id="videoPlayer"></video>
  <div id="container" ref="container"></div>
  <div v-if="loadPercent<100" class="progress-text-con">
    正在加载模型请稍等：<span class="progress-text">{{ `${loadPercent}%` }}</span>
    <div class="progress-con">
      <div class="progress-bar" :style="{ width: `${loadPercent}%` }"></div>
    </div>
  </div>
  <div class="btn-control">
    <div class="control-item" @click="onReset">场景<br/>重置</div>
    <div class="control-item" @click="onToggleView">切换<br/>视角</div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { Water } from 'three/examples/jsm/objects/Water2'
import gsap from 'gsap'

import Viewer from './threeModules/Viewer'
import ModelLoader from './threeModules/ModelLoader'

let viewer = null
let labelIns = null // 标签实例
let car = null
let carLabel = null
let officeLabel = null
let officeBuild = null
let oldOfficeBuild = {}
let oldLaboratoryBuild = {}
let curve = null
let Mesh26 = null
let timeen = {}
let videoTextTure = null // 视频纹理
let curFloorName = '' // 当前鼠标点击选中的楼层name
let modelMoveName = '' // 当前鼠标移动过程中选中的模型name
let isSplit = false // 楼体是否分层
let lastIndex // 记录上一次点击的楼层index
const sceneList = ['实验楼']
const hiddenList = ['cityv1', '快递车', '树', '广告牌', '路灯', '水池', '人']

let progress = 0 // 物体运动时在运动路径的初始位置，范围0~1
const velocity = 0.001 // 影响运动速率的一个值，范围0~1，需要和渲染频率结合计算才能得到真正的速率
const officeFloorList = Array(6)
  .fill(0)
  .map((item, index) => `zuo${index}`) // 办公室楼层

const isDoorOpen = ref(false)
const loadPercent = ref(0)
const isDriver = ref(false)
onMounted(() => {
  init()
})
onUnmounted(() => {
  viewer.destroy()
})
const init = async () => {
  viewer = new Viewer(document.getElementById('container'))
  viewer.initComposer()
  viewer.camera.position.set(17, 10, 52)
  viewer.controls.maxPolarAngle = Math.PI / 2.1 // 限制controls的上下角度范围

  viewer.renderer.shadowMap.enabled = true
  viewer.renderer.shadowMap.type = THREE.PCFSoftShadowMap

  initLight(viewer)

  const modelLoader = new ModelLoader(viewer)

  // 初始化视频纹理
  initVideoTexture()

  const [cityModel, officeBuildModel, laboratoryBuildModel, carModel, billboardModel, treeModel, lampModel, poolModel, peopleModel] = await modelLoader.loadModels([
    '/park/glb/city-v1.glb',
    '/park/glb/officeBuild.glb',
    '/park/glTF/laboratoryBuild.gltf',
    '/park/glTF/car13.gltf',
    '/park/glb/billboard.glb',
    '/park/glTF/tree_animate/new-scene.gltf',
    '/park/glb/lightpostDouble.glb',
    '/park/glb/pool.glb',
    '/park/glb/ren.glb',
  ], progress => {
    loadPercent.value = Math.floor(progress * 100)
  });
  // 加载车辆
  loadCar(carModel)
  addModel(carModel)
  // 加载园区
  initCity(cityModel)
  addModel(cityModel)
  // 加载办公大厅
  initOfficeBuild(officeBuildModel)
  addModel(officeBuildModel)
  // 加载实验楼
  initLaboratoryBuild(laboratoryBuildModel)
  addModel(laboratoryBuildModel)
  // 加载广告牌
  loadBillBoard(billboardModel)
  addModel(billboardModel)
  // 加载树
  loadTree(treeModel)
  addModel(treeModel)
  // 加载路灯
  loadLamp(lampModel)
  addModel(lampModel)
  // 加载水池
  loadSwimmingPool(poolModel)
  addModel(poolModel)
  // 加载人
  loadPeople(peopleModel)
  addModel(peopleModel)
  viewer.initPlayer(peopleModel)
  // 办公楼鼠标移动效果
  viewer.on('mousemove', officeMouseMove)
  // 办公楼点击
  viewer.on('click', officeFloorClick)
}

const addModel = (model) => {
  viewer.scene.add(model.object)
}
/**
 * 初始化视频纹理
 */
const initVideoTexture = () => {
  const video = document.getElementById('videoPlayer')
  video.src = '/park/video/bi.mp4'
  video.autoplay = 'autoplay'
  video.loop = 'loop'
  video.muted = 'muted'
  videoTextTure = new THREE.VideoTexture(video)
}

const initLight = () => {
  const ambientLight = viewer.lights.addAmbientLight({
    color: 0xffffff,
    intensity: 1
  }) // 添加环境光
  ambientLight.light.name = 'AmbientLight'
  // 添加平行光
  viewer.lights.addDirectionalLight([100, 100, -10], {
    color: 'rgb(253,253,253)',
    intensity: 10,
    castShadow: true // 是否投射阴影
  })
  const spotLights = new THREE.Group()
  spotLights.name = 'SpotLights'
  spotLights.add(initSpotLight(10, 32, -30))
  spotLights.add(initSpotLight(-2.5, 32, -30))
  spotLights.add(initSpotLight(-15, 32, -30))
  spotLights.add(initSpotLight(22.5, 32, -30))
  viewer.scene.add(spotLights)
}

/**
 * 加载聚光灯
 */
const initSpotLight = (x, y, z) => {
  const spotLightGroup = new THREE.Group()
  const spotLight = new THREE.SpotLight()
  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  spotLightGroup.add(spotLight)
  spotLightGroup.add(spotLightHelper)
  spotLightGroup.add(spotLight.target)

  spotLight.position.set(x, y, z)
  spotLight.target.position.set(x, y - 2, z - 1)
  spotLight.penumbra = 0.8

  spotLight.visible = false
  spotLightHelper.visible = false

  return spotLightGroup
}

/**
 * 加载人
 */
const loadPeople = (model) => {
  model.openCastShadow()
  model.object.position.set(20, 0, 35)
  model.object.name = '人'
  model.startAnimal(2)
}
/**
 * 加载路灯
 */
const loadLamp = (model) => {
  model.openCastShadow()
  model.object.position.set(23, 0, 29)
  model.object.scale.set(1, 3, 1)
  model.object.name = '路灯'
  model.cloneModel([20, 0, 29])
  model.cloneModel([17, 0, 29])
  model.cloneModel([14, 0, 29])
  model.cloneModel([9, 0, 29])
  model.cloneModel([6, 0, 29])
}

/**
 * 初始化停车场栅栏
 */
const initCity = (model) => {
  model.object.name = 'cityv1'
  model.openCastShadow() // 开启投射阴影
  model.openReceiveShadow() // 开启接收阴影
  model.object.children.forEach((item) => {
    // 门口栅栏动画
    if (item.name === 'Mesh26') {
      Mesh26 = item
      gsap.to(item.scale, {
        x: item.scale.x / 8,
        duration: 5,
        ease: 'power1.inOut',
        onComplete: () => {
          makeCurve()
          isDoorOpen.value = true
        }
      })
    }
  })
  timeen = {
    fun: moveOnCurve,
    content: car
  }
  viewer.addAnimate(timeen)
}
/**
 * 加载广告牌
 */
const loadBillBoard = (model) => {
  model.openCastShadow() // 开启投射阴影
  model.object.position.set(18, -2, -35)
  model.object.rotateY(-Math.PI / 2)
  model.object.scale.set(0.5, 0.5, 0.5)
  model.object.name = '广告牌'
  const object6 = model.object.getObjectByName('Object_6')
  object6.material = new THREE.MeshBasicMaterial({
    map: videoTextTure,
    side: THREE.DoubleSide,
    transparent: true
  })
}
/**
 * 加载办公大厅
 */
const initOfficeBuild = (model) => {
  officeBuild = model
  officeBuild.openCastShadow()
  officeBuild.openReceiveShadow()
  officeBuild.object.rotation.y = Math.PI
  officeBuild.object.position.set(16, 0, -5)
  officeBuild.object.scale.set(0.2, 0.2, 0.2)
  officeBuild.object.name = '办公大厅'
  officeBuild.object.children.forEach((item) => {
    item.name = item.name.replace('zuo', '')
    if (item.name === 'ding') {
      item.name = 6
    }
    item.name--
  })
  officeBuild.object.children
    .sort((a, b) => a.name - b.name)
    .forEach((v) => {
      v.name = 'zuo' + v.name
    })
  officeBuild.forEach((child) => {
    if (child.isMesh) {
      child.frustumCulled = false // 关闭投射阴影
      child.material.emissive = child.material.color // 设置材质颜色
      child.material.emissiveMap = child.material.map // 设置材质贴图
      child.material.emissiveIntensity = 1.2 // 设置材质强度
      child.material.envmap = viewer.scene.background // 设置环境贴图
    }
  })
  oldOfficeBuild = officeBuild.object.clone()
  const buildBox = officeBuild.getBox()
  officeLabel = viewer.addCss2dLabel(
    {
      x: buildBox.max.x / 2,
      y: buildBox.max.y,
      z: buildBox.max.z
    },
    `<span class="model-label">${model.object.name}</span>`
  )
  // 添加标签动画
  gsap.to(officeLabel.position, {
    y: buildBox.max.y + 2,
    repeat: -1, // 循环播放
    yoyo: true, // 循环播放
    duration: 2, // 播放时间
    ease: 'Bounce.inOut'
  })
}
/**
 * 办公楼鼠标移动效果
 */
const officeMouseMove = (model) => {
  if (model?.parent?.parent?.name === '办公大厅' && !isSplit) {
    officeFloorList.forEach((item) => {
      if (item === model.parent.name) {
        modelMoveName = item
        if (curFloorName === modelMoveName) {
          // 如果当前选中的楼层和鼠标移动选中的楼层相同，则不给当前选中的楼层改变材质，仍保持原来的材质
          return
        }
        viewer.outlinePass && (viewer.outlinePass.selectedObjects = [officeBuild.object.getObjectByName(item)])
        // officeBuild.object.getObjectByName(item).traverse((child) => {
        //   if (child.isMesh) {
        //     child.material = new THREE.MeshPhongMaterial({
        //       color: 'yellow',
        //       transparent: true,
        //       opacity: 0.8,
        //       emissive: child.material.color, // 设置材质颜色
        //       emissiveMap: child.material.map, // 设置材质贴图
        //       emissiveIntensity: 3 // 设置材质强度
        //     })
        //   }
        // })
      } else {
        if (!isSplit) {
          // const oldModel = oldOfficeBuild.getObjectByName(item)
          // officeBuild.object.getObjectByName(item)?.traverse((child) => {
          //   if (child.isMesh) {
          //     // 将未选中的楼层赋予之前的材质
          //     child.material = oldModel.getObjectByName(child.name).material
          //   }
          // })
        }
      }
    })
  } else {
    viewer.outlinePass && (viewer.outlinePass.selectedObjects = [])
  }
}
/**
 * 办公楼点击
 */
const officeFloorClick = (model) => {
  if (model && modelMoveName) {
    const parentModel = model.parent
    if (parentModel.name.includes('zuo')) {
      if (!isSplit) {
        carLabel.visible = false
        officeLabel.visible = false
        viewer.scene.children.forEach( o => {
          if (hiddenList.includes(o.name)) {
            o.visible = false
          }
        })
        // 实验楼材质变化
        sceneList.forEach((item) => {
          viewer.scene.children
            .find((o) => o.name == item)
            .traverse((child) => {
              child.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color('rgba(7,32,96,0.76)'),
                transparent: true,
                opacity: 0.1,
                wireframe: true,
                depthWrite: true // 无法被选择，鼠标穿透
              })
            })
        })
        gsap.to(viewer.scene.children.find((o) => o.name === '人').rotation, {
          y: Math.PI, // 旋转角度
          duration: 2,
          ease: 'power1.inOut',
          onComplete: () => {
            isSplit = true
          }
        })
      }
      selectOffice(parentModel)
    } else {
      if (!isSplit) {
        const oldModel = oldOfficeBuild.getObjectByName(modelMoveName)
        officeBuild.object
          .getObjectByName(modelMoveName)
          .traverse(function (child) {
            if (child.isMesh) {
              child.material = oldModel.getObjectByName(child.name).material
            }
          })
      }
    }
  }
}

const selectOffice = (model) => {
  curFloorName = model.name
  const oldModel = oldOfficeBuild.getObjectByName(curFloorName)
  // 找到当前点击的楼层
  const modelSelectIndex = officeFloorList.findIndex(
    (item) => item === curFloorName
  )
  if (modelSelectIndex === lastIndex) return
  if (!isSplit) {
    // 楼体还未分层的时候要做的事
    officeBuild.object.children.forEach((child, index) => {
      if (child.name === curFloorName) {
        // 当前楼层附着原本材质
        child.children.forEach((ol) => {
          ol.material = oldModel.getObjectByName(ol.name).material
        })
      }
      if (index > 0) {
        isSplit = true
        gsap.to(child.position, {
          y: child.position.y + index * 10,
          duration: 2,
          ease: 'power1.inOut'
        })
      }

    })
  } else {
    // 楼体分层之后点击抽出楼层
    officeBuild.object.children.forEach((child, index) => {
      if (index === lastIndex) {
        // 将上一次抽出的楼层归位
        gsap.to(child.position, {
          z: child.position.z + 40,
          duration: 2,
          ease: 'power1.inOut'
        })
      }
      if (child.name === curFloorName) {
        gsap.to(child.position, {
          z: child.position.z - 40,
          duration: 2,
          ease: 'power1.inOut',
          onComplete: () => {
            lastIndex = index
          }
        })
      }
    })
  }

  gsap.to(viewer.controls.target, {
    x: 12,
    y: 0,
    z: -5,
    duration: 2,
    ease: 'power1.inOut',
    onComplete: () => {}
  })
}
/**
 * 加载实验楼
 */
const initLaboratoryBuild = (model) => {
  // 合批
  const geometryArr = []
  const materialArr = []
  // 获取几何体/材质数组
  model.object.traverse((item) => {
    item.updateMatrixWorld(true)
    if (item.isMesh) {
      item.geometry.applyMatrix4(item.matrixWorld)
      geometryArr.push(item.geometry)
      materialArr.push(item.material)
    }
  })
  const geometryMerged = BufferGeometryUtils.mergeGeometries(
    geometryArr,
    true
  )

  const meshMerged = new THREE.Mesh(geometryMerged, materialArr)

  model.object.remove(model.object.children[0])
  model.object.add(meshMerged)

  meshMerged.castShadow = true
  meshMerged.receiveShadow = true
  model.object.rotateY(Math.PI / 2)
  model.object.position.set(-17, 0, 5)
  model.object.scale.set(0.7, 0.7, 0.7)
  model.object.name = '实验楼'

  oldLaboratoryBuild = model.object.clone()
  const bbox = model.getBox()

  const laboratoryLabel = viewer.addCss2dLabel(
    {
      x: bbox.max.x - 10,
      y: bbox.max.y,
      z: bbox.max.z,
    },
    `<span class="model-label">${model.object.name}</span>`
  )

  // 添加标签动画
  gsap.to(laboratoryLabel.position, {
    y: bbox.max.y + 2,
    repeat: -1, // 循环播放
    yoyo: true, // 循环播放
    duration: 2, // 播放时间
    ease: 'Bounce.inOut'
  })
}
/**
 * 加载车辆
 */
const loadCar = (model) => {
  car = model
  model.openCastShadow()
  model.openReceiveShadow()
  model.object.position.set(11.5, 0, 18)
  model.object.scale.set(1, 1, 1)
  model.object.name = '快递车'

  const spotLight = new THREE.SpotLight()

  model.object.add(spotLight)
  model.object.add(spotLight.target)

  spotLight.angle = Math.PI / 4
  spotLight.position.set(0, 2, 2)
  spotLight.target.position.set(0, 1, 3)
  spotLight.penumbra = 0.8

  spotLight.castShadow = true
  // spotLight.shadow.radius = 5 // PCFSS不支持radius
  spotLight.shadow.mapSize.width = 1024
  spotLight.shadow.mapSize.height = 1024
  spotLight.shadow.camera.near = 0.1
  spotLight.shadow.camera.far = 100
  spotLight.shadow.camera.bias = 0.005 // 去除摩尔纹、伪影

  spotLight.visible = false

  let boxx = model.getBox()
  // 加载车的标签
  carLabel = viewer.addCss2dLabel(
    {
      x: boxx.max.x,
      y: boxx.max.y + 2,
      z: boxx.max.z
    },
    `<span class="model-label">${model.object.name}</span>`
  )
}
/**
 * 加载树
 */
const loadTree = (model) => {
  model.openCastShadow()
  model.object.position.set(8, 0, 16)
  model.object.scale.set(0.08, 0.08, 0.08)
  model.object.name = '树'
  model.startAnimal()
}

/**
 * 加载水池
 */
const loadSwimmingPool = (model) => {
  model.openCastShadow()
  model.openReceiveShadow()
  model.object.position.set(12, 1, -16)
  model.object.scale.set(0.6, 0.5, 0.6)
  model.object.name = '水池'

  const waterTexLoader = new THREE.TextureLoader()
  const oldWater = model.object.getObjectByName('voda_0')
  const waterMesh = new Water(oldWater.children[0].geometry, {
    textureWidth: 512,
    textureHeight: 512,
    color: 0xeeeeff,
    flowDirection: new THREE.Vector2(1, 1),
    scale: 1,
    normalMap0: waterTexLoader.load('/park/images/Water_1_M_Normal.jpg'),
    normalMap1: waterTexLoader.load('/park/images/Water_2_M_Normal.jpg')
  })
  waterMesh.name = '动态水'
  oldWater.remove(oldWater.children[0])
  oldWater.add(waterMesh)
}

/**
 * 物体沿线移动方法
 */
const moveOnCurve = (model) => {
  if (curve && car) {
    if (progress <= 1 - velocity) {
      let carObj = model.object
      let boxx = model.getBox()
      carLabel.position.set(boxx.max.x, boxx.max.y + 2, boxx.max.z)
      if (
        carObj.position.z.toFixed(2) >= 28.0 &&
        carObj.position.z.toFixed(2) <= 28.1
      ) {
        if (isDoorOpen.value) {
          gsap.to(Mesh26.scale, {
            x: Mesh26.scale.x * 8,
            duration: 5,
            ease: 'power1.inOut',
            onComplete: () => {
              isDoorOpen.value = false
            }
          })
        } else {
          gsap.to(Mesh26.scale, {
            x: Mesh26.scale.x / 8,
            duration: 5,
            ease: 'power1.inOut',
            onComplete: () => {
              isDoorOpen.value = true
              viewer.addAnimate(timeen)
            },
            onStart: () => {
              viewer.removeAnimate(timeen)
            }
          })
        }
      }

      const point = curve.getPointAt(progress) // 获取样条曲线指定点坐标
      const pointBox = curve.getPointAt(progress + velocity) // 获取样条曲线指定点坐标

      if (point && pointBox) {
        carObj.position.set(point.x, point.y, point.z)
        //因为这个模型加载进来默认面部是正对Z轴负方向的，所以直接lookAt会导致出现倒着跑的现象，这里用重新设置朝向的方法来解决。
        carObj.lookAt(pointBox.x, pointBox.y, pointBox.z)
        if (isDriver.value) {
          viewer.camera.position.set(point.x, point.y + 2, point.z)
          viewer.camera.lookAt(pointBox.x, pointBox.y + 2, pointBox.z)
        }

        const offsetAngle = 22 // 目标移动时的朝向偏移
        const mtx = new THREE.Matrix4() // 创建一个4维矩阵
        mtx.lookAt(carObj.position, pointBox, carObj.up) // 设置朝向
        mtx.multiply(
          new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(0, offsetAngle, 0)
          )
        )
        const toRot = new THREE.Quaternion().setFromRotationMatrix(mtx) //计算出需要进行旋转的四元数值
        carObj.quaternion.slerp(toRot, 0.2)
      }
      progress += velocity
    } else {
      progress = 0
    }
  }
}
const makeCurve = () => {
  // 从一系列的点创建一条平滑的三维样条曲线
  curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(11.5, 0, 18),
    new THREE.Vector3(11.5, 0, 34),
    new THREE.Vector3(35, 0, 34),
    new THREE.Vector3(35, 0, 31),
    new THREE.Vector3(11.5, 0, 31)
  ])
  curve.curveType = 'catmullrom' // 曲线类型
  curve.closed = true // 是否封闭曲线
  curve.tension = 0 // 设置线的张力，0为无弧度折线

  // 为曲线添加材质在场景中显示出来，不显示也不会影响运动轨迹，相当于一个Helper
  const points = curve.getPoints(0.1) // 获取曲线上的点
  const geometry = new THREE.BufferGeometry().setFromPoints(points) // 创建几何体
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 }) // 线材质
  const curveObject = new THREE.Line(geometry, material) // 线
  curveObject.position.y = -1
  viewer.scene.add(curveObject)
}

const onReset = () => {
  gsap.to(viewer.camera.position, {
    x: 17,
    y: 10,
    z: 52,
    duration: 2,
    ease: 'Bounce.inOut'
  })
  gsap.to(viewer.scene.children.find((o) => o.name == '人').rotation, {
    y: 0,
    duration: 2,
    ease: 'power1.inOut'
  })
  carLabel.visible = true
  officeLabel.visible = true
  viewer.scene.children.forEach( o => {
    if (hiddenList.includes(o.name)) {
      o.visible = true
    }
  })
  viewer.scene.children[
    viewer.scene.children.findIndex((o) => o.name == '实验楼')
  ] = oldLaboratoryBuild.clone()
  viewer.scene.children[
    viewer.scene.children.findIndex((o) => o.name == '办公大厅')
  ] = officeBuild.object = oldOfficeBuild.clone()
  curFloorName = ''
  modelMoveName = null
  isSplit = false
  lastIndex = null
  viewer.resetView()
}
const onToggleView = () => {
  viewer.toggleView()
}
</script>
<style lang="scss" scoped>
#videoPlayer {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 100;
  visibility: hidden;
}
#container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #f0f0f0;
}

.progress-text-con {
  position: absolute;
  top: 20px;
  left: 50%;
  margin-left: -90px;
  padding: 10px;
  width: 180px;
  font-size: 14px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  .progress-bar {
    height: inherit;
    background-color: #007bff;
    width: 0;
  }adwad
  .progress-con {
    margin-left: 10px;
    width: 160px;
    height: 10px;
    border-radius: 50px;
    background-color: white;
    margin-top: 10px;
    overflow: hidden;
  }
}

:deep(.model-label) {
  padding: 10px;
  font-size: 14px;
  color: aliceblue;
  border-radius: 5px;
  background: #007bff;
  cursor: pointer;
}

.btn-control {
  position: absolute;
  top: 30px;
  right: 20px;
  display: inline-block;
  color: #fff;
}
.control-item {
  margin-bottom: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.5);
  border-width: 0px;
  border-radius: 25px;
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
}
</style>
