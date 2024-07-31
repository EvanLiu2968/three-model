import * as THREE from 'three'
import Light from './Light'

/**
 * 聚光灯，从一个点沿一个方向射出，随着光线照射的变远，光线圆锥体的尺寸也逐渐增大。
 */
export default class SpotLight extends Light {

  constructor (scene, position = [0, 40, 0], option = { color: 'rgb(255,255,255)' }) {
    super(scene)
    this.scene = scene
    const color = new THREE.Color(option.color)
    this.light = new THREE.SpotLight(color)
    this.light.castShadow = true
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10), new THREE.MeshBasicMaterial({ color: color }))
    this.light.add(this.mesh)
    this.scene.add(this.light)
    this.setOption(option)
    this.setPosition(position)
  }

  /**
   * 设置灯光参数
   * @param option
   */
  setOption (option = {}) {
    this.light.intensity = option.intensity || 20 // 光线强度
    this.light.angle = option.angle || 1 // 光线强度
    this.light.distance = option.distance || 200 // 光线距离
    this.light.decay = option.decay || 1 // 光的衰减指数
    this.light.castShadow = true
    this.light.shadow.mapSize.width = 1024
    this.light.shadow.mapSize.height = 1024
    this.light.shadow.camera.near = 0.1
    this.light.shadow.camera.far = 4000
    this.light.shadow.camera.fov = 30
  }
}
