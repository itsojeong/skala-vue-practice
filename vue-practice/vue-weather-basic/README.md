# vue-weather-basic — Hands on 과제 1~3 + 컴포넌트 문법 연습

Vue를 처음 배우면서 **문법 → 반응형 → 컴포넌트 분리** 순서로 쌓아 올린 결과물입니다.
라우터를 적용한 과제 4는 별도 프로젝트 [`../vue-weather-dashboard`](../vue-weather-dashboard)에 있습니다.

```sh
npm run dev   # http://localhost:5174
```

실행하면 상단 탭으로 **과제 1 / 과제 2 / 과제 3 / Practice** 를 오갈 수 있습니다.

---

## 폴더 구조

```text
src/
├── App.vue                          # 탭 버튼으로 화면 전환 (라우터 없음)
├── main.js
└── components/
    ├── weather/                     # Hands on 과제
    │   ├── WeatherMockup.vue        # 과제 1 — 한 파일에 전부
    │   ├── WeatherComposition.vue   # 과제 2 — 반응형 도구 추가
    │   └── component/
    │       └── WeatherParent.vue    # 과제 3 — 부품을 조립하는 부모
    ├── exercise/                    # 과제 3에서 잘라낸 재사용 부품
    │   ├── BaseDashboardCard.vue
    │   ├── SearchBar.vue
    │   └── WeatherCard.vue
    └── practices/component/         # 문법 연습 (강의 슬라이드 따라하기)
        ├── ChildComponent.vue / ParentComponent.vue      # props & emits
        ├── SlotDefaultChild.vue / SlotDefaultParent.vue  # Default Slot
        ├── SlotNamedChild.vue / SlotNamedParent.vue      # Named Slot
        └── SlotScopedChild.vue / SlotScopedParent.vue    # Scoped Slot
```

**과제 1 → 2 → 3은 화면이 거의 똑같습니다.** 기능을 늘린 게 아니라 *같은 화면을 점점 나은 방법으로 다시 만든 것*이기 때문입니다. 세 파일을 나란히 열어놓고 비교하면 무엇이 나아졌는지가 보입니다.

---

## 0단계. 가장 먼저 넘어야 했던 벽 — SFC 구조

처음 만든 파일은 컴파일조차 되지 않았습니다. 한 파일에 컴포넌트 두 개를 넣었기 때문입니다.

```html
<!-- ❌ 안 되는 코드 -->
<script setup> ... </script>
<template> </template>
<div>{{ props.message }}     <!-- template 바깥에 태그가 있음 -->

<script setup> ... </script>  <!-- script가 두 번 -->
<template> ... </template>
```

**규칙:** `.vue` 파일 하나 = 컴포넌트 하나. `<script setup>` 하나, `<template>` 하나, `<style>` 하나.
컴포넌트가 두 개면 파일을 두 개로 나눠야 합니다.

---

## 1단계. props & emits — 컴포넌트끼리 대화하기

[`practices/component/ParentComponent.vue`](src/components/practices/component/ParentComponent.vue), [`ChildComponent.vue`](src/components/practices/component/ChildComponent.vue)

데이터는 **한 방향으로만** 흐릅니다.

```text
부모  ──[ props ]──▶  자식      값을 내려준다
부모  ◀──[ emits ]──  자식      "이런 일이 생겼어요" 하고 알린다
```

```js
// 자식: 받기 + 알리기
const props = defineProps({ message: String })
const emit = defineEmits(['reply'])
emit('reply', replyText.value)
```

```html
<!-- 부모: 내려주기 + 받기 -->
<ChildComponent :message="parentMessage" @reply="handleReply" />
```

**중요:** 자식은 `props.message`를 **직접 고칠 수 없습니다** (읽기 전용). 바꾸고 싶으면 이벤트로 부모에게 부탁해야 합니다. 이 제약 덕분에 값이 어디서 바뀌었는지 추적할 수 있습니다.

---

## 2단계. slot — 레이아웃에 구멍 뚫어두기

props가 **데이터**를 넘기는 통로라면, slot은 **HTML 덩어리**를 넘기는 통로입니다.

### Default Slot

