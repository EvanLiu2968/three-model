import AmbientLight from './AmbientLight.js'
import DirectionalLight from './DirectionalLight.js'
import HemisphereLight from './HemisphereLight.js'
import PointLight from './PointLight.js'
import RectAreaLight from './RectAreaLight.js'
import SpotLight from './SpotLight.js'
import SunLensflare from './SunLensflare.js'

export default class Lights {
  constructor(scene) {
    this.scene = scene
    this.lightList = []
  }

  /**
   * 添加环境光源
   */
  addAmbientLight() {
    const ambientLight = new AmbientLight(this.scene)
    this.lightList.push(ambientLight)
    return ambientLight
  }

  /**
   * 添加平行光源
   * @param option
   */
  addDirectionalLight(position = [200, 200, 200], option = { color: 'rgb(255,255,255)' }) {
    const directionalLight = new DirectionalLight(this.scene, position, option)
    this.lightList.push(directionalLight)
    return directionalLight
  }

  /**
   * 添加半球光源(特殊环境光)
   * @param option
   */
  addHemisphereLight(position = [200, 200, 200], option = { color: 'rgb(255,255,255)' }) {
    const hemisphereLight = new HemisphereLight(this.scene, position, option)
    this.lightList.push(hemisphereLight)
    return hemisphereLight
  }

  /**
   * 添加点状光源
   * @param option
   */
  addPointLight(position = [0, 40, 0], option = { color: 'rgb(255,255,255)' }) {
    const pointLight = new PointLight(this.scene, position, option)
    this.lightList.push(pointLight)
    return pointLight
  }

  /**
   * 添加矩形光源
   * @param option
   */
  addRectAreaLight(position = [0, 40, 0], option = { color: 'rgb(255,255,255)' }) {
    const rectAreaLight = new RectAreaLight(this.scene, position, option)
    this.lightList.push(rectAreaLight)
    return rectAreaLight
  }

  /**
   * 添加锥形光源
   * @param option
   */
  addSpotLight(position = [0, 40, 0], option = { color: 'rgb(255,255,255)' }) {
    const pointLight = new SpotLight(this.scene, position, option)
    this.lightList.push(pointLight)
    return pointLight
  }

  /**
   * 添加炫光
   */
  addSunLensflare(position = [200, 200, 200], option = { color: 'rgb(255,255,255)' }) {
    sunLensflare = new SunLensflare(this.scene, position, option)
    this.lightList.push(sunLensflare)
    return sunLensflare
  }

  /**
   * 移除灯光
   * @param light 灯光
   */
  removeLight(light) {
    if (light.remove) {
      light.remove()
    } else {
      this.scene.remove(light)
    }
  }
}
