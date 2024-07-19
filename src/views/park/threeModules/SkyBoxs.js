import * as THREE from 'three'

// 天空盒时间类型
const skyboxType = {
  day: 'day',
  dusk: 'dusk',
  night: 'night'
}
export default class SkyBoxs {
  constructor(viewer) {
    this.viewer = viewer
  }
  /**
   * 
   * @param {*} type 天空盒类型
   */
  setSkybox(type = skyboxType.day) {
    const loaderbox = new THREE.CubeTextureLoader() // 加载贴图
    const cubeTexture = loaderbox.load([
      `/park/images/skybox/${type}/posx.jpg`,
      `/park/images/skybox/${type}/negx.jpg`,
      `/park/images/skybox/${type}/posy.jpg`,
      `/park/images/skybox/${type}/negy.jpg`,
      `/park/images/skybox/${type}/posz.jpg`,
      `/park/images/skybox/${type}/negz.jpg`
    ])
    this.viewer.scene.background = cubeTexture
  }
}