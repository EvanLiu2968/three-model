
<template>
  <div class="home">
    <h1 class="title">{{ '3D·世界' }}</h1>
    <div class="list-model">
      <template v-for="(item, i) in list" :key="i">
        <div class="card" :style="{background: item.bg || '#909399'}" @click="handleRoute(item)">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { router } from '@/router'

const list = ref([
  {
    title: '3D天空',
    desc: '翱翔的小鸟',
    bg: '#409EFF',
    url: '/bird'
  },
  {
    title: '3D全景',
    desc: '3D全景空间展示',
    bg: '#E6A23C',
    url: '/panorama'
  },
  {
    title: '3D园区',
    desc: '3D园区展示',
    bg: '#67C23A',
    url: '/park'
  },
  {
    title: '3D倾斜摄影模型',
    desc: '3D倾斜摄影模型展示',
    bg: '#685CD6',
    url: '/obliquePhotoModel'
  },
  {
    title: '3D人物模型',
    desc: '3D人物模型展示',
    bg: '#F56C6C',
    url: '/metaverse'
  },
])

const handleRoute = (info) => {
  router.push(info.url)
}
</script>

<style lang="scss" scoped>
.home {
  max-width: 1080px;
  margin: 0 auto;
  .title {
    margin: 40px 0;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 2px;
    text-align: center;
  }
  .list-model {
    position: relative;
    .card {
      display: inline-block;
      box-sizing: border-box;
      margin-right: 20px;
      margin-bottom: 20px;
      padding: 20px;
      width: 200px;
      height: 200px;
      color: #fff;
      text-align: left;
      border-radius: 10px;
      cursor: pointer;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
  
}
</style>
