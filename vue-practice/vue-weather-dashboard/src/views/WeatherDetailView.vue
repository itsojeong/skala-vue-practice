<script setup>
// 동적 경로 /weather/:cityId 를 수신하는 상세 페이지.
// 과제 6부터는 Mock 조회가 아니라 API 를 세 개 호출한다.
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCityById } from '@/data/cityList'
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchAirPollution,
  toCityWeather,
  getIconUrl,
  AQI_LABEL,
} from '@/api/openWeatherApi'
import { fetchHourlyTemperature } from '@/api/openMeteoApi'
import { useConfigStore } from '@/stores/configStore'
import { useFavoriteStore } from '@/stores/favoriteStore'

const route = useRoute()
const router = useRouter()

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

const city = ref(null)
const forecast = ref([])
const airQuality = ref(null)
const hourly = ref([])
const loading = ref(true)
const error = ref(null)

const toDisplay = (celsius) =>
  configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius

const displayTemp = computed(() => (city.value ? toDisplay(city.value.temp) : null))

onMounted(async () => {
  const target = findCityById(route.params.cityId)

  if (!target) {
    error.value = `'${route.params.cityId}' 에 해당하는 도시가 목록에 없습니다.`
    loading.value = false
    return
  }

  try {
    // 서로 의존하지 않는 요청이므로 동시에 보낸다.
    // allSettled 를 쓰면 하나가 실패해도 나머지 결과는 살릴 수 있다.
    const [currentRes, forecastRes, airRes, hourlyRes] = await Promise.allSettled([
      fetchCurrentWeather(target.lat, target.lon),
      fetchForecast(target.lat, target.lon),
      fetchAirPollution(target.lat, target.lon),
      fetchHourlyTemperature(target.lat, target.lon),
    ])

    if (currentRes.status === 'fulfilled') {
      city.value = toCityWeather(target, currentRes.value)
    } else {
      error.value = currentRes.reason.message
    }

    if (forecastRes.status === 'fulfilled') {
      // 3시간 간격 예보 중 앞의 8개 = 향후 24시간
      forecast.value = forecastRes.value.list.slice(0, 8).map((item) => ({
        time: item.dt_txt.slice(5, 16), // '08-27 09:00'
        temp: Math.round(item.main.temp),
        status: item.weather[0].description,
        icon: item.weather[0].icon,
      }))
    }

    if (airRes.status === 'fulfilled') {
      const item = airRes.value.list[0]
      airQuality.value = {
        aqi: item.main.aqi,
        label: AQI_LABEL[item.main.aqi],
        pm10: item.components.pm10,
        pm25: item.components.pm2_5,
      }
    }

    if (hourlyRes.status === 'fulfilled') {
      hourly.value = hourlyRes.value
    }
  } finally {
    loading.value = false
  }
})

const maxHourlyTemp = computed(() =>
  hourly.value.length ? Math.max(...hourly.value.map((h) => h.temp)) : 0,
)
const minHourlyTemp = computed(() =>
  hourly.value.length ? Math.min(...hourly.value.map((h) => h.temp)) : 0,
)

