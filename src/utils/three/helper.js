import { AxesHelper, GridHelper } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js'

function createHelper(scene, options = {}) {
  const gridHelper = new GridHelper(100, 10);
  gridHelper.name = 'gridHelper'
  gridHelper.visible = false

  const axesHelper = new AxesHelper(10);
  axesHelper.name = 'axesHelper'
  axesHelper.visible = false

  const stats = new Stats();
  document.body.appendChild(stats.domElement)


  if (scene) {
    scene.add(gridHelper)
    scene.add(axesHelper)
    // insert toggle button
    const toggleFunc = () => {
      gridHelper.visible = !gridHelper.visible
      axesHelper.visible = !axesHelper.visible
    }
    let helperToggle = document.getElementById('helperToggle')
    if (!helperToggle) {
      helperToggle = document.createElement('div')
      helperToggle.id = 'helperToggle'
      helperToggle.innerHTML = `<span>切换<br/>辅助</span>`
      helperToggle.style = `position:fixed;left:10px;top:80px;width:50px;height:50px;display:flex;justify-content:center;align-items:center;color:#fff;font-size:12px;background:rgba(0, 0, 0, 0.5);border-radius:50%;cursor:pointer;`
      document.body.appendChild(helperToggle)
      console.info('%caxesHelper: red is X-axis; green is Y-axis; bule is Z-axis;', 'color:#007bff')
    }
    helperToggle.onclick = toggleFunc
  }

  return {
    stats,
    // gui,
    gridHelper,
    axesHelper,
  };
}

export { createHelper };
