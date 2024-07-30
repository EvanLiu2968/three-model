import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

class ObjMtlLoader {
  constructor() {
    // init
  }

  loadAsync(url) {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    return new Promise((resolve, reject) => {
      mtlLoader.load(url, (materials) => {
        materials.preload()
        objLoader.setMaterials(materials)
        objLoader.load(url.replace('.mtl', '.obj'), (object) => {
          resolve(object)
        })
      })
    })
  }
}

export { ObjMtlLoader };
