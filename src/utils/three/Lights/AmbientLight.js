
import * as THREE from 'three'
import Light from './Light'

/**
 * 环境光，均匀的照亮场景中的所有物体；环境光不能用来投射阴影，因为它没有方向。
 */
export default class AmbientLight extends Light {

  constructor(scene, option = { color: 'rgb(255,255,255)' }) {
    super(scene)
    this.scene = scene
    this.light = new THREE.AmbientLight(0x404040) // soft white light
    this.setOption(option)
    this.scene.add(this.light)
  }

  /**
   * 设置灯光参数
   * @param option
   */
  setOption(option = {}) {
    this.light.intensity = option.intensity || 1 // 光线强度
  }
}
