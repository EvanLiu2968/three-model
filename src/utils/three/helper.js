import { AxesHelper, GridHelper } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js'

function createHelper(scene, options = {}) {
  const gridHelper = new GridHelper(100, 10);
  gridHelper.name = 'gridHelper'

  const axesHelper = new AxesHelper(10);
  axesHelper.name = 'axesHelper'

  const stats = new Stats();
  document.body.appendChild(stats.domElement)


  if (scene) {
    scene.add(gridHelper)
    scene.add(axesHelper)
    console.info('%caxesHelper: red is X-axis; green is Y-axis; bule is Z-axis;', 'color:#007bff')
  }

  return {
    stats,
    // gui,
    gridHelper,
    axesHelper,
  };
}

export { createHelper };
