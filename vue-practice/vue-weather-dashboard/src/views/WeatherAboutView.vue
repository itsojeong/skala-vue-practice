<script setup>
// 서비스 소개용 정적 페이지. 데이터 없이 마크업만 있는 화면도 하나의 라우트가 된다.
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="about-page">
    <h2 class="page-title">☁️ 서비스 소개</h2>

    <section class="card">
      <p>
        이 대시보드는 Vue 3 Composition API 학습용으로 만든 날씨 정보 예제입니다.
        실제 기상청 API 대신 임시 Mock Data 를 사용합니다.
      </p>
    </section>

    <section class="card">
      <h3 class="card-title">사용한 기능</h3>
      <ul>
        <li>배열 렌더링 (v-for) 과 조건부 렌더링 (v-if)</li>
        <li>props / emits 로 부모-자식 컴포넌트 통신</li>
        <li>slot 으로 레이아웃 공통화</li>
        <li>computed · watch · watchEffect 반응형 처리</li>
        <li>Vue Router 지연 로딩과 동적 경로 매칭</li>
      </ul>
    </section>

    <RouterLink class="back-link" to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 1.25rem;
  border-radius: 14px;
  background: #fafaf8;
  color: #45443f;
  font-size: 0.9rem;
  line-height: 1.7;
}

.page-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card {
  border: 1px solid #e9e6e0;
  border-radius: 12px;
  background: #ffffff;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

ul {
  padding-left: 1.1rem;
  color: #6e6b65;
}

li {
  list-style: disc;
  font-size: 0.85rem;
}

.back-link {
  display: block;
  padding: 0.6rem;
  border: 1px solid #e9e6e0;
  border-radius: 10px;
  background: #ffffff;
  color: #4c7397;
  font-size: 0.85rem;
  text-align: center;
  text-decoration: none;
}

.back-link:hover {
  background: #f2f1ee;
}
</style>
