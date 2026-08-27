<script setup>
import { ref } from 'vue'

const props = defineProps({
  message: String,
})

const emit = defineEmits(['reply'])

const replyText = ref('')

function sendReply() {
  if (!replyText.value) return
  emit('reply', replyText.value)
  replyText.value = ''
}
</script>

<template>
  <div class="child">
    <h2>Child Component</h2>

    <!-- props: 부모 -> 자식으로 내려온 값 -->
    <p>받은 props: {{ props.message }}</p>

    <!-- emits: 자식 -> 부모로 이벤트 올려보내기 -->
    <input v-model="replyText" placeholder="부모에게 보낼 메시지" @keyup.enter="sendReply" />
    <button @click="sendReply">보내기</button>
  </div>
</template>

<style scoped>
.child {
  border: 1px solid var(--color-border);
  padding: 1rem;
  margin-top: 1rem;
}
</style>
