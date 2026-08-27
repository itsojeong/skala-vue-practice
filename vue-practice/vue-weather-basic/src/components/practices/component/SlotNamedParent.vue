<script setup>
import SlotNamedChild from './SlotNamedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Named Slot 주입 실습</h2>

    <SlotNamedChild>
      <!-- name="header" slot 자리로 들어간다 -->
      <template v-slot:header>
        <h3>Child 주입 제목</h3>
      </template>

      <!-- v-slot 없이 넘긴 조각은 이름없는 slot 자리로 들어간다 -->
      <p>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt..."
      </p>
    </SlotNamedChild>
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
