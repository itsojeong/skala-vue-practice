<script setup>
// App.vue 는 이제 내비게이션 바와 수문장(RouterView)만 담당한다.
// 실제 화면 내용은 전부 views/ 아래 페이지 컴포넌트가 그린다.
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
</script>

<template>
  <nav class="nav-bar">
    <RouterLink to="/">대시보드</RouterLink>
    <RouterLink to="/stats">통계</RouterLink>
    <RouterLink to="/about">소개</RouterLink>

    <!-- 내비게이션 바 옆에 단위 설정 영역 배치 -->
    <UnitToggler class="nav-unit" />
  </nav>

  <main class="content">
    <RouterView />
  </main>
</template>

<style scoped>
.nav-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
}

.nav-bar a {
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text);
  font-size: 0.82rem;
  text-decoration: none;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.nav-bar a:hover {
  background-color: transparent;
  border-color: var(--color-border-hover);
}

/* 현재 경로와 정확히 일치하는 링크에 Vue Router 가 자동으로 붙여주는 클래스 */
.nav-bar a.router-link-exact-active {
  background: #eef3f9;
  border-color: #b9c9de;
  color: #3f6f9e;
}


/* 단위 설정은 링크가 아니므로 링크 목록에서 살짝 띄워 놓는다 */
.nav-unit {
  margin-left: 0.6rem;
  padding-left: 0.9rem;
  border-left: 1px solid var(--color-border);
}

.content {
  padding-bottom: 3rem;
}
</style>
