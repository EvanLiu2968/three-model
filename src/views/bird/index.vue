<template>
  <div class="webgl-demo">
    <div ref="webglBox" class="webglBox"></div>
    <div class="btn-control">
      <div class="control-item" @click="toggleControl">切换<br/>视角</div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { World } from './model.js';

const webglBox = ref(null);

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

const toggleControl = () => {
  world.focusNext()
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
  top: 20px;
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
