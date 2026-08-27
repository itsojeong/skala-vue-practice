import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- 과제 4: Weather Router ---
    {
      path: '/',
      name: 'weather-home',
      // Lazy Loading: 해당 경로에 처음 들어갈 때 별도 청크로 내려받는다
      component: () => import('@/views/WeatherHomeView.vue'),
    },
    {
      // 동적 경로 매칭 — :cityId 자리에 들어온 값이 route.params.cityId 가 된다
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('@/views/WeatherDetailView.vue'),
    },
    {
      path: '/about',
      name: 'weather-about',
      component: () => import('@/views/WeatherAboutView.vue'),
    },
    {
      // 요구사항 6 — 직접 추가한 view
      path: '/stats',
      name: 'weather-stats',
      component: () => import('@/views/WeatherStatsView.vue'),
    },

    // --- Catch-all Route: 위 어디에도 걸리지 않은 경로 (항상 맨 마지막) ---
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
