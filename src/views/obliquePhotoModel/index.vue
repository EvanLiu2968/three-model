<template>
  <div class="webgl-demo">
    <div ref="webglBox" class="webglBox"></div>
    <div class="btn-control">
      <div class="control-item" @click="onReset">相机<br/>重置</div>
      <div class="control-item" @click="onGetPosition">相机<br/>位置</div>
      <div class="control-item" @click="onMeasure">{{ isMeasure ? '关闭' : '开启' }}<br/>测量</div>
      <div class="control-item" @click="onScaleUp">放大</div>
      <div class="control-item" @click="onScaleDown">缩小</div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { World } from './model.js';

const webglBox = ref(null);
const isMeasure = ref(false);

let world

onMounted(() => {
  // create a new world
  world = new World(webglBox.value);
  world.init();
  // start the animation loop
  world.start();
});

onUnmounted(() => {
  world.destroy()
})

const onReset = () => {
  world.resetCameraView()
}
const onGetPosition = () => {
  const { x, y, z } = world.getCameraPosition()
  console.log('相机位置：', Math.floor(x), Math.floor(y), Math.floor(z))
}
const onMeasure = () => {
  isMeasure.value = !isMeasure.value
  if (isMeasure.value) {
    world.measureOpen()
  } else {
    world.measureClose()
  }
}
const onScaleUp = () => {
  world.scaleUp()
}
const onScaleDown = () => {
  world.scaleDown()
}
</script>

<style lang="scss" scoped>
.webglBox {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #f0f0f0;
}
.btn-control {
  position: absolute;
  top: 30px;
  right: 20px;
  display: inline-block;
  color: #fff;
}
.control-item {
  margin-bottom: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.5);
  border-width: 0px;
  border-radius: 25px;
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
}
</style>
