# vue-weather-dashboard — Hands on 과제 4~5: Weather Router & Store

Vue Router를 적용해 **한 화면짜리 앱을 여러 페이지를 가진 앱으로 바꾸는** 과제입니다.
과제 1~3은 [`../vue-weather-basic`](../vue-weather-basic) 프로젝트에 있고, 이 폴더는 그 결과물 위에 라우터만 얹은 별도 프로젝트로 구분했습니다. 

```sh
npm run dev   # http://localhost:5173
```

| 과제 | 주제 | 핵심 도구 | 읽을 곳 |
| --- | --- | --- | --- |
| 4 | Weather Router | `vue-router` | 1~5절 |
| 5 | Weather Store | `pinia` | 6절 |

과제 5는 과제 4의 결과물을 **이어서 고친 것**이라 같은 프로젝트에 있습니다.

---

## 1. 이 과제에서 해결하려던 문제 (과제 4)

과제 3까지는 화면이 Home 하나로 작업되었습니다. 상세보기 버튼을 누르면 `window.alert()` 팝업이 떴는데, 이 방식에는 세 가지 한계가 있었습니다.

1 팝업을 닫으면 정보가 사라진다 (기록이 안 남음)
2 주소창이 바뀌지 않아서 **특정 도시 화면을 링크로 공유할 수 없다**
3 브라우저 뒤로가기 버튼이 동작하지 않는다

Vue Router는 **주소(URL)와 컴포넌트를 짝지어주는 도구**입니다. `/weather/city_01` 주소로 들어오면 서울 상세 페이지 컴포넌트를 그려주는 식입니다. 위 세 가지가 한 번에 해결됩니다.

---

## 2. 폴더 구조

```text
src/
├── main.js                      # 라우터를 앱 전체에 주입 (.use(router))
├── App.vue                      # 내비게이션 바 + RouterView(화면이 갈아끼워지는 자리)
├── router/
│   └── index.js                 # 어떤 주소에 어떤 컴포넌트를 띄울지 정의
├── data/
│   └── weatherMockData.js       # 목록·상세 화면이 함께 쓰는 임시 데이터
├── stores/                      # ★ 과제 5 — 컴포넌트 바깥에 두는 공유 상태
│   ├── configStore.js           # 날씨 단위 설정 (섭씨/화씨)
│   └── favoriteStore.js         # 즐겨찾기한 도시 목록
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
    └── NotFoundView.vue         # 그 외 모든 주소  404
```

### components와 views를 왜 나누나

기능은 똑같은 `.vue` 파일이지만 **역할이 다릅니다.**

| | components/ | views/ |
| --- | --- | --- |
| 성격 | 부품 | 페이지 |
| 재사용 | 여러 곳에서 반복 사용 | 한 주소에 하나 |
| 예 | 버튼, 카드, 검색창 | 대시보드 화면, 상세 화면 |

라우터에 등록되는 건 `views/`뿐입니다. 이 규칙을 지키면 나중에 "이 화면이 어느 주소였지?"를 폴더만 보고 알 수 있습니다.

---

## 3. 배운 것을 순서대로

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
- `name` — 코드에서 부를 이름 (주소를 나중에 바꿔도 이 이름은 그대로라 안전)
- `component` — 그 주소에서 띄울 컴포넌트

### 3-2. 지연 로딩 (Lazy Loading)

`component: WeatherAboutView` (미리 import)가 아니라 `component: () => import(...)` 형태로 씁니다.

**차이:** 앞쪽은 앱을 켤 때 모든 페이지를 통째로 내려받고, 뒤쪽은 **그 주소에 처음 들어갈 때 필요한 조각만** 내려받습니다. 화살표 함수로 감싸는 건 "지금 실행하지 말고, 필요할 때 실행할 함수만 넘겨둔다"는 뜻입니다.

`npm run build`를 돌리면 눈으로 확인됩니다.

```text
dist/assets/WeatherDetailView-CG96NYcg.js   1.83 kB
dist/assets/WeatherStatsView-DXH0zx_I.js    1.68 kB
dist/assets/NotFoundView-DQK-1Ztz.js        0.57 kB
```

페이지마다 파일이 따로 떨어졌습니다. 지연 로딩을 안 썼다면 `index.js` 하나만 나왔을 겁니다.
브라우저 개발자도구 Network 탭을 켜고 메뉴를 눌러보면, 그 순간 해당 `.js` 파일을 받아오는 게 보입니다.

### 3-3. App.vue의 역할 축소

[`App.vue`](src/App.vue)에는 이제 로직이 하나도 없습니다.

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

**공짜로 얻는 것:** 현재 주소와 일치하는 `RouterLink`에는 Vue Router가 `router-link-exact-active` 클래스를 자동으로 붙여줍니다. CSS만 쓰면 현재 메뉴 강조가 끝납니다. 직접 "지금 어느 탭이지"를 변수로 관리할 필요가 없습니다.

