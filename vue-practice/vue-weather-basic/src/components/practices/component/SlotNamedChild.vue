<template>
  <div class="base-card">
    <header>
      <!-- 이름있는 slot: 부모의 <template v-slot:header> 조각이 들어온다 -->
      <slot name="header"></slot>
    </header>
    <main>
      <!-- 이름없는 slot: 이름 지정 없이 넘어온 나머지 조각이 들어온다 -->
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.base-card {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 1rem 1.25rem;
  background: var(--color-background-soft);
}

header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
}
</style>
