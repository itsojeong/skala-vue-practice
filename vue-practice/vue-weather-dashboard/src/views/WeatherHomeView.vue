<script setup>
// "/" 경로의 메인 대시보드.
// 과제 6부터 날씨 값은 Mock 이 아니라 OpenWeatherMap API 응답이다.
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useWeatherStore } from '@/stores/weatherStore'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const weatherStore = useWeatherStore()

const showFavoriteOnly = ref(false)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 화면이 처음 붙는 시점에 API 를 호출한다
onMounted(() => {
  weatherStore.fetchAll()
})

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  const base = keyword
    ? weatherStore.weatherList.filter((city) => city.name.includes(keyword))
    : weatherStore.weatherList

  // 스토어의 즐겨찾기 목록으로 한 번 더 거른다
  return showFavoriteOnly.value ? base.filter((city) => favoriteStore.isFavorite(city.id)) : base
})

watch(selectedCityInfo, (newValue) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newValue}"`)
})

watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

const onUpdateQuery = (value) => {
  searchQuery.value = value
}

const onSelectCard = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

// Programmatic Navigation — 코드로 직접 경로를 밀어 넣는다
const onClickDetail = (city) => {
  router.push('/weather/' + city.id)
}
</script>

<template>
  <div class="weather-app">
    <h2 class="app-title">🌤️ 날씨 대시보드</h2>

    <BaseDashboardCard title="🔍 도시 검색 (한글 즉시 동기화)">
      <SearchBar :query="searchQuery" @update-query="onUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard title="🌈 지역별 날씨 현황">
      <label class="favorite-filter">
        <input type="checkbox" v-model="showFavoriteOnly" />
        즐겨찾기만 보기 ({{ favoriteStore.favoriteCount }}개)
      </label>

      <!-- 통신 상태에 따라 세 가지 화면을 나눠 보여준다 -->
      <p v-if="weatherStore.loading" class="state-msg">날씨 정보를 불러오는 중…</p>

      <div v-else-if="weatherStore.error" class="state-error">
        <p>{{ weatherStore.error }}</p>
        <button class="retry-button" @click="weatherStore.fetchAll(true)">다시 시도</button>
      </div>

      <template v-else-if="filteredWeatherList.length > 0">
        <WeatherCard
          v-for="city in filteredWeatherList"
          :key="city.id"
          :city="city"
          @select-card="onSelectCard"
          @click-detail="onClickDetail"
        />
        <p class="loaded-at">
          {{ weatherStore.loadedAt }} 기준
          <button class="refresh-button" @click="weatherStore.fetchAll(true)">새로고침</button>
        </p>
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

.favorite-filter {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
  font-size: 0.8rem;
  color: #8b8880;
  cursor: pointer;
}

.state-msg {
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #8b8880;
}

.state-error {
  padding: 1rem;
  border: 1px solid #ecd9d3;
  border-radius: 10px;
  background: #fdf3f0;
  color: #b4593f;
  font-size: 0.82rem;
  text-align: center;
}

.retry-button,
.refresh-button {
  margin-top: 0.5rem;
  padding: 0.3rem 0.7rem;
  border: 1px solid #e9e6e0;
  border-radius: 8px;
  background: #ffffff;
  color: #45443f;
  font-size: 0.76rem;
  cursor: pointer;
}

.loaded-at {
  margin-top: 0.6rem;
  font-size: 0.75rem;
  color: #8b8880;
  text-align: right;
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
