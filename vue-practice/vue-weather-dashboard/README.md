# vue-weather-dashboard — Hands on 과제 4~7: Router · Store · Axios · Deployment

Vue Router를 적용해 **한 화면짜리 앱을 여러 페이지를 가진 앱으로 바꾸는** 과제입니다.
이 폴더는 그 결과물 위에 라우터만 얹은 별도 프로젝트로 구분했습니다. 

## 제출 정보

| 항목 | 주소 |
| --- | --- |
| GitHub 저장소 | https://github.com/itsojeong/skala-vue-practice |
| 배포 주소 (Vercel) | https://skala-vue-practice-kappa.vercel.app |
| 이 문서 | `vue-practice/vue-weather-dashboard/README.md` |
| 과제 1~3 문서 | [`../vue-weather-basic/README.md`](../vue-weather-basic/README.md) |

```sh
npm run dev   # http://localhost:5173
```

| 과제 | 주제 | 핵심 도구 | 읽을 곳 |
| --- | --- | --- | --- |
| 4 | Weather Router | `vue-router` | 1~5절 |
| 5 | Weather Store | `pinia` | 6절 |
| 6 | Weather Axios | `axios` + OpenWeatherMap | 7절 |
| — | UI 라이브러리 연습 | `element-plus` | 8절 |
| 7 | Weather Deployment | ESLint · Vite build | 9절 |

---

## 1. 이 과제에서 해결하려던 문제 (과제 4)

과제 3까지는 화면이 Home 하나로 작업되었습니다. 상세보기 버튼을 누르면 `window.alert()` 팝업이 떴는데, 이 방식에는 세 가지 한계가 있었습니다.

1 팝업을 닫으면 정보가 사라진다 (기록이 안 남음)
2 주소창이 바뀌지 않아서 **특정 도시 화면을 링크로 공유할 수 없다**
3 브라우저 뒤로가기 버튼이 동작하지 않는다

Vue Router는 **주소(URL)와 컴포넌트를 짝지어주는 도구**로 `/weather/city_01` 주소로 들어오면 서울 상세 페이지 컴포넌트를 그려줍니다.

---

## 2. 폴더 구조

```text
src/
├── main.js                      # 라우터를 앱 전체에 주입 (.use(router))
├── App.vue                      # 내비게이션 바 + RouterView(화면이 갈아끼워지는 자리)
├── router/
│   └── index.js                 # 어떤 주소에 어떤 컴포넌트를 띄울지 정의
├── api/                         # ★ 과제 6 — 외부 통신 담당
│   ├── openWeatherApi.js        # axios 인스턴스 + OpenWeather API 3종
│   └── openMeteoApi.js          # 키가 필요 없는 다른 외부 API
├── data/
│   └── cityList.js              # 조회할 도시 좌표 (값은 API 에서 온다)
├── stores/                      # ★ 과제 5 — 컴포넌트 바깥에 두는 공유 상태
│   ├── configStore.js           # 날씨 단위 설정 (섭씨/화씨)
│   ├── favoriteStore.js         # 즐겨찾기한 도시 목록
│   └── weatherStore.js          # ★ 과제 6 — API 응답 + 로딩·에러 상태
├── components/exercise/         # 재사용 부품 (과제 3에서 만든 것 그대로)
│   ├── BaseDashboardCard.vue    # slot으로 내용을 받는 흰 패널 껍데기
│   ├── SearchBar.vue            # props로 검색어 받고 emits로 입력 전달
│   ├── WeatherCard.vue          # props로 도시 받고 emits로 클릭 전달
│   └── UnitToggler.vue          # ★ 과제 5 — props/emits 없이 스토어만 쓰는 컴포넌트
└── views/                       # "페이지" 단위 컴포넌트
    ├── WeatherHomeView.vue      # /              메인 대시보드
    ├── WeatherDetailView.vue    # /weather/:cityId  도시별 상세
    ├── WeatherAboutView.vue     # /about         서비스 소개
    ├── WeatherStatsView.vue     # /stats         직접 추가한 통계 페이지
    ├── UiPracticeView.vue       # /ui            Element Plus 연습 (8절)
    └── NotFoundView.vue         # 그 외 모든 주소  404
```

### components와 views를 왜 나누나

기능은 똑같은 `.vue` 파일이지만 **역할이 다르기 때문에.**

| | components/ | views/ |
| --- | --- | --- |
| 성격 | 부품 | 페이지 |
| 재사용 | 여러 곳에서 반복 사용 | 한 주소에 하나 |
| 예 | 버튼, 카드, 검색창 | 대시보드 화면, 상세 화면 |

이 규칙을 지키면 나중에 "이 화면이 어느 주소였지?"를 폴더만 보고 알 수 있습니다.

---

## 3. 학습 과정과 과제 수행 과정

### 3-1. 라우터 등록 — 주소와 컴포넌트 짝짓기

[`router/index.js`](src/router/index.js)

```js
{
  path: '/about',
  name: 'weather-about',
  component: () => import('@/views/WeatherAboutView.vue'),
}
```

- `path` — 주소
- `name` — 코드에서 부를 이름 (주소를 나중에 바꿔도 이 이름은 그대로)
- `component` — 그 주소에서 띄울 컴포넌트

### 3-2. 지연 로딩 (Lazy Loading)

`component: WeatherAboutView` (미리 import)가 아니라 `component: () => import(...)` 형태로 씁니다.

**차이:** 앞쪽은 앱을 켤 때 모든 페이지를 통째로 내려받고, 뒤쪽은 **그 주소에 처음 들어갈 때 필요한 조각만** 내려받습니다. 화살표 함수로 감싸는 건 "지금 실행하지 말고, 필요할 때 실행할 함수만 넘겨둔다"는 뜻입니다.

`npm run build`를 돌리면 주소에서 확인할 수 있습니다.

```text
dist/assets/WeatherDetailView-CG96NYcg.js   1.83 kB
dist/assets/WeatherStatsView-DXH0zx_I.js    1.68 kB
dist/assets/NotFoundView-DQK-1Ztz.js        0.57 kB
```

