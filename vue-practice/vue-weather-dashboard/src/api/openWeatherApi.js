import axios from 'axios'

// Vite 는 VITE_ 로 시작하는 환경변수만 앱 코드에 노출한다.
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

// 키를 넣었는지 화면에서 안내하기 위한 플래그
export const hasApiKey = Boolean(API_KEY)

// 공통 설정을 담은 axios 인스턴스.
// 매번 baseURL 과 공통 파라미터를 적는 대신 여기 한 번만 적어둔다.
const openWeather = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 5000,
  params: {
    appid: API_KEY,
    units: 'metric', // 응답을 섭씨로 받는다 (화씨 변환은 화면에서 처리)
    lang: 'kr', // 날씨 설명을 한글로
  },
})

// 응답 인터셉터 — 모든 요청의 에러를 한 곳에서 사람이 읽을 수 있는 문구로 바꾼다
openWeather.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    let message = '날씨 정보를 불러오지 못했습니다.'

    if (!API_KEY) {
      message = 'API 키가 없습니다. .env.local 에 VITE_OPENWEATHER_API_KEY 를 넣고 서버를 다시 시작하세요.'
    } else if (status === 401) {
      message = 'API 키가 올바르지 않거나 아직 활성화되지 않았습니다. (발급 후 최대 2시간 소요)'
    } else if (status === 404) {
      message = '해당 지역의 날씨 정보를 찾을 수 없습니다.'
    } else if (status === 429) {
      message = 'API 호출 횟수를 초과했습니다. 잠시 후 다시 시도하세요.'
    } else if (error.code === 'ECONNABORTED') {
      message = '요청 시간이 초과되었습니다. 네트워크를 확인하세요.'
    }

    console.error('[OpenWeather]', status, error.message)
    return Promise.reject(new Error(message))
  },
)

// --- 요구사항 1: 현재 날씨 API ---
export const fetchCurrentWeather = async (lat, lon) => {
  const { data } = await openWeather.get('/weather', { params: { lat, lon } })
  return data
}

// --- 요구사항 2: 5일/3시간 예보 API 추가 ---
export const fetchForecast = async (lat, lon) => {
  const { data } = await openWeather.get('/forecast', { params: { lat, lon } })
  return data
}

// --- 요구사항 2: 대기오염 API 추가 ---
export const fetchAirPollution = async (lat, lon) => {
  // 이 엔드포인트는 units/lang 을 쓰지 않지만, 붙어 있어도 무시된다
  const { data } = await openWeather.get('/air_pollution', { params: { lat, lon } })
  return data
}

// 응답 JSON 은 중첩이 깊어서, 화면이 쓰기 좋은 평평한 모양으로 정리해둔다.
export const toCityWeather = (city, raw) => ({
  id: city.id,
  name: city.name,
  lat: city.lat,
  lon: city.lon,
  temp: Math.round(raw.main.temp), // 섭씨 원본
  status: raw.weather[0].description, // 예: '맑음', '실 비'
  icon: raw.weather[0].icon,
  detail: {
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    wind: raw.wind.speed,
    rainfall: raw.rain?.['1h'] ?? 0, // 비가 안 오면 rain 키 자체가 없다
    pressure: raw.main.pressure,
    sunrise: formatTime(raw.sys.sunrise, raw.timezone),
    sunset: formatTime(raw.sys.sunset, raw.timezone),
  },
})

// OpenWeather 의 시각은 UTC 초 단위. timezone(초)을 더해 현지 시각으로 만든다.
function formatTime(unixSeconds, timezoneOffsetSeconds) {
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000)
  const hh = String(date.getUTCHours()).padStart(2, '0')
  const mm = String(date.getUTCMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

// OpenWeatherMap 이 제공하는 날씨 아이콘 이미지 주소를 만든다.
// 응답의 weather[0].icon 이 '04d' 같은 코드로 오고, 그 코드가 곧 파일명이다.
//   https://openweathermap.org/img/wn/04d@2x.png
// 뒤의 d / n 은 낮(day) · 밤(night) 을 뜻해서 같은 날씨라도 그림이 다르다.
// size: '' (50px) | '@2x' (100px) | '@4x' (200px)
export const getIconUrl = (icon, size = '@2x') =>
  `https://openweathermap.org/img/wn/${icon}${size}.png`

// 대기오염 API 의 aqi 는 1~5 숫자로 온다
export const AQI_LABEL = {
  1: '좋음',
  2: '보통',
  3: '나쁨',
  4: '매우 나쁨',
  5: '최악',
}
