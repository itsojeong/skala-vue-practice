# skala-vue-practice

vue.js 수업을 통해 진행한 Code Challenge와 Hands-on 과제를 순서대로 따라하면서 작업에 필요한 소스코드와 설명을 AI의 도움을 받아 기록했습니다.


## 제출 정보

| 항목 | 주소 |
| --- | --- |
| GitHub 저장소 | https://github.com/itsojeong/skala-vue-practice |
| 배포 주소 (Vercel) | https://skala-vue-practice-kappa.vercel.app |
| 과제 1~3 문서 | [vue-practice/vue-weather-basic/README.md](vue-practice/vue-weather-basic/README.md) |
| 과제 4~7 문서 | [vue-practice/vue-weather-dashboard/README.md](vue-practice/vue-weather-dashboard/README.md) |

## 직접 추가한 부분

과제 요구사항에는 없지만 스스로 정하고 만든 것들입니다.

### 📊 통계 페이지 (`/stats`)

> 과제 4 요구사항 6 — "본인의 추가 view 를 작성하고 Routing 한다"

날씨 목록을 보여주는 것에서 그치지 않고, **모아둔 데이터를 다시 계산해서 보여주는 화면**을 만들었습니다.
[WeatherStatsView.vue](vue-practice/vue-weather-dashboard/src/views/WeatherStatsView.vue)

| 보여주는 것 | 계산 방법 |
| --- | --- |
| 평균 기온 | `reduce` 로 합계 → 도시 수로 나눔 (소수 첫째 자리 반올림) |
| 최고 / 최저 기온 | `reduce` 로 도시 **객체**를 찾아 기온과 도시명을 함께 표시 |
| 날씨 상태별 도시 수 | `reduce` 로 `{ 맑음: 2, 비: 1 }` 형태로 집계 후 막대그래프 |

**이 화면에서 신경 쓴 점**

- **집계 로직 4개를 전부 `computed` 로** — 원본 데이터가 바뀌면 통계도 자동으로 다시 계산됩니다
- **차트 라이브러리 없이 막대그래프** — 최댓값 대비 비율을 계산해 CSS `width` 로 바인딩했습니다
- **API 중복 호출 방지** — 대시보드에서 이미 받아왔으면 다시 부르지 않습니다 (Pinia 스토어 공유)
- **단위 설정 연동** — 상단에서 화씨로 바꾸면 통계 숫자도 함께 바뀝니다
- **빈 데이터 방어** — 목록이 비었을 때 `Math.max(...[])` 가 `-Infinity` 를 반환하는 문제를 막았습니다

즉 통계 페이지는 **앞의 과제에서 배운 것들이 한 화면에 모이는 지점**입니다.
과제 2의 `computed`, 과제 4의 라우팅, 과제 5의 스토어 공유, 과제 6의 API 연동이 함께 쓰입니다.

### 그 밖에 추가한 것

| 항목 | 내용 |
| --- | --- |
| ⭐ 즐겨찾기 | 별도 Pinia 스토어. 대시보드에서 별을 누르면 상세 페이지에도 유지됩니다 |
| 🌡️ 섭씨/화씨 전환 | 원본은 섭씨로 두고 **표시할 때만 변환** — 여러 번 오가도 값이 어긋나지 않습니다 |
| 📈 시간대별 기온 그래프 | OpenWeatherMap 외에 Open-Meteo API 를 추가로 연동 (키 불필요) |
| 🧩 UI 연습 페이지 (`/ui`) | Element Plus 기본 컴포넌트 모음. 기존 화면에 영향이 없도록 그 페이지 안에서만 로드합니다 |

각 항목을 왜 그렇게 만들었는지는 [과제 4~7 문서](vue-practice/vue-weather-dashboard/README.md)의 **12절 "강의 범위를 넘어선 부분"** 에 정리했습니다.

## 문서 분리 기준

Hands on 과제를 **Vue Router 적용 시점**을 기준으로 두 프로젝트로 나눴습니다.
과제 4에서 화면 전환 방식 자체가 탭에서 라우터로 바뀌기 때문에, 한 프로젝트에 두면 이전 방식을 제거해야하기 때문에 기록하기 위해서 분리했습니다.

| 프로젝트 | 내용 | 포트 |
| --- | --- | --- |
| [vue-practice/vue-weather-basic](vue-practice/vue-weather-basic) | 과제 1~3 + 컴포넌트 문법 연습 | 5174 |
| [vue-practice/vue-weather-dashboard](vue-practice/vue-weather-dashboard) | 과제 4 Router + 5 Store(Pinia) + 6 Axios + 7 Deployment | 5173 |

각 폴더의 `README.md`에 배운 내용과 막혔던 지점을 단계별로 정리했습니다.

## 실행

```sh
cd vue-practice/vue-weather-basic && npm run dev       # http://localhost:5174
cd vue-practice/vue-weather-dashboard && npm run dev   # http://localhost:5173
```

포트를 다르게 잡아 두 프로젝트를 동시에 띄워놓고 비교할 수 있습니다.

## 전체 회고 (What I Learned)
이 강의를 듣기 전에는 프론트엔드 개발을 디자인된 화면을 코드로 구현해준다는 정도로만 이해하고 있었는데,실습을 하나씩 따라가면서 아래 흐름을 직접 수행해볼 수 있었습니다.
1. Vue 기본 문법(v-for, v-if, v-model, 이벤트)으로 화면 하나를 대충 완성 →
2. Composition API(computed, watch)로 로직을 정리 →
3. 컴포넌트 분리(props/emit/slot)로 재사용 가능한 부품 단위로 쪼개고 →
4. Router로 여러 화면을 하나의 앱처럼 연결하고 →
5. Pinia로 화면을 넘나들며 공유해야 하는 상태를 한 곳에 모으고 →
6. Axios로 외부 데이터를 붙이고 (실패 상황에 대한 대비까지) →
7. UI 라이브러리로 디자인을 다듬고 →
8. ESLint/Prettier/env/build로 코드 품질과 배포 준비를 마무리

이전 시간들에 대비해서 눈으로 바로 코드 결과를 보면서 재미를 느꼈고, 에러 메시지를 읽는 방법과 터미널 사용 등 기본적인 개발자 태도를 배웠습니다.
README 파일도 처음 작성해 보았는데, 이게 어떤 내용을 담아야하는 문서인지를 찾아보며 알게되었습니다.
비전공자 입장에서 가장 막막했던 건 "에러가 나면 그냥 다 망한 줄" 알았던 초반 마인드였는데, 실습을 반복하면서 에러 메시지 자체가 다음에 뭘 해야 하는지 알려주는 힌트라는 걸 깨달은 게 이번 과정에서 가장 큰 배움이었습니다.
