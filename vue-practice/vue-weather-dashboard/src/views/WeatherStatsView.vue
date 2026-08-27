<script setup>
// 요구사항 6 — 직접 추가한 view. 전국 날씨 데이터를 집계해서 보여준다.
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const configStore = useConfigStore()
const weatherStore = useWeatherStore()

// 대시보드에서 이미 받아왔다면 fetchAll 이 그냥 반환한다 (중복 호출 방지)
onMounted(() => {
  weatherStore.fetchAll()
})

const weatherList = computed(() => weatherStore.weatherList)

// 섭씨 값을 현재 단위 설정에 맞게 바꾼다
const toDisplay = (celsius) =>
  configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius

const averageTemp = computed(() => {
  const list = weatherList.value
  if (list.length === 0) return 0
  const sum = list.reduce((acc, city) => acc + city.temp, 0)
  const avgCelsius = Math.round((sum / list.length) * 10) / 10
  return toDisplay(avgCelsius)
})

const hottest = computed(() =>
  weatherList.value.reduce((max, city) => (city.temp > max.temp ? city : max), weatherList.value[0]),
)

const coldest = computed(() =>
  weatherList.value.reduce((min, city) => (city.temp < min.temp ? city : min), weatherList.value[0]),
)

// 날씨 상태별 도시 수 — { 맑음: 2, 비: 1, ... }
const statusCount = computed(() =>
  weatherList.value.reduce((acc, city) => {
    acc[city.status] = (acc[city.status] || 0) + 1
    return acc
  }, {}),
)

// 막대 길이 계산용 최대값 (빈 배열이면 Math.max 가 -Infinity 를 준다)
const maxCount = computed(() => {
  const counts = Object.values(statusCount.value)
  return counts.length ? Math.max(...counts) : 1
})
</script>

<template>
  <div class="stats-page">
    <h2 class="page-title">📊 전국 날씨 통계</h2>

    <p v-if="weatherStore.loading" class="state-msg">불러오는 중…</p>
    <p v-else-if="weatherStore.error" class="state-msg">{{ weatherStore.error }}</p>

    <template v-else-if="weatherList.length > 0">
    <section class="tile-row">
      <div class="tile">
        <p class="tile-label">평균 기온</p>
        <p class="tile-value">{{ averageTemp }}{{ configStore.unitSymbol }}</p>
      </div>
      <div class="tile">
        <p class="tile-label">최고 기온</p>
        <p class="tile-value">{{ toDisplay(hottest.temp) }}{{ configStore.unitSymbol }}</p>
        <p class="tile-sub">{{ hottest.name }}</p>
      </div>
      <div class="tile">
        <p class="tile-label">최저 기온</p>
        <p class="tile-value">{{ toDisplay(coldest.temp) }}{{ configStore.unitSymbol }}</p>
        <p class="tile-sub">{{ coldest.name }}</p>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">날씨 상태별 도시 수</h3>
      <div v-for="(count, status) in statusCount" :key="status" class="bar-row">
        <span class="bar-label">{{ status }}</span>
        <span class="bar" :style="{ width: (count / maxCount) * 100 + '%' }"></span>
        <span class="bar-count">{{ count }}</span>
      </div>
    </section>

    </template>

    <RouterLink class="back-link" to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.stats-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 1.25rem;
  border-radius: 14px;
  background: #fafaf8;
  color: #45443f;
  font-size: 0.9rem;
  line-height: 1.6;
}

.page-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.tile-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tile {
  flex: 1;
  border: 1px solid #e9e6e0;
  border-radius: 12px;
  background: #ffffff;
  padding: 0.85rem;
  text-align: center;
}

.tile-label {
  font-size: 0.75rem;
  color: #8b8880;
}

.tile-value {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0.2rem;
}

.tile-sub {
  font-size: 0.75rem;
  color: #8b8880;
}

.card {
  border: 1px solid #e9e6e0;
  border-radius: 12px;
  background: #ffffff;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.3rem 0;
}

.bar-label {
  width: 3rem;
  font-size: 0.82rem;
  color: #8b8880;
}

.bar {
  height: 0.55rem;
  min-width: 0.55rem;
  border-radius: 999px;
  background: #cfdcea;
}

.bar-count {
  font-size: 0.8rem;
  color: #8b8880;
}

.state-msg {
  padding: 2rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #8b8880;
}

.back-link {
  display: block;
  padding: 0.6rem;
  border: 1px solid #e9e6e0;
  border-radius: 10px;
  background: #ffffff;
  color: #4c7397;
  font-size: 0.85rem;
  text-align: center;
  text-decoration: none;
}

.back-link:hover {
  background: #f2f1ee;
}
</style>
