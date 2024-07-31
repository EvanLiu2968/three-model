import * as THREE from 'three'
import Light from './Light'

/**
 * 半球光，特殊环境光，光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。半球光不能投射阴影。
 */
export default class HemisphereLight extends Light {

  constructor (scene, position = [200, 200, 200], option = { color: 'rgb(255,255,255)' }) {
    super(scene)
    this.scene = scene
    this.light = new THREE.HemisphereLight(new THREE.Color(option.color), new THREE.Color(option.groundColor))
    this.setPosition(position)
    this.setOption(option)
    this.scene.add(this.light)
  }

  /**
   * 设置灯光参数
   * @param option
   */
  setOption (option = {}) {
    const light = this.light
    light.intensity = option.intensity || 2 // 光线强度
  }
}
