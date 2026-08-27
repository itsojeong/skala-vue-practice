<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'

// 과제 2의 반응형 데이터를 그대로 유지 — 상태는 전부 부모가 소유한다
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '강릉', temp: 21, status: '흐림' },
  { id: 'city_05', name: '제주', temp: 31, status: '맑음' },
])

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

watch(selectedCityInfo, (newValue) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newValue}"`)
})

watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

// 자식(SearchBar)이 올린 update-query 이벤트를 받아 부모 상태를 바꾼다
const onUpdateQuery = (value) => {
  searchQuery.value = value
}

// 자식(WeatherCard)이 올린 select-card / click-detail 이벤트 처리
const onSelectCard = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

const onClickDetail = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}
</script>

<template>
  <div class="weather-app">
    <h2 class="app-title">🌤️ 과제 3: 날씨 (컴포넌트)</h2>

    <!-- BaseDashboardCard 는 껍데기만 제공하고, 내용은 slot 으로 주입한다.
         주입된 SearchBar 는 부모 스코프에서 평가되므로 여기서 직접 바인딩/통신할 수 있다. -->
    <BaseDashboardCard title="🔍 도시 검색 (한글 즉시 동기화)">
      <SearchBar :query="searchQuery" @update-query="onUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard title="🌈 지역별 날씨 현황">
      <template v-if="filteredWeatherList.length > 0">
        <WeatherCard
          v-for="city in filteredWeatherList"
          :key="city.id"
          :city="city"
          @select-card="onSelectCard"
          @click-detail="onClickDetail"
        />
      </template>
      <p v-else class="empty">검색 결과가 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>

<style scoped>
.weather-app {
  max-width: 480px;
  margin: 0 auto;
  padding: 1.25rem;
  border-radius: 14px;
  background: #fafaf8;
  color: #45443f;
  font-size: 0.9rem;
  line-height: 1.6;
}

.app-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.empty {
  padding: 1.25rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #8b8880;
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
