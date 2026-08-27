import { defineStore } from 'pinia'
import { cityList } from '@/data/cityList'
import { fetchCurrentWeather, toCityWeather, hasApiKey } from '@/api/openWeatherApi'

// API 통신 상태(로딩·에러·데이터)를 스토어에 모아둔다.
// 대시보드와 통계 페이지가 같은 데이터를 보게 되고, 페이지를 오갈 때마다 다시 부르지 않아도 된다.
export const useWeatherStore = defineStore('weather', {
  state: () => ({
    weatherList: [],
    loading: false,
    error: null,
    loadedAt: null,
  }),

  getters: {
    // 아직 한 번도 못 받아온 상태인지
    isEmpty: (state) => state.weatherList.length === 0,
    hasApiKey: () => hasApiKey,
  },

  actions: {
    // 도시 목록 전체의 현재 날씨를 한 번에 받아온다
    async fetchAll(force = false) {
      // 이미 받아왔고 강제 갱신이 아니면 다시 부르지 않는다
      if (!force && this.weatherList.length > 0) return

      this.loading = true
      this.error = null

      try {
        // 도시마다 순서대로 기다리지 않고 동시에 요청한다
        const responses = await Promise.all(
          cityList.map((city) => fetchCurrentWeather(city.lat, city.lon)),
        )

        this.weatherList = responses.map((raw, index) => toCityWeather(cityList[index], raw))
        this.loadedAt = new Date().toLocaleTimeString('ko-KR')
      } catch (err) {
        // openWeatherApi 의 인터셉터가 만들어준 문구를 그대로 쓴다
        this.error = err.message
        this.weatherList = []
      } finally {
        // 성공하든 실패하든 로딩 표시는 반드시 꺼야 한다
        this.loading = false
      }
    },

    findById(cityId) {
      return this.weatherList.find((city) => city.id === cityId)
    },
  },
})