페이지마다 파일이 따로 떨어졌습니다. 지연 로딩을 안 썼다면 `index.js` 하나만 나옵니다.
브라우저 개발자도구 Network 탭을 켜고 메뉴를 눌러보면, 그 순간 해당 `.js` 파일을 받아오는 게 보입니다.

### 3-3. App.vue의 역할 축소

[`App.vue`](src/App.vue)에는 로직이 하나도 없습니다.

```html
<nav>
  <RouterLink to="/">대시보드</RouterLink>
  <RouterLink to="/stats">통계</RouterLink>
  <RouterLink to="/about">소개</RouterLink>
</nav>
<main>
  <RouterView />
</main>
```

- `<RouterLink>` — `<a>` 태그 대신 씁니다. `<a href>`는 페이지 전체를 새로고침해서 앱 상태가 다 날아가지만, `RouterLink`는 필요한 부분만 갈아끼웁니다.
- `<RouterView>` — **화면이 들어오는 구멍**입니다. 주소가 바뀔 때마다 이 자리의 컴포넌트만 교체됩니다. 위아래 내비게이션은 그대로 남습니다.

현재 주소와 일치하는 `RouterLink`에는 Vue Router가 `router-link-exact-active` 클래스를 자동으로 붙여줍니다. CSS만 쓰면 현재 메뉴 강조가 끝납니다. 직접 "지금 어느 탭이지"를 변수로 관리할 필요가 없습니다.

### 3-4. 동적 경로 매칭 — 주소로 값을 전달하기

도시가 5개라고 상세 페이지를 5개 만드는 것은 공수가 크기 때문에 주소의 일부를 변수로 비워두어 경로를 띄웁니다.

```js
path: '/weather/:cityId'
```

`:cityId` 자리에 들어온 값은 `route.params.cityId`로 꺼내 씁니다.

[`WeatherDetailView.vue`](src/views/WeatherDetailView.vue)

```js
const route = useRoute()

onMounted(() => {
  const cityId = route.params.cityId    // 예: 'city_01'
  city.value = findCityById(cityId)     // Mock Data에서 도시 객체 찾기
})
```

`/weather/city_01`, `/weather/city_05` 모두 같은 컴포넌트가 처리하고, 파라미터만 달라집니다.

### 3-5. Programmatic Navigation — 코드로 이동시키기

`RouterLink`는 사용자가 직접 누르는 링크입니다. 하지만 "버튼을 눌렀을 때 뭔가 처리한 뒤 이동" 같은 경우는 **코드에서 이동을 명령**해야 합니다.

[`WeatherHomeView.vue`](src/views/WeatherHomeView.vue)

```js
const router = useRouter()

const onClickDetail = (city) => {
  router.push('/weather/' + city.id)
}
```

과제 3의 `window.alert(...)`를 이 두 줄로 바꾼 것이 이번 과제의 핵심 변경점입니다.

> **헷갈리기 쉬운 부분:** `useRoute()`와 `useRouter()`는 하는 일이 다릅니다.
> - `useRoute()` — **현재** 주소 정보를 읽음 (params, query, path)
> - `useRouter()` — 주소를 **바꾸는** 명령을 내림 (push, replace, back)

### 3-6. Catch-all Route — 없는 주소 처리

```js
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('@/views/NotFoundView.vue'),
}
```

`.*`는 "아무 문자열이나"라는 뜻이라 모든 주소에 매칭됩니다.

> 라우터는 위에서부터 순서대로 검사하다가 처음 맞는 것에서 멈추기 때문에 **반드시 배열의 맨 마지막에 둬야 합니다.** 이걸 맨 위에 두면 `/about`도 `/stats`도 전부 404를 띄웁니다.

---

## 4. 확인

| 구분 | 기대 결과 | 확인하는 개념 |
| --- | --- | --- |
| 상세보기 버튼 클릭 | 주소가 `/weather/city_01`로 바뀜 | Programmatic Navigation |
| 그 상태에서 뒤로가기 | 대시보드로 복귀 | 브라우저 히스토리 연동 |
| 주소창에 `/weather/city_99` 입력 | "찾을 수 없습니다" 안내 | 동적 매칭은 되지만 데이터가 없는 경우 |
| 주소창에 `/asdf` 입력 | 404 페이지 | Catch-all Route |
| 개발자도구 Network 탭 켜고 메뉴 이동 | 그때그때 `.js` 파일을 받아옴 | 지연 로딩 |
| 카드 본문 클릭 vs 상세보기 클릭 | 앞은 상태바만, 뒤는 페이지 이동 | `@click.stop` (이벤트 버블링 차단) |

---

## 5. 과제4 요구사항

| 요구사항 | 구현 위치 |
| --- | --- |
| 1. 지연 로딩 · Catch-all Route | [router/index.js](src/router/index.js) |
| 2. App.vue에 RouterLink · RouterView | [App.vue](src/App.vue) |
| 3. WeatherHomeView — alert 제거, router.push | [WeatherHomeView.vue](src/views/WeatherHomeView.vue) |
| 4. WeatherDetailView — cityId 기반 Mock 조회 | [WeatherDetailView.vue](src/views/WeatherDetailView.vue) |
| 5. WeatherAboutView — 소개 + 복귀 링크 | [WeatherAboutView.vue](src/views/WeatherAboutView.vue) |
| 6. 추가 view 작성 및 라우팅 | [WeatherStatsView.vue](src/views/WeatherStatsView.vue) (`/stats`) |

**With Claude 추가 view (`/stats`)** 는 `computed`로 평균·최고·최저 기온과 날씨 상태별 도시 수를 집계합니다. 과제 2에서 배운 `computed`를 새 화면에서 다시 사용했습니다.

---

## 6. 과제 5: Weather Store (Pinia)

### 6-1. 왜 스토어가 필요했나

지금까지 상태는 전부 **부모가 소유하고 props 로 내려주는** 방식이었습니다. 그런데 날씨 단위 설정은 성격이 다릅니다.

- 바꾸는 곳 — 내비게이션 바의 `UnitToggler`
- 쓰는 곳 — 대시보드 카드, 상세 페이지, 통계 페이지

