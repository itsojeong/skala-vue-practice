<script setup>
// 선택된 도시 객체를 props 로 전달받아 표시하고,
// 카드 선택 / 상세보기를 부모에게 이벤트로 올린다.
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const onSelect = () => {
  emit('select-card', props.city)
}

// @click.stop 으로 카드 클릭(select-card)까지 함께 발생하는 것을 막는다
const onDetail = () => {
  emit('click-detail', props.city)
}
</script>

<template>
  <div class="weather-card" @click="onSelect">
    <div class="card-body">
      <p class="city-name">{{ city.name }} ({{ city.status }})</p>
      <p class="city-temp">현재 기온: {{ city.temp }}°C</p>

      <span v-if="city.temp >= 25" class="badge badge-hot">🔥 더움</span>
      <span v-else class="badge badge-cool">❄️ 선선함</span>
    </div>

    <button class="detail-button" @click.stop="onDetail">상세보기</button>
  </div>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem;
  border: 1px solid #e9e6e0;
  border-radius: 10px;
  background: #fafaf8;
  color: #45443f;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.weather-card + .weather-card {
  margin-top: 0.5rem;
}

.weather-card:hover {
  border-color: #cfd8e3;
}

.city-name {
  font-weight: 600;
}

.city-temp {
  font-size: 0.82rem;
  color: #8b8880;
  margin: 0.15rem 0 0.5rem;
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

.badge-hot {
  background: #fbeae6;
  color: #b4593f;
}

.badge-cool {
  background: #e9f1f9;
  color: #4c7397;
}

.detail-button {
  flex-shrink: 0;
  padding: 0.35rem 0.7rem;
  border: 1px solid #e9e6e0;
  border-radius: 8px;
  background: #ffffff;
  color: #45443f;
  font-size: 0.78rem;
  cursor: pointer;
}

.detail-button:hover {
  background: #f2f1ee;
}
</style>
