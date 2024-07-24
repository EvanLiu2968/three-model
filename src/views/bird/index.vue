<template>
  <div class="webgl-demo">
    <div ref="webglBox" class="webglBox"></div>
    <div class="toggle-control" @click="toggleControl">切换视角</div>
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

<style scoped>
.webglBox {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #f0f0f0;
}
.toggle-control {
  position: absolute;
  top: 10px;
  right: 20px;
  display: inline-block;
  padding: 4px 10px;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
</style>
