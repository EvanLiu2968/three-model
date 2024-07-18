<script setup>
import Model from '@/components/Model.vue'
import { ref } from 'vue'
const list = ref([
  {
    title: '3D天空',
    desc: '翱翔的小鸟',
    bg: '#409EFF',
    url: '/bird'
  },
  {
    title: '3D室内',
    desc: '3D室内空间展示',
    bg: '#E6A23C',
    url: '/house'
  }
])
</script>

<template>
  <div class="home">
    <h1 class="title">{{ '3D·世界' }}</h1>
    <div class="list-model">
      <template v-for="(item, i) in list" :key="i">
        <Model :info="item" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
.title {
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
}
.list-model {
  display: flex;
}
</style>
