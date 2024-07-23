<template>
  <div>
    <div ref="webglBox"></div>
    <div class="btn-control">
      <div class="control-item" @click="toggleAudio">
        <img :src="isAudioPlay ? '/panorama/icon/audio_close.png' : '/panorama/icon/audio_open.png'" />
      </div>
      <div class="control-item" @click="toggleRotate">
        <img :src="isRotatePlay ? '/panorama/icon/rotate_stop.png' : '/panorama/icon/rotate_start.png'" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { World } from './model.js';

const webglBox = ref(null);

let world

const isAudioPlay = ref(true)
const isRotatePlay = ref(true)

onMounted(() => {
  world = new World(webglBox.value);
  world.init();
  world.start();
});

onUnmounted(() => {
  world.destroy()
})

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