### 3-4. 동적 경로 매칭 — 주소로 값을 전달하기

도시가 5개라고 상세 페이지를 5개 만들 수는 없습니다. 주소의 일부를 변수로 비워둡니다.

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

> **헷갈리기 쉬운 부분:** `useRoute()`와 `useRouter()`는 이름이 한 글자 차이지만 하는 일이 다릅니다.
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

> **반드시 배열의 맨 마지막에 둬야 합니다.** 라우터는 위에서부터 순서대로 검사하다가 처음 맞는 것에서 멈춥니다. 이걸 맨 위에 두면 `/about`도 `/stats`도 전부 404로 가버립니다.

---

## 4. 직접 확인해보기

| 해볼 것 | 기대 결과 | 확인하는 개념 |
| --- | --- | --- |
| 상세보기 버튼 클릭 | 주소가 `/weather/city_01`로 바뀜 | Programmatic Navigation |
| 그 상태에서 뒤로가기 | 대시보드로 복귀 | 브라우저 히스토리 연동 |
| 주소창에 `/weather/city_99` 입력 | "찾을 수 없습니다" 안내 | 동적 매칭은 되지만 데이터가 없는 경우 |
| 주소창에 `/asdf` 입력 | 404 페이지 | Catch-all Route |
| 개발자도구 Network 탭 켜고 메뉴 이동 | 그때그때 `.js` 파일을 받아옴 | 지연 로딩 |
| 카드 본문 클릭 vs 상세보기 클릭 | 앞은 상태바만, 뒤는 페이지 이동 | `@click.stop` (이벤트 버블링 차단) |

---

## 5. 과제 요구사항 대조표 (과제 4)

| 요구사항 | 구현 위치 |
| --- | --- |
| 1. 지연 로딩 · Catch-all Route | [router/index.js](src/router/index.js) |
| 2. App.vue에 RouterLink · RouterView | [App.vue](src/App.vue) |
| 3. WeatherHomeView — alert 제거, router.push | [WeatherHomeView.vue](src/views/WeatherHomeView.vue) |
| 4. WeatherDetailView — cityId 기반 Mock 조회 | [WeatherDetailView.vue](src/views/WeatherDetailView.vue) |
| 5. WeatherAboutView — 소개 + 복귀 링크 | [WeatherAboutView.vue](src/views/WeatherAboutView.vue) |
| 6. 추가 view 작성 및 라우팅 | [WeatherStatsView.vue](src/views/WeatherStatsView.vue) (`/stats`) |

**추가 view (`/stats`)** 는 `computed`로 평균·최고·최저 기온과 날씨 상태별 도시 수를 집계합니다. 과제 2에서 배운 `computed`를 새 화면에서 다시 쓴 것입니다.

---

## 6. 과제 5: Weather Store (Pinia)

### 6-1. 왜 스토어가 필요했나

지금까지 상태는 전부 **부모가 소유하고 props 로 내려주는** 방식이었습니다. 그런데 날씨 단위 설정은 성격이 다릅니다.

- 바꾸는 곳 — 내비게이션 바의 `UnitToggler`
- 쓰는 곳 — 대시보드 카드, 상세 페이지, 통계 페이지

props 로 하려면 `App → RouterView → 각 View → WeatherCard` 까지 값을 계속 내려보내고, 바꿀 때는 emit 을 역순으로 올려야 합니다. **중간 컴포넌트들은 그 값에 관심도 없는데 배달만 하는** 구조가 됩니다. 이걸 prop drilling 이라고 부릅니다.

Pinia 는 상태를 **컴포넌트 바깥**에 둡니다. 필요한 컴포넌트가 직접 꺼내 쓰고, 중간 경로는 아무것도 몰라도 됩니다.

```text
[props 방식]                        [스토어 방식]
App                                 ┌──────────────┐
 └ View        ← 값을 배달           │ configStore  │
    └ Card     ← 값을 배달           └──────────────┘
       └ 사용                          ↑          ↑
                                UnitToggler   WeatherCard
                                (바꾼다)       (읽는다)
```

> Pinia 는 프로젝트 생성 시 이미 설치되어 있었고, [`main.js`](src/main.js) 의 `app.use(createPinia())` 한 줄로 등록됩니다.

### 6-2. 스토어의 세 부분 — state · getters · actions

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

이미 컴포넌트에서 쓰던 것들과 1:1로 대응됩니다.

| 스토어 | 컴포넌트에서는 | 하는 일 |
| --- | --- | --- |
| `state` | `ref()` | 값 보관 |
| `getters` | `computed()` | 파생 값 |
| `actions` | 일반 함수 | 값 변경 |

**틀리기 쉬운 두 가지**

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

