<template>
  <div class="webgl-demo">
    <div ref="webglBox"></div>
    <div class="toggle-control">
      <div class="control-item" @click="toggleAudio">
        <img :src="isAudioPlay ? '/house/icon/audio_close.png' : '/house/icon/audio_open.png'" />
      </div>
      <div class="control-item" @click="toggleRotate">
        <img :src="isRotatePlay ? '/house/icon/rotate_stop.png' : '/house/icon/rotate_start.png'" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { World } from './World.js';

const webglBox = ref(null);

let world

const isAudioPlay = ref(true)
const isRotatePlay = ref(true)

onMounted(() => {
  // create a new world
  world = new World(webglBox.value);
  world.init();
  // start the animation loop
  world.start();
});

const toggleAudio = () => {
  isAudioPlay.value = !isAudioPlay.value
  world.toggleAudio(isAudioPlay.value)
}
const toggleRotate = () => {
  isRotatePlay.value = !isRotatePlay.value
  world.toggleRotate(isRotatePlay.value)
}
</script>

<style lang="scss" scoped>
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
.control-item {
  margin-bottom: 10px;
  font-size: 25px;
  background: rgba(0, 0, 0, 0.5);
  border-width: 0px;
  border-radius: 25px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
}
</style>
