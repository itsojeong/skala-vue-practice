# skala-vue-practice

vue.js 수업을 통해 진행한 code challenge를 작성합니다.

## 제출 정보

| 항목 | 주소 |
| --- | --- |
| GitHub 저장소 | https://github.com/itsojeong/skala-vue-practice |
| 배포 주소 (Vercel) | https://skala-vue-practice-kappa.vercel.app |
| 과제 4~7 문서 | [vue-practice/vue-weather-dashboard/README.md](vue-practice/vue-weather-dashboard/README.md) |
| 과제 1~3 문서 | [vue-practice/vue-weather-basic/README.md](vue-practice/vue-weather-basic/README.md) |

트러블슈팅 기록은 과제 4~7 문서의 **11절**에 있습니다.

## 프로젝트 구성

Hands on 과제를 **Vue Router 적용 시점**을 기준으로 두 프로젝트로 나눴습니다.
과제 4에서 화면 전환 방식 자체가 탭에서 라우터로 바뀌기 때문에, 한 프로젝트에 두면 이전 방식이 사라져 비교가 불가능해집니다.

| 프로젝트 | 내용 | 포트 |
| --- | --- | --- |
| [vue-practice/vue-weather-basic](vue-practice/vue-weather-basic) | 과제 1~3 + 컴포넌트 문법 연습 (라우터 없음, 탭 전환) | 5174 |
| [vue-practice/vue-weather-dashboard](vue-practice/vue-weather-dashboard) | 과제 4 Router + 5 Store(Pinia) + 6 Axios + 7 Deployment | 5173 |

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
   → Axios(인스턴스·인터셉터·환경변수 키 관리·병렬 요청)
   → UI 라이브러리(Element Plus) · 빌드와 배포(ESLint·SPA 폴백)
```
