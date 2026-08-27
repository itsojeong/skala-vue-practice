<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const parentMessage = ref('Hello from Parent Component')
const replyFromChild = ref('')

// 자식이 emit('reply', text)로 올려준 값을 여기서 받는다
function handleReply(text) {
  replyFromChild.value = text
}
</script>

<template>
  <div class="parent">
    <h1>Parent Component</h1>
    <p>부모가 가진 값: {{ parentMessage }}</p>
    <p v-if="replyFromChild">자식에게 받은 값: {{ replyFromChild }}</p>

    <ChildComponent :message="parentMessage" @reply="handleReply" />
  </div>
</template>

<style scoped>
.parent {
  max-width: 480px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid var(--color-border);
}
</style>
