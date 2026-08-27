<script setup>
// 단위 설정을 바꾸는 UI. props 도 emits 도 없다.
// 부모를 거치지 않고 스토어를 직접 읽고 쓰기 때문이다.
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label">날씨단위: {{ configStore.unitLabel }}</span>
    <button class="unit-button" @click="configStore.toggleUnit()">단위변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.unit-label {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.75;
}

.unit-button {
  padding: 0.35rem 0.8rem;
  border: 1px solid #b9c9de;
  border-radius: 999px;
  background: #eef3f9;
  color: #3f6f9e;
  font-size: 0.78rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.unit-button:hover {
  background: #e3ecf6;
}
</style>
