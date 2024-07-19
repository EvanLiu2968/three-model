<template>
  <div class="webgl-demo">
    <div ref="webglBox"></div>
    <div class="toggle-control" @click="toggleControl">切换视角</div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { World } from './World.js';

const webglBox = ref(null);

let world

onMounted(() => {
  // create a new world
  world = new World(webglBox.value);
  world.init();
  // start the animation loop
  world.start();
});

const toggleControl = () => {
  world.focusNext()
}
</script>

<style scoped>
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