props 로 하려면 `App → RouterView → 각 View → WeatherCard` 까지 값을 계속 내려보내고, 바꿀 때는 emit 을 역순으로 올려야 합니다. **중간 컴포넌트들은 그 값과 관련에 없어도 전달해야하는** 구조(prop drilling)가 됩니다.

Pinia 는 상태를 **컴포넌트 바깥**에서 필요한 컴포넌트가 직접 꺼내 쓰고, 중간 경로는 아무것도 모를 수 있습니다.

```text
[props 방식]                        [스토어 방식]
App                                 ┌──────────────┐
 └ View        ← 값을 배달           │ configStore  │
    └ Card     ← 값을 배달           └──────────────┘
       └ 사용                          ↑          ↑
                                UnitToggler   WeatherCard
                                (바꾼다)       (읽는다)
```

### 6-2. 스토어 — state · getters · actions

[`stores/configStore.js`](src/stores/configStore.js)

```js
export const useConfigStore = defineStore('config', {
  state: () => ({ unit: 'celsius' }),
  getters: {
    unitSymbol: (state) => (state.unit === 'celsius' ? '°C' : '°F'),
  },
  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
```

| 스토어 | 컴포넌트에서는 | 하는 일 |
| --- | --- | --- |
| `state` | `ref()` | 값 보관 |
| `getters` | `computed()` | 파생 값 |
| `actions` | 일반 함수 | 값 변경 |

**틀리기 쉬운 개념**

- `state` 는 반드시 **함수**여야 합니다. 객체를 그대로 쓰면 모든 인스턴스가 같은 객체를 공유하게 됩니다.
- `actions` 에는 **화살표 함수를 쓰면 안 됩니다.** 화살표 함수는 자기 `this` 를 갖지 않아 `this.unit` 이 동작하지 않습니다. 반면 `getters` 는 `state` 를 인자로 받으므로 화살표 함수가 괜찮습니다.

### 6-3. UnitToggler — props 도 emits 도 없는 컴포넌트

[`components/exercise/UnitToggler.vue`](src/components/exercise/UnitToggler.vue)

```js
const configStore = useConfigStore()
```

```html
<span>날씨단위: {{ configStore.unitLabel }}</span>
<button @click="configStore.toggleUnit()">단위변경</button>
```

`SearchBar` 는 `props` 로 받고 `emits` 로 올렸지만, 이 컴포넌트는 **부모와 대화하지 않습니다.** 스토어를 직접 읽고 씁니다.
[`App.vue`](src/App.vue) 에서 내비게이션 링크 옆에 배치했습니다.

### 6-4. displayTemp — 원본은 그대로, 표시할 때만 변환

[`WeatherCard.vue`](src/components/exercise/WeatherCard.vue)

```js
const displayTemp = computed(() => {
  const rawTemp = props.city.temp        // 원본 데이터는 항상 섭씨
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
```

`city.temp` 자체를 화씨로 바꿔버리면 다시 섭씨로 돌릴 때 반올림 때문에 값이 어긋납니다.(28 → 82 → 27.8) 원본은 섭씨로 두고 **그릴 때만** 변환하면 몇 번을 오가도 값이 유지됩니다.

`v-if="city.temp >= 25"` 배지 조건은 `displayTemp` 가 아니라 **원본 `city.temp`** 를 씁니다. 화씨로 바꿨다고 "더움" 기준이 82도로 바뀌면 안 되기 때문입니다.

### 6-5. 요구사항4

| 요구사항 | 구현 위치 |
| --- | --- |
| 1. UnitToggler.vue — 단위 변경 UI | [UnitToggler.vue](src/components/exercise/UnitToggler.vue) |
| 2. Navigation Bar 옆에 배치 | [App.vue](src/App.vue) |
| 3. 메인·상세에 단위 설정 적용 | [WeatherCard.vue](src/components/exercise/WeatherCard.vue), [WeatherDetailView.vue](src/views/WeatherDetailView.vue) |
| 4. 추가 Store 작성 또는 state·getter·action 추가 | 아래 참조 |

**요구사항 4로 추가한 것**

- `configStore` 에 getter `unitLabel` (한글 라벨), action `setUnit(unit)` (값 지정 설정)
- 별도 스토어 [`favoriteStore.js`](src/stores/favoriteStore.js) — 즐겨찾기한 도시 목록

```js
isFavorite: (state) => (cityId) => state.favoriteIds.includes(cityId),
```

`isFavorite` 는 **인자를 받는 getter** 입니다. getter 는 원래 인자를 못 받으므로 *함수를 반환하는 함수* 로 만듭니다. 그래야 템플릿에서 `favoriteStore.isFavorite(city.id)` 로 부를 수 있습니다.

통계 페이지에도 단위 설정을 적용했습니다. 요구사항에는 메인·상세만 있지만, 같은 화면에서 단위가 섞이면 어색하기 때문입니다.

### 6-6. 확인

| 구분 | 기대 결과 | 확인하는 개념 |
| --- | --- | --- |
| 단위변경 클릭 | 대시보드 카드 온도가 전부 ℉ | state 공유 |
| 그 상태로 상세 페이지 이동 | 상세도 ℉ 유지 | 페이지가 바뀌어도 스토어는 살아있음 |
| 통계 페이지 이동 | 평균·최고·최저 전부 ℉ | 세 화면이 같은 값을 봄 |
| 대시보드에서 ★(즐겨찾기) 누르고 상세 이동 | 상세에도 ★(즐겨찾기) 켜져 있음 | 스토어를 통한 컴포넌트 간 동기화 |
| 브라우저 새로고침 | 설정이 초기값으로 돌아감 | 스토어는 메모리에만 있음 |

마지막 항목이 중요합니다. Pinia 는 **메모리 저장소**라 새로고침하면 사라집니다. 유지하려면 `localStorage` 에 저장하는 작업이 따로 필요합니다.

---

## 7. 과제 6: Weather Axios (실제 API 연동)

### 7-1. 준비 — 라이브러리와 키

```sh
npm install axios
```

