<script setup>
// Catch-all Route 가 잡아주는 화면. 정의되지 않은 경로로 들어오면 여기로 온다.
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="notfound-page">
    <p class="code">404</p>
    <h2 class="title">페이지를 찾을 수 없습니다</h2>
    <p class="path">요청한 경로: {{ route.fullPath }}</p>

    <RouterLink class="back-link" to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.notfound-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 3rem 1.25rem;
  border-radius: 14px;
  background: #fafaf8;
  color: #45443f;
  text-align: center;
}

.code {
  font-size: 2.6rem;
  font-weight: 600;
  color: #c9c5bd;
}

.title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.path {
  font-size: 0.82rem;
  color: #8b8880;
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-block;
  padding: 0.5rem 1.1rem;
  border: 1px solid #e9e6e0;
  border-radius: 10px;
  background: #ffffff;
  color: #4c7397;
  font-size: 0.85rem;
  text-decoration: none;
}

.back-link:hover {
  background: #f2f1ee;
}
</style>
