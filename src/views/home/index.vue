<script setup>
import Model from '@/components/Model.vue'
import { ref } from 'vue'
const list = ref([
  {
    title: '3D基础示例',
    desc: '测试API',
    url: '/demo'
  },
  {
    title: '3D室内',
    desc: '3D室内空间展示',
    url: '/house'
  }
])
</script>

<template>
  <div class="home">
    <h1>{{ 'Three Model' }}</h1>
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
.list-model {
  display: flex;
}
</style>