API 키는 코드에 직접 쓰지 않고 [`.env.local`](.env.local) 에 둡니다.

```sh
VITE_OPENWEATHER_API_KEY=발급받은_키
```

- Vite 는 **`VITE_` 로 시작하는 변수만** 앱 코드에 노출합니다. 이름을 바꾸면 못 읽습니다.
- 키가 저장소에 올라가면 안 되기 때문에 `.gitignore` 의 `*.local` 규칙으로 **커밋하지 않습니다.** 
- [`.env.example`](.env.example) 은 값 없이 형식만 담은 파일이라 커밋해도 안전합니다.
- **값을 넣은 뒤에는 반드시 dev 서버를 다시 시작해야 합니다.** Vite 는 환경변수를 시작할 때 한 번만 읽습니다.

### 7-2. axios 인스턴스 — 공통 설정을 한 곳에

[`api/openWeatherApi.js`](src/api/openWeatherApi.js)

```js
const openWeather = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 5000,
  params: { appid: API_KEY, units: 'metric', lang: 'kr' },
})
```

`axios.get(...)` 을 그대로 쓰면 호출마다 주소와 키를 반복해서 적어야 하지만, 인스턴스로 묶으면 각 함수는 **달라지는 부분만** 적습니다.

```js
openWeather.get('/weather', { params: { lat, lon } })
```

> `units: 'metric'` 을 쓰는 이유 — 응답을 섭씨로 받아야 과제 5에서 정한 "원본은 섭씨, 표시할 때만 변환" 규칙이 유지됩니다.

### 7-3. 인터셉터 — 에러 문구를 한 곳에서

```js
openWeather.interceptors.response.use(
  (response) => response,
  (error) => { /* 401 · 404 · 429 · 타임아웃별 한글 문구로 변환 */ },
)
```

이게 없으면 호출하는 모든 곳에서 상태 코드를 분기해야 합니다. 여기서 한 번 바꿔두면 화면은 `err.message` 만 보여주면 됩니다.

### 7-4. 요구사항별 API

