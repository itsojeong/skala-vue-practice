<script setup>
// 선택된 도시 객체를 props 로 전달받아 표시하고,
// 카드 선택 / 상세보기를 부모에게 이벤트로 올린다.
// 단위 설정과 즐겨찾기는 부모를 거치지 않고 스토어에서 직접 가져온다.
import { computed } from 'vue'
import { getIconUrl } from '@/api/openWeatherApi'
import { useConfigStore } from '@/stores/configStore'
import { useFavoriteStore } from '@/stores/favoriteStore'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

// 원본 데이터는 항상 섭씨. 표시할 때만 설정에 맞춰 변환한다.
const displayTemp = computed(() => {
  const rawTemp = props.city.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp
})

const onSelect = () => {
  emit('select-card', props.city)
}

// @click.stop 으로 카드 클릭(select-card)까지 함께 발생하는 것을 막는다
const onDetail = () => {
  emit('click-detail', props.city)
}

const onToggleFavorite = () => {
  favoriteStore.toggleFavorite(props.city.id)
}
</script>

<template>
  <div class="weather-card" @click="onSelect">
    <!-- OpenWeatherMap 이 주는 날씨 아이콘. icon 코드가 없으면 자리만 비운다 -->
    <img
      v-if="city.icon"
      class="weather-icon"
      :src="getIconUrl(city.icon)"
      :alt="city.status"
      width="56"
      height="56"
      loading="lazy"
    />

    <div class="card-body">
      <p class="city-name">{{ city.name }} ({{ city.status }})</p>
      <p class="city-temp">현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>

      <span v-if="city.temp >= 25" class="badge badge-hot">🔥 더움</span>
      <span v-else class="badge badge-cool">❄️ 선선함</span>
    </div>

    <div class="card-actions">
      <button
        class="favorite-button"
        :class="{ on: favoriteStore.isFavorite(city.id) }"
        @click.stop="onToggleFavorite"
      >
        {{ favoriteStore.isFavorite(city.id) ? '★' : '☆' }}
      </button>
      <button class="detail-button" @click.stop="onDetail">상세보기</button>
    </div>
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

.weather-icon {
  flex-shrink: 0;
  display: block;
  margin: -0.35rem 0;
}

.card-body {
  flex: 1;
  min-width: 0;
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

.card-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.favorite-button {
  padding: 0.25rem 0.45rem;
  border: 1px solid #e9e6e0;
  border-radius: 8px;
  background: #ffffff;
  color: #c9c5bd;
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;
}

.favorite-button.on {
  color: #d8a13a;
  border-color: #ecd9ac;
  background: #fdf7ea;
}

.detail-button {
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