지금까지 만든 컴포넌트와 결정적으로 다릅니다. `SearchBar` 는 `props` 로 받고 `emits` 로 올렸지만, 이 컴포넌트는 **부모와 대화하지 않습니다.** 스토어를 직접 읽고 씁니다.
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

**핵심은 원본을 건드리지 않는 것입니다.** `city.temp` 자체를 화씨로 바꿔버리면 다시 섭씨로 돌릴 때 반올림 때문에 값이 어긋납니다 (28 → 82 → 27.8). 원본은 섭씨로 두고 **그릴 때만** 변환하면 몇 번을 오가도 값이 유지됩니다.

같은 이유로 `v-if="city.temp >= 25"` 배지 조건은 `displayTemp` 가 아니라 **원본 `city.temp`** 를 씁니다. 화씨로 바꿨다고 "더움" 기준이 82도로 바뀌면 안 되기 때문입니다.

### 6-5. 요구사항 대조표

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

### 6-6. 확인해보기

| 해볼 것 | 기대 결과 | 확인하는 개념 |
| --- | --- | --- |
| 단위변경 클릭 | 대시보드 카드 온도가 전부 ℉ | state 공유 |
| 그 상태로 상세 페이지 이동 | 상세도 ℉ 유지 | 페이지가 바뀌어도 스토어는 살아있음 |
| 통계 페이지 이동 | 평균·최고·최저 전부 ℉ | 세 화면이 같은 값을 봄 |
| 대시보드에서 ★ 누르고 상세 이동 | 상세에도 ★ 켜져 있음 | 스토어를 통한 컴포넌트 간 동기화 |
| **브라우저 새로고침** | 설정이 초기값으로 돌아감 | 스토어는 메모리에만 있음 |

마지막 항목이 중요합니다. Pinia 는 **메모리 저장소**라 새로고침하면 사라집니다. 유지하려면 `localStorage` 에 저장하는 작업이 따로 필요합니다.

### 6-7. 남겨둔 중복 — Composable

`displayTemp` 변환 로직이 [`WeatherCard.vue`](src/components/exercise/WeatherCard.vue), [`WeatherDetailView.vue`](src/views/WeatherDetailView.vue), [`WeatherStatsView.vue`](src/views/WeatherStatsView.vue) 세 곳에 거의 같은 모양으로 들어가 있습니다.

강의 자료에 "Composable 로 해결 가능 (범위 제외)" 라고 적힌 지점입니다. `composables/useTemperature.js` 하나를 만들어 세 곳에서 불러 쓰면 한 벌로 줄어듭니다. 범위 밖이라 중복을 그대로 뒀습니다.

---

## 7. 작업하면서 막혔던 것

**`#app`이 2열로 갈라짐**
내비게이션이 왼쪽, 화면이 오른쪽에 나오는 문제가 있었습니다. 원인은 내 코드가 아니라 Vue 프로젝트 생성 시 딸려온 [`assets/main.css`](src/assets/main.css)의 기본 스타일이었습니다.

```css
@media (min-width: 1024px) {
  #app { display: grid; grid-template-columns: 1fr 1fr; }  /* ← 범인 */
}
```

기본 템플릿 CSS도 내 레이아웃에 영향을 준다는 걸 알게 됐습니다. `display: block`으로 바꿔 해결했습니다.

**IDE 자동 import가 만든 잘못된 경로**
VSCode에서 `.vue` 파일을 다른 폴더로 옮겼더니 import 경로가 `ChildComponent.vue/index.js`로 자동 수정되면서 에러가 났습니다. `.vue`를 폴더로 착각한 것이라 뒤의 `/index.js`만 지우면 됩니다.

**중복 파일 정리**
같은 컴포넌트를 두 폴더에 만들어 두고 헷갈린 적이 있습니다. 어느 쪽이 실제로 쓰이는지는 **import 경로를 따라가면** 알 수 있습니다. 아무도 import하지 않는 파일은 화면에 나오지 않습니다. 라우터를 새로 쓰면서 연결이 끊긴 기본 템플릿 파일들(`HomeView.vue`, `TheWelcome.vue`, `icons/` 등)도 함께 정리했습니다.

**빈 파일 `UnitToogler.vue`**
파일명을 `Toogler` 로 잘못 만들어 `src/` 최상단에 0바이트로 남아 있었습니다. 컴포넌트는 `components/exercise/UnitToggler.vue` 로 다시 만들고 오타 파일은 지웠습니다.

**Pinia 가 이미 등록되어 있었던 것**
안 쓰이는 파일을 정리할 때 `stores/counter.js` 는 지웠지만 [`main.js`](src/main.js) 의 `app.use(createPinia())` 는 남겨뒀습니다. 덕분에 과제 5에서 설정 없이 바로 스토어를 만들 수 있었습니다. **설정 코드와 예제 파일은 구분해서 지워야 한다**는 걸 알게 된 지점입니다.
