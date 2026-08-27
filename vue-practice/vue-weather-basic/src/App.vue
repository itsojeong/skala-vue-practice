<script setup>
// 라우터 없이 탭(v-if)으로 화면을 전환한다.
import { ref } from 'vue'

// Hands on 과제 1~3
import WeatherMockup from '@/components/weather/WeatherMockup.vue'
import WeatherComposition from '@/components/weather/WeatherComposition.vue'
import WeatherParent from '@/components/weather/component/WeatherParent.vue'

// 컴포넌트 문법 연습
import ParentComponent from '@/components/practices/component/ParentComponent.vue'
import SlotDefaultParent from '@/components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from '@/components/practices/component/SlotNamedParent.vue'
import SlotScopedParent from '@/components/practices/component/SlotScopedParent.vue'

const tabs = [
  { id: 'mockup', label: '과제 1 · Mockup' },
  { id: 'composition', label: '과제 2 · Composition' },
  { id: 'component', label: '과제 3 · Component' },
  { id: 'practice', label: 'Practice' },
]

const activeTab = ref('mockup')
</script>

<template>
  <nav class="tab-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-button"
      :class="{ active: activeTab === tab.id }"
      @click="activeTab = tab.id"
    >
      {{ tab.label }}
    </button>
  </nav>

  <main class="content">
    <WeatherMockup v-if="activeTab === 'mockup'" />
    <WeatherComposition v-else-if="activeTab === 'composition'" />
    <WeatherParent v-else-if="activeTab === 'component'" />

    <template v-else-if="activeTab === 'practice'">
      <ParentComponent />
      <SlotDefaultParent />
      <SlotNamedParent />
      <SlotScopedParent />
    </template>
  </main>
</template>

<style scoped>
.tab-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
}

.tab-button {
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.82rem;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.tab-button:hover {
  border-color: var(--color-border-hover);
}

.tab-button.active {
  background: #eef3f9;
  border-color: #b9c9de;
  color: #3f6f9e;
}

.content {
  padding-bottom: 3rem;
}
</style>
