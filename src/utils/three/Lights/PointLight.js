import * as THREE from 'three'
import Light from './Light'

/**
 * 点光源，可模拟一个灯泡发出的光。
 */
export default class PointLight extends Light {

  constructor (scene, position = [0, 40, 0], option = { color: 'rgb(255,255,255)' }) {
    super(scene)
    this.scene = scene
    const color = new THREE.Color(option.color)
    this.light = new THREE.PointLight(color)
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
    this.light.distance = option.distance || 200 // 光线距离
    this.light.decay = option.decay || 1 // 光的衰减指数
  }
}
