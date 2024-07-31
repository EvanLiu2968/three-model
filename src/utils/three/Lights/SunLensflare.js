import * as THREE from 'three'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js'
import Light from './Light'

/**
 * 太阳炫光，模拟太阳
 */
export default class SunLensflare extends Light {

  constructor (scene, position = [200, 200, 200], option = { color: 'rgb(255,255,255)' }) {
    super(scene)
    this.scene = scene
    const color = new THREE.Color(option.color)
    this.light = new THREE.PointLight(color)
    this.setPosition(position)
    this.setOption(option)
    this.scene.add(this.light)
  }

  /**
   * 设置灯光参数
   * @param option
   */
  setOption (option = {}) {
    this.light.color.setHSL(0.995, 0.5, 0.9)
    // lensflares
    const textureLoader = new THREE.TextureLoader()
    this.textureFlare0 = textureLoader.load(option.lensflare0 || '/images/lensflare/lensflare0.png')
    this.textureFlare3 = textureLoader.load(option.lensflare3 || '/images/lensflare/lensflare3.png')
    // 构建炫光
    const lensflare = new Lensflare()
    lensflare.addElement(new LensflareElement(this.textureFlare0, 700, 0, this.light.color))
    lensflare.addElement(new LensflareElement(this.textureFlare3, 60, 0.6))
    lensflare.addElement(new LensflareElement(this.textureFlare3, 70, 0.7))
    lensflare.addElement(new LensflareElement(this.textureFlare3, 120, 0.9))
    lensflare.addElement(new LensflareElement(this.textureFlare3, 70, 1))
    this.light.add(lensflare)
  }
}
