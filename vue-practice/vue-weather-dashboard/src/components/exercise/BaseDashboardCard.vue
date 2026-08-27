<script setup>
// 검색박스와 리스트박스의 "테두리 있는 흰 패널" 디자인을 공통화한 껍데기 컴포넌트.
// 안에 무엇이 들어갈지는 모른다 — 부모가 slot 으로 주입한다.
defineProps({
  title: String,
})
</script>

<template>
  <section class="base-dashboard-card">
    <h3 v-if="title" class="card-title">{{ title }}</h3>

    <!-- 부모가 주입한 내용이 이 자리에 들어온다 -->
    <slot>
      <p class="placeholder">표시할 내용이 없습니다.</p>
    </slot>
  </section>
</template>

<style scoped>
.base-dashboard-card {
  background: #ffffff;
  border: 1px solid #e9e6e0;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #45443f;
  margin-bottom: 0.75rem;
}

.placeholder {
  font-size: 0.82rem;
  color: #8b8880;
}
</style>
