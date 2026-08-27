<script setup>
import { ref } from 'vue'

// 1. 배열 렌더링용 날씨 데이터
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  // 5. 본인 데이터 추가
  { id: 'city_04', name: '강릉', temp: 21, status: '흐림' },
  { id: 'city_05', name: '제주', temp: 31, status: '맑음' },
])

const searchQuery = ref('')
const statusMessage = ref('카드를 클릭하거나 검색해 보세요.')

// 3. 한글 처리: v-model 대신 :value + @input 으로 조합 중인 글자도 즉시 반영
const onInput = (event) => {
  searchQuery.value = event.target.value
}

// 4. 카드 클릭 -> 상태바 문구 변경
const selectCity = (city) => {
  statusMessage.value = `${city.name}이 선택되었습니다.`
}

// 4. 상세보기 -> 카드 클릭으로 버블링되지 않도록 @click.stop 으로 호출
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="weather-app">
    <h2 class="app-title">🌤️ 과제 1: 날씨 (Mockup)</h2>

    <!-- 도시 검색 -->
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
    </section>

    <!-- 지역별 날씨 현황 -->
    <section class="panel">
      <h3 class="panel-title">🌈 지역별 날씨 현황</h3>

      <!-- 1. v-for + :key 에 id 바인딩 -->
      <div
        v-for="city in weatherList"
        :key="city.id"
        class="weather-card"
        @click="selectCity(city)"
      >
        <div class="card-body">
          <p class="city-name">{{ city.name }} ({{ city.status }})</p>
          <p class="city-temp">현재 기온: {{ city.temp }}°C</p>

          <!-- 2. 조건부 렌더링 -->
          <span v-if="city.temp >= 25" class="badge badge-hot">🔥 더움 (25도 이상)</span>
          <span v-else class="badge badge-cool">❄️ 선선함 (25도 미만)</span>
        </div>

        <button class="detail-button" @click.stop="showDetail(city.name, city.status)">
          상세보기
        </button>
      </div>
    </section>

    <!-- 상태바 -->
    <p class="status-bar">{{ statusMessage }}</p>
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
  color: var(--ink);
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
  color: var(--ink);
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

.status-bar {
  padding: 0.7rem;
  border-radius: 10px;
  background: #eef5ee;
  color: #4f7a55;
  font-size: 0.82rem;
  text-align: center;
}
</style>
