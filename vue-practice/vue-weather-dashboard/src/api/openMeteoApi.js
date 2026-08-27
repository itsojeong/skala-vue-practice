import axios from 'axios'

// 요구사항 3 — OpenWeatherMap 이 아닌 다른 외부 API.
// Open-Meteo 는 API 키가 필요 없어서, 키를 넣기 전에도 동작을 확인할 수 있다.
const openMeteo = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 5000,
})

openMeteo.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[Open-Meteo]', error.message)
    return Promise.reject(new Error('시간대별 예보를 불러오지 못했습니다.'))
  },
)

// 오늘 하루의 시간대별 기온을 가져온다
export const fetchHourlyTemperature = async (lat, lon) => {
  const { data } = await openMeteo.get('/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      hourly: 'temperature_2m',
      forecast_days: 1,
      timezone: 'auto',
    },
  })

  // { time: [...], temperature_2m: [...] } 두 배열을 한 배열로 합친다
  return data.hourly.time.map((time, index) => ({
    time: time.slice(11, 16), // '2026-08-27T09:00' → '09:00'
    temp: Math.round(data.hourly.temperature_2m[index]),
  }))
}