| 요구사항 | API | 화면 |
| --- | --- | --- |
| 1. 실제 날씨 데이터 | OpenWeather `/weather` | 대시보드 카드, 상세 요약 |
| 2. API 추가 | OpenWeather `/forecast` (5일/3시간) | 상세 "향후 24시간 예보" |
| 2. API 추가 | OpenWeather `/air_pollution` | 상세 "대기질" (PM10·PM2.5) |
| 3. 기타 외부 API | [Open-Meteo](https://open-meteo.com) `/forecast` | 상세 "오늘 시간대별 기온" 막대그래프 |

**Open-Meteo 를 고른 이유** — API 키가 필요 없어서 OpenWeather 키를 넣기 전에도 외부 통신이 동작하는 것을 확인할 수 있습니다.

### 7-5. 날씨 아이콘 이미지

응답의 `weather[0].icon` 이 `'04d'` 같은 **코드**로 오고, 그 코드가 그대로 이미지 파일명이 됩니다. 이미지 URL 필드는 응답에 없어서 직접 조립합니다.

```js
export const getIconUrl = (icon, size = '@2x') =>
  `https://openweathermap.org/img/wn/${icon}${size}.png`
```

| 부분 | 의미 |
| --- | --- |
| `04` | 날씨 종류 (01 맑음, 02~04 구름, 09·10 비, 11 뇌우, 13 눈, 50 안개) |
| `d` / `n` | 낮 / 밤 — 같은 날씨라도 그림이 다름 |
| `@2x` | 크기 (없으면 50px, `@2x` 100px, `@4x` 200px) |

`<img>` 에 `width`·`height` 를 속성으로 박아두면 이미지가 늦게 도착해도 자리를 미리 잡아 화면이 덜컥거리지 않습니다.

>**With Claude 제안** `lang: 'kr'` 로 받은 설명은 "온흐림"(overcast clouds), "실 비"(light rain) 처럼 어색합니다. 응답에 함께 오는 `weather[0].id` (804, 500 …) 로 직접 라벨을 매핑하면 자연스럽게 바꿀 수 있습니다.

### 7-6. 병렬 요청 — `Promise.all` vs `allSettled`

| | 실패했을 때 | 쓴 곳 |
| --- | --- | --- |
| `Promise.all` | 하나라도 실패하면 전부 버림 | 대시보드 (도시 5개 현재 날씨) |
| `Promise.allSettled` | 실패한 것만 빠지고 나머지는 살림 | 상세 페이지 (API 4개) |

상세 페이지는 대기오염이 실패해도 현재 날씨는 보여주는 편이 낫기 때문에 `allSettled` 를 씁니다.

### 7-7. 로딩과 에러 — 없던 상태가 생긴다

데이터가 **비어 있는 순간**이 생깁니다. [`weatherStore.js`](src/stores/weatherStore.js) 가 세 가지를 함께 들고 있습니다.

```js
state: () => ({ weatherList: [], loading: false, error: null })
```

```html
<p v-if="weatherStore.loading">불러오는 중…</p>
<div v-else-if="weatherStore.error"> … 다시 시도 버튼 … </div>
<template v-else-if="filteredWeatherList.length > 0"> … 카드 … </template>
```

`finally` 에서 `loading = false` 를 하는 것도 같은 이유입니다. 실패했을 때 로딩 표시가 영영 안 사라지는 걸 막습니다.

**With Claude:** 값이 전부 API 에서 오므로 `weatherMockData.js` 는 삭제하고, 조회할 좌표만 [`cityList.js`](src/data/cityList.js) 에 남겼습니다. 도시명 대신 좌표를 쓰면 한글/영문 표기 차이로 검색이 실패할 일이 없습니다.

---

## 8. UI 라이브러리 연습 (Element Plus)

```sh
npm install element-plus
```

`/ui` 경로의 [`UiPracticeView.vue`](src/views/UiPracticeView.vue) 한 페이지에서만 씁니다.

### 8-1. 왜 UI 라이브러리를 쓰나

지금까지는 버튼·입력창·카드를 **직접 CSS 로** 만들었습니다. 색·크기·둥근 모서리를 매번 정하고, 호버 상태까지 따로 적었습니다. UI 라이브러리는 이걸 **속성 하나로** 대체할 수 있습니다.

```html
<ElButton type="danger" size="small" round>삭제</ElButton>
```

CSS 를 쓰지 않고 색·크기·모양을 정합니다. 대신 **그 라이브러리가 정한 디자인을 따릅니다.**

### 8-2. 전역 등록 대신 페이지 안에서만 import

보통 `main.js` 에서 전역 등록합니다. 
대시보드의 기존 디자인을 지키기 위해서 **연습 페이지 안에서만** 가져다 썼습니다.

```js
// 흔한 방식 — 앱 전체에 적용된다
app.use(ElementPlus)
```

```js
import { ElButton, ElInput, ElTable /* … */ } from 'element-plus'
import 'element-plus/dist/index.css'
```

```text
dist/assets/UiPracticeView-Cd2ntamY.js   365.59 kB   ← Element Plus 가 여기에만
dist/assets/WeatherHomeView-BN7dSzVY.js    4.30 kB   ← 대시보드는 그대로
```

라우터 지연 로딩과 맞물려, `/ui` 에 들어가지 않으면 365 kB 는 아예 내려받지 않습니다.

### 8-3. 직접 수행한 내용

| 절 | 컴포넌트 | 배우는 것 |
| --- | --- | --- |
| 1 | `el-button` | 속성으로 모양 정하기 (`type`·`size`·`plain`·`round`·`disabled`) |
| 2 | `el-input`·`el-select`·`el-switch`·`el-slider`·`el-rate` | 전부 `v-model` 로 값 연결 |
| 3 | `ElMessage`·`ElMessageBox` | 태그가 아니라 **함수로 부르는** 컴포넌트 |
| 4 | `el-dialog` | 열림 상태를 `v-model` 로 관리, 버튼은 `#footer` slot |
| 5 | `el-table` | 데이터 배열만 넘기면 표가 그려짐, 셀은 scoped slot |
| 6 | `el-form` | 검증 규칙을 **선언**하면 검사·에러 문구를 라이브러리가 처리 |
| 7 | `el-tabs` | 과제 1~3 에서 직접 만든 탭 전환이 태그 몇 줄로 |

- **v-model** — `<ElInput v-model="text" />`. 우리가 `props` + `emits` 로 만들던 양방향 연결을 라이브러리가 대신 합니다.
- **이름있는 slot** — 다이얼로그의 `#footer`, 카드의 `#header`. 과제 3의 Named Slot 그대로입니다.
- **Scoped Slot** — 테이블 셀의 `#default="scope"`. 자식(테이블)이 행 데이터를 `scope` 에 담아 주고 모양은 우리가 정합니다. 과제 3에서 이해한 그 구조입니다.

### 8-5. 확인

| 구분 | 기대 결과 |
| --- | --- |
| `/ui` 진입 | 7개 섹션이 Element Plus 디자인으로 표시 |
| "삭제 확인창" 클릭 후 취소 | "취소했습니다" — Promise 의 `.catch` 분기 |
| 폼을 비운 채 등록 | 필드마다 빨간 에러 문구가 자동 표시 |
| 대시보드로 돌아가기 | 기존 디자인이 그대로 (라이브러리 영향 없음) |
| DevTools Network 탭에서 `/ui` 진입 | 그 순간 큰 청크를 내려받음 (지연 로딩) |

---

## 9. 과제 7: Weather Deployment (품질관리 · 빌드 · 배포)

### 9-1. ESLint 점검

```sh
npm run lint     # oxlint --fix 후 eslint --fix 를 차례로 실행
```

두 프로젝트 모두 **0 error / 0 warning** 입니다. 고칠 것이 나오지 않아, 정확히는 "에러를 없앴다" 가 아니라 **"에러가 없음을 확인했다"** 입니다. 코드를 쓰는 동안 매번 `npm run build` 로 검증하며 진행해서, 문법 오류와 잘못된 import 는 빌드 단계에서 이미 걸러졌습니다.

```text
oxlint  : Found 0 warnings and 0 errors. (21 files, 89 rules)
eslint  : exit code 0
```

`npm run lint` 는 `--fix` 가 붙어 있어 **고칠 수 있는 것은 자동으로 고칩니다.**

> 종료 코드(exit code)가 0 이면 통과, 1 이면 에러가 남아 있다는 뜻입니다. CI 는 이 숫자로 성공·실패를 판단합니다.

### 9-2. API 키 관리 

| 확인 항목 | 상태 |
| --- | --- |
| 키가 소스 코드에 직접 적혀 있는가 | 아니오 — `import.meta.env` 로 읽음 |
| `.env.local` 이 Git 에 올라갔는가 | 아니오 — `.gitignore` 의 `*.local` |
| 저장소 이력에 키 문자열이 남았는가 | 아니오 (`git grep` 으로 전체 이력 확인) |
| 다른 사람이 받아서 쓸 수 있는가 | 예 — `.env.example` 을 복사해 채우면 됨 |

> 주의: Vite 의 `VITE_` 변수는 **빌드 결과물에 그대로 노출됩니다.** 때문에 브라우저에서 볼 수 있습니다. **완전히 감춰야 하는 키라면 서버를 한 단계 두고 거기서 호출해야 합니다.**

### 9-3. 빌드

```sh
npm run build
```

`dist/` 폴더에 정적 파일이 생깁니다. **HTML·CSS·JS 파일 묶음**입니다.

```text
dist/
├── index.html          # 진입점 (내용은 <div id="app"></div> 뿐)
├── favicon.ico
└── assets/
    ├── index-*.js      # 공통 코드
    ├── index-*.css
    ├── WeatherHomeView-*.js    # 라우트별로 쪼개진 조각들
    ├── UiPracticeView-*.js
    └── …               (총 20개 파일, 956K)
```

파일명에 붙은 `-CZ0-j8cK` 같은 문자열은 **내용을 요약한 해시**입니다. 내용이 바뀌면 이름도 바뀌므로, 브라우저가 옛날 파일을 캐시에 물고 있는 문제가 생기지 않습니다.

### 9-4. 호스팅 — 그냥 올리면 새로고침이 깨진다

빌드한 `dist/` 를 실제로 두 가지 방식으로 띄워 비교했습니다.

| 주소 | `vite preview` | 일반 정적 서버 |
| --- | --- | --- |
| `/` | 200 | 200 |
| `/stats` | 200 | **404** |
| `/weather/city_01` | 200 | **404** |
| `/asdf` | 200 (앱의 404 화면) | **404** |

**왜 404가 뜨는지:** 우리 앱에는 `stats` 라는 파일이 없습니다. 화면 안에서 링크를 눌러 이동할 때는 JS 가 처리하니 문제가 없지만, 주소창에 직접 치거나 **새로고침**하면 서버에는 그런 파일이 없으니 404로 처리됩니다.
**With Claude 해결 제안:** 없는 경로는 전부 `index.html` 을 돌려주도록 서버에 설정합니다(SPA 폴백). 그러면 Vue Router 가 주소를 보고 알맞은 화면을 그립니다.

```nginx
# nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

```text
# Netlify — public/_redirects 파일
/*    /index.html   200
```

```json
// Vercel — vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

`vite preview` 는 이 폴백이 이미 들어 있어서 배포 전 확인용으로 쓰기 좋습니다.

```sh
npm run preview     # http://localhost:4173
```

### 9-5. 하위 경로에 올리려면

`example.com/` 이 아니라 `example.com/my-app/` 처럼 **하위 경로**에 올리면, `index.html` 이 `/assets/…` 를 찾다가 전부 404 가 납니다. 이때는 `vite.config.js` 에 기준 경로를 알려줘야 합니다.

```js
export default defineConfig({
  base: '/my-app/',
  // …
})
```

### 9-6. 배포 전 점검

| 항목 | 명령 / 확인 |
| --- | --- |
| 린트 통과 | `npm run lint` → exit 0 |
| 빌드 성공 | `npm run build` → `dist/` 생성 |
| 로컬에서 결과물 확인 | `npm run preview` |
| **깊은 경로 새로고침** | `/stats` 에서 F5 → 404 아니면 OK |
| 키가 Git 에 없는지 | `git ls-files \| grep .env` → `.env.example` 만 |
| 페이지 제목 | `index.html` 의 `<title>` 이 "Vite App" 이 아닌지 |

---

## 10. Vercel 배포하기

### 10-1. 저장소 특징

프로젝트가 **두 개**입니다.

```text
skala-vue-practice/          ← 저장소 루트 (package.json 없음)
└── vue-practice/
    ├── vue-weather-basic/       ← 프로젝트 1
    └── vue-weather-dashboard/   ← 프로젝트 2 (배포 대상)
```

Vercel 은 기본적으로 저장소 루트에서 `package.json` 을 찾습니다. 루트에는 없으므로 **Root Directory 를 반드시 지정**해야 합니다. 이걸 놓치면 "No package.json found" 로 빌드가 실패합니다.

### 10-2. 설정 순서

1. [vercel.com](https://vercel.com) 에 GitHub 계정으로 로그인
2. Add New → Project → `skala-vue-practice` 저장소 선택
3. 설정 화면에서 아래처럼 지정

| 항목 | 값 |
| --- | --- |
| Root Directory | `vue-practice/vue-weather-dashboard` |
| Framework Preset | Vite (자동 인식됨) |
| Build Command | `npm run build` (자동) |
| Output Directory | `dist` (자동) |

4. Environment Variables 에 API 키 등록

| Name | Value |
| --- | --- |
| `VITE_OPENWEATHER_API_KEY` | 발급받은 키 |

5. Deploy 클릭

### 10-3. 환경변수를 반드시 등록해야 하는 이유

`.env.local` 은 Git 에 올리지 않았기 때문에 Vercel 서버에는 해당 파일이 없습니다.
등록하지 않으면 배포는 성공하지만 화면에 "API 키가 없습니다" 만 뜹니다.
환경변수를 나중에 추가·수정하면 재배포(Redeploy)를 해야 반영됩니다.

### 10-4. SPA 폴백

[`vercel.json`](vercel.json) 에 넣어뒀습니다. 9-4 절에서 확인한 "깊은 경로 새로고침 404" 를 막습니다.

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### 10-5. 배포 후 확인

| 확인할 것 | 기대 결과 |
| --- | --- |
| 첫 화면 | 실제 기온이 표시됨 (환경변수 확인) |
| `/stats` 로 이동 후 새로고침| 404 가 아니라 통계 화면 (폴백 확인) |
| 없는 주소 (`/asdf`) | 우리가 만든 404 화면 — 내비게이션 바가 함께 보이면 정상 (11-10 절) |
| 브라우저 탭 제목 | "날씨 대시보드 — Vue Hands on" |
| 이후 `git push` | 자동으로 재배포됨 |

---

## 11. 트러블슈팅 기록

과제를 수행하면서 경험한 상황을 증상 → 원인 → 해결 순으로 작성했습니다.

### 11-1. 한 파일에 컴포넌트를 두 개 넣어 컴파일 실패

**증상** — 작성한 `.vue` 파일이 화면에 아무것도 안 나오고 빌드가 깨짐.

**원인** — `<script setup>` 과 `<template>` 이 한 파일에 두 벌씩 들어감. 게다가 `<div>` 가 `</template>` 바깥에 있었음.

**해결** — `.vue` 파일 하나 = 컴포넌트 하나. 부모와 자식을 각각 다른 파일로 분리

### 11-2. 파일명에 공백과 `&`

**증상** — `Props & Emits Example.vue` 를 import 할 때마다 경로가 깨짐.

**원인** — 공백과 `&` 는 경로에서 이스케이프가 필요한 문자

**해결** — 파일명은 영문·숫자·하이픈만. 컴포넌트는 파스칼케이스(`WeatherCard.vue`)

### 11-3. IDE 자동 import 가 만든 `.vue/index.js` 경로

**증상**
```text
Failed to resolve import "./practices/component/ChildComponent.vue/index.js"
```

**원인** — VSCode 가 파일을 옮길 때 import 경로를 자동 수정하면서 `.vue` 를 폴더로 착각함.

**해결** — 경로 끝의 `/index.js` 만 지움. `.vue` 는 파일이지 폴더가 아님.

### 11-4. 같은 컴포넌트가 두 폴더에 중복

**증상** — 코드를 고쳤는데 화면이 안 바뀜.

**원인** — 같은 이름의 파일이 두 곳에 있고, 화면은 다른 쪽을 쓰고 있었음.

**해결** — import 경로를 따라가면 실제로 쓰이는 파일을 알 수 있음. 아무도 import 하지 않는 파일은 화면에 나오지 않음. 중복본을 지우고 한 벌만 유지

### 11-5. 화면이 좌우 2열로 갈라짐

**증상** — 내비게이션이 왼쪽, 콘텐츠가 오른쪽에 나옴

**원인** — 내 코드가 아니라 프로젝트 생성 시 딸려온 [`assets/main.css`](src/assets/main.css) 의 기본 스타일

```css
@media (min-width: 1024px) {
  #app { display: grid; grid-template-columns: 1fr 1fr; }  /* ← 범인 */
}
```

**해결** — `display: block` 으로 변경. **템플릿이 넣어준 CSS 도 내 레이아웃에 영향을 준다**는 걸 알게 된 지점

### 11-6. 오타 파일명 (`UnitToogler.vue`)

**증상** — 만든 컴포넌트가 어디서도 안 보임.

**원인** — `Toggler` 를 `Toogler` 로 잘못 적었고, 파일은 0바이트로 남아 있었음.

**해결** — 올바른 이름으로 다시 만들고 오타 파일 삭제

### 11-7. API 401 — 키를 넣었는데 안 됨

**증상** — 콘솔에 `[OpenWeather] 401 Invalid API key`

**원인 두 가지**
1. `.env.local` 을 저장하고 dev 서버를 **재시작하지 않음**
2. 키를 발급받은 직후라 **아직 활성화되지 않음** (최대 2시간 소요)

**해결** — 서버 재시작이 먼저. 그래도 401 이면 시간을 두고 재시도

> Vite 는 환경변수를 **시작할 때 한 번만** 읽습니다. 켜둔 채 저장하면 아무리 새로고침해도 반영되지 않습니다.

### 11-8. 날씨 설명이 "온흐림", "실 비"

**증상** — 화면에 어색한 한글이 표시됨.

**원인** — `lang: 'kr'` 로 받은 OpenWeatherMap 의 번역. `overcast clouds` → "온흐림", `light rain` → "실 비"

**해결책 (미적용)** — 응답에 함께 오는 `weather[0].id` (804, 500 …) 로 직접 라벨을 매핑하면 됨. 현재 코드는 `description` 과 `icon` 만 꺼내 쓰고 `id` 는 사용하지 않음

### 11-9. 빌드 결과를 올렸더니 새로고침에서 404

**증상** — `/stats` 에서 F5 를 누르면 404

**원인** — 앱에 `stats` 라는 **파일이 없음**. 화면 안에서 링크로 이동할 때는 JS 가 처리하지만, 새로고침하면 서버에게 그 파일을 요청하게 됨.

**확인 방법** — 빌드 결과를 두 가지로 띄워 비교

| 주소 | `vite preview` | 일반 정적 서버 |
| --- | --- | --- |
| `/` | 200 | 200 |
| `/stats` | 200 | **404** |

**해결** — 없는 경로를 전부 `index.html` 로 돌려주는 SPA 폴백 설정 (9-4 절, [`vercel.json`](vercel.json))

### 11-10. 배포 후 404 — 서버 404 인가, 앱의 404 화면인가

**증상** — 배포한 사이트에서 `/status` 로 들어갔더니 404. 강력 새로고침해도 그대로임.

**원인** — 경로 오타. 통계 페이지는 `/stats` 이고 `/status` 는 등록된 적이 없음.

**핵심** — 이건 **정상 동작**입니다. 서버 응답을 확인하면 구분됩니다.

```text
/stats             HTTP 200   ← 통계 화면
/status            HTTP 200   ← 서버는 200, 앱이 404 화면을 그림
/weather/city_01   HTTP 200
```

모든 경로가 200 이면 SPA 폴백이 작동하고 있다는 뜻입니다. 

| | 서버의 404 (설정 실패) | 앱의 404 (정상) |
| --- | --- | --- |
| HTTP 상태 | 404 | **200** |
| 화면 | 검은 배경에 `404: NOT_FOUND` | 우리가 만든 404 화면 |
| 내비게이션 바 | 없음 | **있음** |
| "돌아가기" 링크 | 없음 | 있음 |

**구분법** — 화면에 내비게이션 바와 "← 메인 대시보드로 돌아가기" 링크가 보이면 우리 앱이 그린 화면입니다.

### 11-11. 브라우저 탭 제목이 "Vite App"

**증상** — 배포 점검 중 발견

**원인** — 프로젝트 생성 시의 기본값을 그대로 둠

**해결** — [`index.html`](index.html) 의 `<title>` 을 실제 제목으로 변경

> 바꾼 뒤에도 "Vite App" 이 보인다면 **제목을 바꾸기 전에 열어둔 옛 탭**일 수 있습니다. 그 탭을 새로고침하면 바뀝니다. 배포본의 실제 제목은 이렇게 확인합니다.
>
> ```sh
> curl -s https://skala-vue-practice-kappa.vercel.app/ | grep title
> ```

### 11-12. 커밋했는데 GitHub 에 안 보임

**증상** — 커밋을 했는데 저장소 페이지에 파일이 없음.

**원인** — **커밋과 push 는 별개.** 커밋은 내 컴퓨터 안의 기록일 뿐

**확인 방법**
```sh
git status -sb
## main...origin/main [ahead 1]   ← 로컬이 1개 앞섬 = 아직 안 올라감
## main...origin/main             ← 동기화됨
```

**해결** — `git push origin main`

### 11-13. UI 라이브러리가 기존 디자인을 덮어쓸 위험

**상황** — Element Plus 를 `main.js` 에 전역 등록하면 대시보드 디자인까지 영향을 받음.

**해결** — 연습 페이지 파일 안에서만 import. 빌드 결과로 격리가 확인됨.

```text
UiPracticeView-*.js   365.59 kB   ← 라이브러리가 여기에만
WeatherHomeView-*.js    4.30 kB   ← 대시보드는 그대로
```

### 11-14. 정리할 때 설정 코드까지 지울 뻔함

**상황** — 안 쓰는 파일을 정리하며 `stores/counter.js` 를 삭제. [`main.js`](src/main.js) 의 `app.use(createPinia())` 는 남겨둠.

**결과** — 과제 5에서 설정 없이 바로 스토어를 만들 수 있었음.

**배운 것** — 예제 파일과 설정 코드는 구분해서 지워야 함.

---

## 12. 강의 범위를 넘어선 부분

과제 요구사항 자체는 강의자료대로 구현했습니다. 다만 **자료에 없는 기법**을 쓴 곳이 있어 따로 표시합니다.
어디까지가 배운 것이고 어디부터가 추가인지 구분하기 위한 목록입니다.

### 12-1. 요구사항이 자율에 맡긴 항목

강의자료가 "본인만의 ○○을 추가한다"라고 열어둔 부분입니다. 범위 안입니다.

| 항목 | 근거 요구사항 | 구현 |
| --- | --- | --- |
| 통계 페이지 | 과제 4 요구사항 6 — 추가 view 작성 | [WeatherStatsView.vue](src/views/WeatherStatsView.vue) (`/stats`) |
| 즐겨찾기 스토어 | 과제 5 요구사항 4 — 추가 Store | [favoriteStore.js](src/stores/favoriteStore.js) |
| `unitLabel` getter · `setUnit` action | 과제 5 요구사항 4 — state·getter·action 추가 | [configStore.js](src/stores/configStore.js) |
| 예보 · 대기오염 API | 과제 6 요구사항 2 — 제공 API 추가 | [openWeatherApi.js](src/api/openWeatherApi.js) |
| Open-Meteo API | 과제 6 요구사항 3 — 기타 외부 API | [openMeteoApi.js](src/api/openMeteoApi.js) |

### 12-2. 강의자료에 없지만 AI와 함께 작업한 내용에 대한 설명

강의자료만 보고는 떠올리기 어려운 부분으로 AI가 검토하는 과정에서 필요해서 넣었지만, 배운 범위 밖이라는 점을 명시합니다.

| # | 항목 | 위치 | 왜 넣었나 | 강의 범위로 낮춘다면 |
| --- | --- | --- | --- | --- |
| 1 | axios 인터셉터 | [openWeatherApi.js](src/api/openWeatherApi.js) | 401·404·429·타임아웃 문구를 한 곳에서 처리 | 각 함수에서 `try/catch` 로 개별 처리 |
| 2 | `Promise.all` / `allSettled` 구분 | [weatherStore.js](src/stores/weatherStore.js), [WeatherDetailView.vue](src/views/WeatherDetailView.vue) | 도시 5곳·API 4개를 동시 호출, 일부 실패 허용 | `for` 문으로 하나씩 `await` (느려짐) |
| 3 | 로딩·에러·데이터 3분기 상태 | [weatherStore.js](src/stores/weatherStore.js) | 통신에는 "데이터가 없는 순간" 이 있음 | 로딩 표시 없이 빈 화면 |
| 4 | 아이콘 URL 헬퍼 `getIconUrl` | [openWeatherApi.js](src/api/openWeatherApi.js) | 응답에 이미지 주소가 없어 코드로 조립해야 함 | 템플릿에 URL 문자열을 직접 이어붙이기 |
| 5 | 좌표(lat/lon)로 조회 | [cityList.js](src/data/cityList.js) | 도시명은 한글/영문 표기 차이로 검색 실패 | `q=Seoul` 처럼 영문 도시명 사용 |
| 6 | SPA 폴백 설정 | [vercel.json](vercel.json) | 배포 후 깊은 경로 새로고침이 404 (11-9 절) | — 대체 불가, 배포하면 반드시 필요 |
| 7 | `.env.example` 파일 | [.env.example](.env.example) | 키 없이 형식만 공유해 협업 가능하게 | 없어도 동작에는 지장 없음 |
| 8 | Element Plus 를 **페이지 안에서만** import | [UiPracticeView.vue](src/views/UiPracticeView.vue) | 전역 등록하면 기존 대시보드 디자인이 바뀜 | `main.js` 에서 `app.use(ElementPlus)` (일반적인 방식) |

### 12-3. 프로젝트 구조

| 결정 | 이유 |
| --- | --- |
| 프로젝트를 둘로 분리(`vue-weather-basic` / `vue-weather-dashboard`) | 과제 4에서 화면 전환 방식이 탭 → 라우터로 바뀌어, 한 프로젝트에 두면 이전 방식이 사라짐 |
| 과제 1~3 은 탭(`v-if`), 과제 4~ 는 라우터 | 위와 같은 이유. 두 방식을 나란히 비교할 수 있게 |
| `components/exercise/` 와 `components/practices/` 분리 | 강의자료 슬라이드의 폴더 트리를 따름 |
| Mock 데이터 삭제 | 과제 6부터 값이 전부 API 에서 오므로 참조되지 않는 파일이 됨 |

### 12-4. 한계

- 날씨 설명이 어색합니다 — "온흐림", "실 비" 는 OpenWeatherMap 의 한국어 번역입니다. `weather[0].id` 로 직접 라벨을 매핑하면 고칠 수 있지만 적용하지 않았습니다.
- 온도 변환 코드가 3곳에 중복 — 강의자료가 "Composable 로 해결 가능 (범위 제외)" 라고 명시한 부분이라 그대로 뒀습니다.
- ESLint 는 고칠 것이 없었습니다 — 처음 실행부터 0 error 였습니다. "에러를 없앴다" 가 아니라 "에러가 없음을 확인했다" 가 정확합니다.
