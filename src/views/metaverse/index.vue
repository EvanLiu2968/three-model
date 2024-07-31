<template>
  <div>
    <div ref="webglBox" class="webglBox"></div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { World } from './model.js';

const webglBox = ref(null);

let world

onMounted(() => {
  world = new World(webglBox.value);
  world.init();
  world.start();
});

onUnmounted(() => {
  world.destroy()
})
</script>

<style lang="scss" scoped>
.webglBox {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #000;
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
