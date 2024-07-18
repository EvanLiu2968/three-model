import { createRouter, createWebHashHistory } from 'vue-router';

// app router
export const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHashHistory('/'),
  // 应该添加到路由的初始路由列表。
  routes: [
    {
      path: '/bird',
      name: 'Bird',
      component: () => import('@/views/bird/index.vue'),
      meta: {
        title: 'webgl-bird',
      },
    },
    {
      path: '/house',
      name: 'House',
      component: () => import('@/views/house/index.vue'),
      meta: {
        title: 'webgl-house',
      },
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
      },
    }
  ],
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// config router
export function setupRouter(app) {
  app.use(router);
}
