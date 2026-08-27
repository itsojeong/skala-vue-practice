<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 1. 반응형 상태 관리
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '강릉', temp: 21, status: '흐림' },
  { id: 'city_05', name: '제주', temp: 31, status: '맑음' },
])

// 5. 본인만의 반응형 상태 변수 추가
const showHotOnly = ref(false)

// 2. 검색 도시 (computed) — 검색어가 비면 원본, 아니면 이름에 포함된 항목만
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  const base = keyword ? weatherList.value.filter((c) => c.name.includes(keyword)) : weatherList.value
  return showHotOnly.value ? base.filter((c) => c.temp >= 25) : base
})

// 5. 본인만의 computed 추가 — 화면에 보이는 도시들의 평균 기온
const averageTemp = computed(() => {
  const list = filteredWeatherList.value
  if (list.length === 0) return 0
  const sum = list.reduce((acc, c) => acc + c.temp, 0)
  return Math.round((sum / list.length) * 10) / 10
})

// 3. watch — selectedCityInfo 가 바뀔 때만 실행 (감시 대상을 명시)
watch(selectedCityInfo, (newValue, oldValue) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newValue}" (이전: "${oldValue}")`)
})

// 3. watchEffect — 콜백 안에서 읽은 반응형 값을 자동 추적 (초기 1회도 실행)
watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

const onInput = (event) => {
  searchQuery.value = event.target.value
}

const selectCity = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="weather-app">
    <h2 class="app-title">🌤️ 과제 2: 날씨 (컴포지션)</h2>

    <section class="panel">
      <h3 class="panel-title">🔍 도시 검색</h3>
      <input
        class="search-input"
        type="text"
        placeholder="검색할 도시 이름 입력"
        :value="searchQuery"
        @input="onInput"
      />
      <p class="search-echo">검색 중인 도시: {{ searchQuery }}</p>

      <label class="filter-toggle">
        <input type="checkbox" v-model="showHotOnly" />
        25도 이상만 보기
      </label>
    </section>

    <section class="panel">
      <h3 class="panel-title">🌈 지역별 날씨 현황</h3>

      <!-- 4. 검색 결과 표시: 결과가 있으면 목록, 없으면 안내 문구 -->
      <template v-if="filteredWeatherList.length > 0">
        <div
          v-for="city in filteredWeatherList"
          :key="city.id"
          class="weather-card"
          @click="selectCity(city)"
        >
          <div class="card-body">
            <p class="city-name">{{ city.name }} ({{ city.status }})</p>
            <p class="city-temp">현재 기온: {{ city.temp }}°C</p>
            <span v-if="city.temp >= 25" class="badge badge-hot">🔥 더움 (25도 이상)</span>
            <span v-else class="badge badge-cool">❄️ 선선함 (25도 미만)</span>
          </div>

          <button class="detail-button" @click.stop="showDetail(city.name, city.status)">
            상세보기
          </button>
        </div>

        <p class="summary">표시된 {{ filteredWeatherList.length }}개 도시의 평균 기온: {{ averageTemp }}°C</p>
      </template>

      <p v-else class="empty">검색 결과가 일치하는 도시가 없습니다.</p>
    </section>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>

<style scoped>
.weather-app {
  --surface: #ffffff;
  --surface-soft: #fafaf8;
  --line: #e9e6e0;
  --ink: #45443f;
  --ink-soft: #8b8880;

  max-width: 480px;
  margin: 0 auto;
  padding: 1.25rem;
  border-radius: 14px;
  background: var(--surface-soft);
  color: var(--ink);
  font-size: 0.9rem;
  line-height: 1.6;
}

.app-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.panel-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.search-input {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--ink);
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: #b9c9de;
}

.search-echo {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--ink-soft);
}

.filter-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.6rem;
  font-size: 0.8rem;
  color: var(--ink-soft);
  cursor: pointer;
}

.weather-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface-soft);
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
  color: var(--ink-soft);
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
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--ink);
  font-size: 0.78rem;
  cursor: pointer;
}

.detail-button:hover {
  background: #f2f1ee;
}

.summary {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--ink-soft);
  text-align: right;
}

.empty {
  padding: 1.25rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: var(--ink-soft);
}

.status-bar {
  padding: 0.7rem;
  border-radius: 10px;
  background: #eef5ee;
  color: #4f7a55;
  font-size: 0.82rem;
  text-align: center;
}
</style>
