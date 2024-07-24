import * as THREE from 'three'
export default class SkyBoxs {
  constructor(viewer) {
    this.viewer = viewer
  }
  /**
   * 
   * @param {*} type 天空盒类型
   */
  setSkybox(type = 'day') {
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