```html
<!-- 자식: 여기에 뭐가 올지 모른다. 안 오면 아래 내용이 기본값 -->
<div class="base-card">
  <slot><p>기본 콘텐츠 영역입니다.</p></slot>
</div>

<!-- 부모: 태그 사이에 쓴 게 slot 자리를 대체한다 -->
<SlotDefaultChild><p>주입할 문장</p></SlotDefaultChild>
```

### Named Slot — 구멍이 여러 개일 때

```html
<!-- 자식 -->
<slot name="header"></slot>
<slot></slot>

<!-- 부모 (v-slot:header 는 #header 로 줄여 쓸 수 있음) -->
<template v-slot:header><h3>제목</h3></template>
<p>이름 없이 넘긴 건 이름없는 slot 으로 간다</p>
```

### Scoped Slot — 방향이 반대

자식이 가진 데이터를 부모의 마크업으로 그리고 싶을 때 씁니다.

```html
<!-- 자식: 자기 데이터를 slot 속성에 실어 보낸다 -->
<slot :text="message" :count="userCount">기본 화면</slot>

<!-- 부모: 받아서 원하는 모양으로 그린다 -->
<SlotScopedChild v-slot="slotBag">
  <p>알림: {{ slotBag.text }} / 접속자: {{ slotBag.count }}명</p>
</SlotScopedChild>
```

**핵심:** 부모는 `message`라는 변수를 가진 적이 없는데도 그 값을 그릴 수 있습니다. **데이터는 자식이, 모양은 부모가** 결정합니다.

---

## 3단계. 과제 1 — 화면 하나 만들기 (Mockup)

[`weather/WeatherMockup.vue`](src/components/weather/WeatherMockup.vue)

| 배운 것 | 코드 |
| --- | --- |
| 배열 렌더링 | `v-for="city in weatherList" :key="city.id"` |
| 조건부 렌더링 | `v-if="city.temp >= 25"` / `v-else` |
| 한글 입력 처리 | `:value="searchQuery" @input="onInput"` |
| 이벤트 수식어 | `@click.stop="showDetail(...)"` |

### `:key`에 왜 id를 넣나

Vue가 목록을 다시 그릴 때 "어느 항목이 그대로고 어느 게 새 것인지"를 구분하는 이름표입니다. 없거나 순서 번호(index)를 쓰면 중간에 항목을 지웠을 때 엉뚱한 카드가 남는 버그가 생깁니다.

### `v-model` 대신 `:value` + `@input`을 쓴 이유

한글은 자음·모음을 조합해서 한 글자가 됩니다. `v-model`은 **조합이 끝나야** 값을 반영해서, "서울"을 칠 때 마지막 글자가 한 박자 늦게 나타납니다.
`:value` + `@input`은 조합 중인 글자까지 즉시 반영합니다. 영어만 쓸 때는 차이가 없어서 놓치기 쉬운 부분입니다.

### `.stop`이 없으면 생기는 일

카드 전체에 클릭 이벤트가 걸려 있고, 그 안에 [상세보기] 버튼이 또 있습니다.
버튼을 누르면 클릭이 **위로 전파(버블링)** 되어 카드 클릭까지 같이 실행됩니다. `.stop`이 그 전파를 막습니다.

---

## 4단계. 과제 2 — 반응형 도구 추가 (Composition)

[`weather/WeatherComposition.vue`](src/components/weather/WeatherComposition.vue)

과제 1과 화면은 같지만, 검색 필터링을 **직접 계산하지 않고 Vue에게 맡깁니다.**

### computed — 다른 값에서 파생되는 값

```js
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})
```

`searchQuery`가 바뀌면 이 값이 **자동으로** 다시 계산됩니다. 바뀌지 않았으면 이전 결과를 재사용해서 낭비도 없습니다.

### watch vs watchEffect

| | watch | watchEffect |
| --- | --- | --- |
| 감시 대상 | 직접 지정 | 콜백 안에서 읽은 값을 자동 추적 |
| 이전 값 | 받을 수 있음 | 없음 |
| 최초 실행 | 안 함 (바뀔 때만) | 즉시 1회 실행 |

```js
watch(selectedCityInfo, (newValue, oldValue) => { ... })   // 이 값만 감시
watchEffect(() => { console.log(searchQuery.value) })      // 읽은 값을 알아서 감시
```

