<script setup>
// 부모로부터 검색어를 props 로 받아 표시하고,
// 입력이 생기면 update-query 이벤트로 부모에게 되돌려준다. (상태는 부모가 소유)
defineProps({
  query: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])

// 한글 조합 중에도 즉시 반영되도록 v-model 대신 :value + @input 사용
const onInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <input
      class="search-input"
      type="text"
      placeholder="검색할 도시 이름 입력"
      :value="query"
      @input="onInput"
    />
    <p class="search-echo">검색 중인 도시: {{ query }}</p>
  </div>
</template>

<style scoped>
.search-input {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1px solid #e9e6e0;
  border-radius: 8px;
  background: #ffffff;
  color: #45443f;
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: #b9c9de;
}

.search-echo {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #8b8880;
}
</style>
