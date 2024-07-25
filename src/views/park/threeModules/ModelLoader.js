
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import DsModel from './DsModel'

/**
 * 模型加载类（只能加载GLTF及GLB格式）
 */
export default class ModelLoader {
  constructor(viewer) {
    this.viewer = viewer
    this.progressMap = {}
    this.loaderGLTF = new GLTFLoader() // 加载gltf模型
    this.loaderFBX = new FBXLoader() // 加载fbx模型
    this.dracoLoader = new DRACOLoader() // 加载draco模型(加载基于Google Draco压缩格式的3D模型的类)
    this.dracoLoader.setDecoderPath('/park/js/draco/') // 设置draco模型解码器路径
    this.loaderGLTF.setDRACOLoader(this.dracoLoader) // 设置draco模型加载器
  }
  /**
    * 加载模型
    * @param url 模型路径
    * @param callback 回调模型
    * @param progress 返回加载进度
    */
  async loadModel(url, progress) {
    let loader = this.loaderGLTF
    if (url.indexOf('.fbx') !== -1) {
      loader = this.loaderFBX
    }
    const model = await loader.loadAsync(url, xhr => {
      const percent = (xhr.loaded / xhr.total).toFixed(2)*1
      progress?.(percent, url)
    })
    return new DsModel(model, this.viewer)
  }
  async loadModels(urls, progress) {
    this.progressMap = {}
    const models = await Promise.all(urls.map(url => this.loadModel(url, this.onProgress(progress, urls))))
    return models
  }
  onProgress(progress, urls) {
    return (percent, url) => {
      this.progressMap[url] = percent
      let current = 0
      urls.forEach(key => {
        current += this.progressMap[key] || 0
      })
      const allPercent = (current/urls.length).toFixed(2)*1
      progress?.(allPercent)
    }
  }
}
