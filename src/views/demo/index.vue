<script setup>
import { ref, reactive, onMounted } from 'vue';
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

defineProps({
  sessionTimeout: {
    type: Boolean,
  },
});

const webglBox = ref(null);

const formData = reactive({
  x: 200,
  y: 200,
  z: 200,
});

const scene = new THREE.Scene();

//创建一个长方体几何对象Geometry
const geometry = new THREE.BoxGeometry(100, 100, 100);

//创建一个材质对象Material
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000, //0xff0000设置材质颜色为红色
});

const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
//设置网格模型在三维空间中的位置坐标，默认是坐标原点
mesh.position.set(0, 10, 0);

scene.add(mesh);

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 实例化一个透视投影相机对象
const camera = new THREE.PerspectiveCamera();

// 根据需要设置相机位置具体值
camera.position.set(formData.x, formData.y, formData.z);

camera.lookAt(mesh.position); //指向mesh对应的位置

// 创建渲染器对象
const renderer = new THREE.WebGLRenderer();
// 定义threejs输出画布的尺寸(单位:像素px)
const width = window.innerWidth; //宽度
const height = window.innerHeight; //高度
renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
function render() {
  //如果后期需要控制器带有阻尼效果，或者自动旋转等效果，就需要加入controls.update()
  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

onMounted(() => {
  webglBox.value?.appendChild(renderer.domElement);
});
</script>

<template>
  <div class="webgl-demo">
    <div ref="webglBox"></div>
  </div>
</template>
