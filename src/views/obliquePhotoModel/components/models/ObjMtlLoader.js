import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

class ObjMtlLoader {
  constructor() {
    this.mtlLoader = new MTLLoader();
    this.objLoader = new OBJLoader();
  }

  loadAsync(url) {
    return new Promise((resolve, reject) => {
      this.mtlLoader.load(url, (materials) => {
        materials.preload()
        this.objLoader.setMaterials(materials)
        this.objLoader.load(url.replace('.mtl', '.obj'), (object) => {
          resolve(object)
        })
      })
    })
  }
}

export { ObjMtlLoader };
