<script setup>
import SlotDefaultChild from '@/components/practices/component/SlotDefaultChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Default Slot 레이아웃 주입 실습</h2>

    <!-- 1. 단순 텍스트 주입 -->
    <SlotDefaultChild>
      <p>단순한 텍스트 문장을 주입합니다.</p>
    </SlotDefaultChild>

    <!-- 2. 여러 태그를 한 번에 주입 -->
    <SlotDefaultChild>
      <h2 style="color: #e74c3c">🔥 경고 상태</h2>
      <button>확인</button>
    </SlotDefaultChild>

    <!-- 3. 아무것도 주입하지 않으면 <slot> 안의 기본 콘텐츠가 보인다 -->
    <SlotDefaultChild></SlotDefaultChild>
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
</style>
