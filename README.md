# skala-vue-practice

vue.js 수업을 통해 진행한 code challenge를 작성합니다.

## 프로젝트 구성

Hands on 과제를 **Vue Router 적용 시점**을 기준으로 두 프로젝트로 나눴습니다.
과제 4에서 화면 전환 방식 자체가 탭에서 라우터로 바뀌기 때문에, 한 프로젝트에 두면 이전 방식이 사라져 비교가 불가능해집니다.

| 프로젝트 | 내용 | 포트 |
| --- | --- | --- |
| [vue-practice/vue-weather-basic](vue-practice/vue-weather-basic) | 과제 1~3 + 컴포넌트 문법 연습 (라우터 없음, 탭 전환) | 5174 |
| [vue-practice/vue-weather-dashboard](vue-practice/vue-weather-dashboard) | 과제 4 Weather Router + 과제 5 Weather Store (Pinia) | 5173 |

각 폴더의 `README.md`에 배운 내용과 막혔던 지점이 단계별로 정리되어 있습니다.

## 실행

```sh
cd vue-practice/vue-weather-basic && npm run dev       # http://localhost:5174
cd vue-practice/vue-weather-dashboard && npm run dev   # http://localhost:5173
```

포트를 다르게 잡아뒀으므로 두 프로젝트를 동시에 띄워놓고 비교할 수 있습니다.

## 다룬 내용

```text
SFC 구조 → props/emits → slot(default·named·scoped)
   → v-for·v-if·이벤트 수식어·한글 입력 처리
   → computed·watch·watchEffect
   → 컴포넌트 분리·scoped style
   → Vue Router(지연 로딩·동적 경로·Programmatic Navigation·Catch-all)
   → Pinia Store(state·getters·actions·전역 상태 공유)
```
