<script setup>
import { router } from '@/router'

defineProps({
  info: Object,
})

const handleRoute = (info) => {
  router.push(info.url)
}

</script>

<template>
  <div class="card" :style="{background: info.bg || '#909399'}" @click="handleRoute(info)">
    <h3>{{ info.title }}</h3>
    <p>{{ info.desc }}</p>
  </div>
</template>

<style scoped>
.card {
  margin-right: 20px;
  padding: 20px;
  width: 200px;
  height: 200px;
  color: #fff;
  text-align: left;
  border: 1px solid #ddd;
  border-radius: 10px;
  cursor: pointer;
}
</style>