// 막대 높이(%) — 최저~최고 구간을 0~100 으로 편다
const barHeight = (temp) => {
  const span = maxHourlyTemp.value - minHourlyTemp.value || 1
  return 20 + ((temp - minHourlyTemp.value) / span) * 80
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="detail-page">
    <p v-if="loading" class="state-msg">불러오는 중…</p>

    <template v-else-if="city">
      <h2 class="page-title">{{ city.name }} 상세 기상관측</h2>

      <div class="summary">
        <img
          class="summary-icon"
          :src="getIconUrl(city.icon, '@4x')"
          :alt="city.status"
          width="72"
          height="72"
        />
        <div>
          <p class="temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
          <p class="status">{{ city.status }}</p>
        </div>
        <button
          class="favorite-button"
          :class="{ on: favoriteStore.isFavorite(city.id) }"
          @click="favoriteStore.toggleFavorite(city.id)"
        >
          {{ favoriteStore.isFavorite(city.id) ? '★ 즐겨찾기' : '☆ 즐겨찾기' }}
        </button>
      </div>

      <div class="badge-row">
        <span v-if="city.temp >= 25" class="badge badge-hot">🔥 더움</span>
        <span v-else class="badge badge-cool">❄️ 선선함</span>
      </div>

      <!-- 요구사항 1: 현재 날씨 API -->
      <dl class="observation">
        <div class="row"><dt>체감 온도</dt><dd>{{ toDisplay(city.detail.feelsLike) }}{{ configStore.unitSymbol }}</dd></div>
        <div class="row"><dt>습도</dt><dd>{{ city.detail.humidity }}%</dd></div>
        <div class="row"><dt>풍속</dt><dd>{{ city.detail.wind }} m/s</dd></div>
        <div class="row"><dt>기압</dt><dd>{{ city.detail.pressure }} hPa</dd></div>
        <div class="row"><dt>강수량 (1h)</dt><dd>{{ city.detail.rainfall }} mm</dd></div>
        <div class="row"><dt>일출</dt><dd>{{ city.detail.sunrise }}</dd></div>
        <div class="row"><dt>일몰</dt><dd>{{ city.detail.sunset }}</dd></div>
      </dl>

      <!-- 요구사항 2: 대기오염 API 추가 -->
      <section v-if="airQuality" class="panel">
        <h3 class="panel-title">🌫️ 대기질</h3>
        <div class="aqi-row">
          <span class="aqi-badge" :class="'aqi-' + airQuality.aqi">{{ airQuality.label }}</span>
          <span class="aqi-detail">PM10 {{ airQuality.pm10 }} · PM2.5 {{ airQuality.pm25 }} ㎍/㎥</span>
        </div>
      </section>

      <!-- 요구사항 2: 5일/3시간 예보 API 추가 -->
      <section v-if="forecast.length" class="panel">
        <h3 class="panel-title">📅 향후 24시간 예보 (3시간 간격)</h3>
        <div class="forecast-row">
          <div v-for="item in forecast" :key="item.time" class="forecast-item">
            <p class="forecast-time">{{ item.time }}</p>
            <img
              class="forecast-icon"
              :src="getIconUrl(item.icon)"
              :alt="item.status"
              width="40"
              height="40"
            />
            <p class="forecast-temp">{{ toDisplay(item.temp) }}{{ configStore.unitSymbol }}</p>
            <p class="forecast-status">{{ item.status }}</p>
          </div>
        </div>
      </section>

      <!-- 요구사항 3: 다른 외부 API (Open-Meteo) -->
      <section v-if="hourly.length" class="panel">
        <h3 class="panel-title">📈 오늘 시간대별 기온 <span class="source">Open-Meteo</span></h3>
        <div class="chart">
          <div v-for="item in hourly" :key="item.time" class="chart-col" :title="`${item.time} ${item.temp}°C`">
            <span class="chart-bar" :style="{ height: barHeight(item.temp) + '%' }"></span>
          </div>
        </div>
        <p class="chart-legend">
          최저 {{ toDisplay(minHourlyTemp) }}{{ configStore.unitSymbol }} ·
          최고 {{ toDisplay(maxHourlyTemp) }}{{ configStore.unitSymbol }}
        </p>
      </section>

      <p class="route-info">현재 경로 파라미터 cityId: {{ route.params.cityId }}</p>
    </template>

    <p v-else class="empty">{{ error }}</p>

    <button class="back-button" @click="goBack">← 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-page {
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

.summary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #e9e6e0;
  border-radius: 12px;
  background: #ffffff;
  margin-bottom: 0.75rem;
}

.summary-icon {
  flex-shrink: 0;
  display: block;
}

.temp {
  font-size: 1.6rem;
  font-weight: 600;
}

.status {
  color: #8b8880;
}

.favorite-button {
  margin-left: auto;
  padding: 0.35rem 0.7rem;
  border: 1px solid #e9e6e0;
  border-radius: 8px;
  background: #ffffff;
  color: #8b8880;
  font-size: 0.78rem;
  cursor: pointer;
}

.favorite-button.on {
  color: #d8a13a;
  border-color: #ecd9ac;
  background: #fdf7ea;
}

.badge-row {
  margin-bottom: 0.75rem;
}

.badge {
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

.observation,
.panel {
  border: 1px solid #e9e6e0;
  border-radius: 12px;
  background: #ffffff;
  padding: 0.5rem 1rem;
  margin-bottom: 0.75rem;
}

.panel {
  padding: 1rem;
}

.panel-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.source {
  font-size: 0.7rem;
  font-weight: 400;
  color: #8b8880;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 0.45rem 0;
}

.row + .row {
  border-top: 1px solid #f1efea;
}

dt {
  color: #8b8880;
  font-size: 0.85rem;
}

.aqi-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.aqi-badge {
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

.aqi-1 { background: #e9f4ec; color: #4f7a55; }
.aqi-2 { background: #e9f1f9; color: #4c7397; }
.aqi-3 { background: #fdf3e6; color: #a9762f; }
.aqi-4 { background: #fbeae6; color: #b4593f; }
.aqi-5 { background: #f5e6ea; color: #97455c; }

.aqi-detail {
  font-size: 0.78rem;
  color: #8b8880;
}

.forecast-row {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.3rem;
}

.forecast-item {
  flex: 0 0 auto;
  min-width: 4.5rem;
  padding: 0.5rem;
  border: 1px solid #f1efea;
  border-radius: 8px;
  text-align: center;
}

.forecast-time {
  font-size: 0.68rem;
  color: #8b8880;
}

.forecast-icon {
  display: block;
  margin: 0 auto;
}

.forecast-temp {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0.2rem 0;
}

.forecast-status {
  font-size: 0.68rem;
  color: #8b8880;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 4.5rem;
}

.chart-col {
  flex: 1;
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.chart-bar {
  width: 100%;
  border-radius: 2px 2px 0 0;
  background: #cfdcea;
}

.chart-legend {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #8b8880;
  text-align: right;
}

.route-info {
  margin-top: 0.75rem;
  font-size: 0.78rem;
  color: #8b8880;
  text-align: right;
}

.state-msg,
.empty {
  padding: 2rem 0;
  text-align: center;
  color: #8b8880;
}

.back-button {
  width: 100%;
  margin-top: 1rem;
  padding: 0.6rem;
  border: 1px solid #e9e6e0;
  border-radius: 10px;
  background: #ffffff;
  color: #45443f;
  font-size: 0.85rem;
  cursor: pointer;
}

.back-button:hover {
  background: #f2f1ee;
}
</style>
