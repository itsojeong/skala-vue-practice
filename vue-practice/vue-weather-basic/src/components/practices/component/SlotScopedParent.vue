<script setup>
import SlotScopedChild from './SlotScopedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Scoped Slot 주입 실습</h2>
    <h3>상위 컴포넌트 (Parent)</h3>

    <!-- v-slot="slotBag" : 자식이 보낸 데이터가 slotBag 객체에 담겨 온다 -->
    <SlotScopedChild v-slot="slotBag">
      <div class="display-panel">
        <p>알림 메시지: {{ slotBag.text }}</p>
        <p>접속자 수: {{ slotBag.count }}명</p>
      </div>
    </SlotScopedChild>

    <!-- 주입하지 않으면 자식의 slot 기본 콘텐츠가 보인다 -->
    <SlotScopedChild></SlotScopedChild>
  </div>
</template>

<style scoped>
.practice-section {
  max-width: 640px;
  margin: 2rem auto;
}

.practice-section h2 {
  margin-bottom: 0.75rem;
}

.display-panel {
  background: #fdf3ec;
  color: #333;
  border-radius: 4px;
  padding: 0.75rem 1rem;
}
</style>