**언제 무엇을 쓰나:** 이전 값과 비교해야 하거나 특정 값만 콕 집어 감시할 땐 `watch`, 여러 값에 반응하고 초기 실행도 필요하면 `watchEffect`.

**computed와의 구분:** 새로운 *값*을 만들면 `computed`, 값 변화에 반응해 *다른 일*(로그, API 호출 등)을 하면 `watch` 계열입니다.

> 추가로 넣은 것: `showHotOnly` 체크박스와 `averageTemp` computed. computed를 두 번 써보려고 만들었습니다.

---

## 5단계. 과제 3 — 컴포넌트로 쪼개기 (Component)

[`weather/component/WeatherParent.vue`](src/components/weather/component/WeatherParent.vue) + [`exercise/`](src/components/exercise/) 3개

**기능은 하나도 안 바뀌었습니다.** 한 파일에 몰려 있던 것을 4개로 나눴을 뿐입니다.

| 파일 | 역할 | props | emits |
| --- | --- | --- | --- |
| WeatherParent | 상태를 전부 소유, 지휘 | — | — |
| [BaseDashboardCard](src/components/exercise/BaseDashboardCard.vue) | 흰 패널 디자인 공통화 | `title` | — (slot 사용) |
| [SearchBar](src/components/exercise/SearchBar.vue) | 검색창 표시 | `query` | `update-query` |
| [WeatherCard](src/components/exercise/WeatherCard.vue) | 도시 한 장 표시 | `city` | `select-card`, `click-detail` |

### 왜 나누나

- 카드 디자인을 고칠 때 `WeatherCard.vue` 한 파일만 열면 된다
- `<style scoped>`가 컴포넌트별로 분리되어 CSS 이름 충돌이 안 난다
- 각 파일이 짧아져서 무슨 일을 하는지 한눈에 보인다

### 여기서 처음 이해된 것 — 슬롯의 스코프

```html
<BaseDashboardCard title="도시 검색">
  <SearchBar :query="searchQuery" @update-query="onUpdateQuery" />
</BaseDashboardCard>
```

`SearchBar`는 **화면상으로는** `BaseDashboardCard` 안에 그려집니다.
하지만 **코드는** `WeatherParent`의 `<template>`에 쓰여 있으므로 부모 스코프에서 평가됩니다.
그래서 중간에 낀 `BaseDashboardCard`를 거치지 않고 부모가 `SearchBar`와 직접 통신할 수 있습니다.

**정리:** 슬롯으로 넘긴 내용은 *어디에 그려지는가*와 *어디에 속하는가*가 다릅니다.

---

## 학습 순서 요약

```text
SFC 구조 (파일 하나 = 컴포넌트 하나)
   ↓
props / emits  ─ 컴포넌트 간 단방향 데이터 흐름
   ↓
slot           ─ 레이아웃 주입 (default → named → scoped)
   ↓
과제 1  v-for · v-if · 이벤트 · 한글 입력      → 화면을 만든다
   ↓
과제 2  computed · watch · watchEffect        → 상태 변화를 Vue에게 맡긴다
   ↓
과제 3  컴포넌트 분리 · scoped style          → 유지보수 가능한 구조로 나눈다
   ↓
과제 4  Vue Router  → ../vue-weather-dashboard
```

---

## 막혔던 것과 해결

**한 파일에 컴포넌트 두 개**
`<script setup>`과 `<template>`이 두 벌씩 들어가 컴파일 실패. 파일을 분리해서 해결.

**같은 컴포넌트를 두 폴더에 만들어 중복**
어느 쪽이 실제로 쓰이는지는 **import 경로를 따라가면** 알 수 있습니다. 아무도 import하지 않는 파일은 화면에 나오지 않습니다.

**파일명에 공백과 `&` 사용**
`Props & Emits Example.vue`처럼 지으면 import할 때마다 경로를 이스케이프해야 합니다. 파일명은 영문·숫자·하이픈으로.

**IDE 자동 import가 만든 `.vue/index.js` 경로**
VSCode가 `.vue`를 폴더로 착각해 붙인 것입니다. 뒤의 `/index.js`만 지우면 됩니다.
