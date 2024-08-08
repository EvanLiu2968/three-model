import { AxesHelper, GridHelper, CubeTextureLoader } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

function createHelper(scene, options = {}) {
  if (!scene) return new Error('scene is required!')
  const gridHelper = new GridHelper(100, 10);
  gridHelper.name = 'gridHelper'
  gridHelper.visible = false

  const axesHelper = new AxesHelper(100);
  axesHelper.name = 'axesHelper'
  axesHelper.visible = false

  console.info('%caxesHelper: red is X-axis; green is Y-axis; bule is Z-axis;', 'color:#007bff')

  scene.add(gridHelper)
  scene.add(axesHelper)

  const stats = new Stats();
  document.body.appendChild(stats.domElement)

  // https://lil-gui.georgealways.com/#GUI#add
  const gui = new GUI({
    title: '辅助控制器',
  });
  gui.close()

  const remove = () => {
    document.body.removeChild(stats.domElement)
    gui.destroy()
    scene.remove(gridHelper)
    scene.remove(axesHelper)
  }

  const params = {
    helperToggle: false,
    sky: '白天',
  };

  const skyModes = {
    '白天': 'day',
    '黄昏': 'dusk',
    '夜间': 'night',
  }

  gui.add(params, 'helperToggle').onChange((val) => {
    gridHelper.visible = val
    axesHelper.visible = val
  });
  if (options.sky) {
    const toggleSky = (type) => {
      const cubeTextureLoader = new CubeTextureLoader() // 贴图加载
      const cubeTexture = cubeTextureLoader.load([
        `/images/skybox/${type}/posx.jpg`,
        `/images/skybox/${type}/negx.jpg`,
        `/images/skybox/${type}/posy.jpg`,
        `/images/skybox/${type}/negy.jpg`,
        `/images/skybox/${type}/posz.jpg`,
        `/images/skybox/${type}/negz.jpg`,
      ])
      scene.background = cubeTexture
    }
    toggleSky(options.sky)
    gui.add(params, 'sky', skyModes).onChange((val) => {
      toggleSky(val)
    });
  }

  return {
    remove,
    stats,
    gui,
    gridHelper,
    axesHelper,
  };
}

export { createHelper };
