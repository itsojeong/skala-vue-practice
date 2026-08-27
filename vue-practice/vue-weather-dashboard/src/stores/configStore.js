import { defineStore } from 'pinia'

// 날씨 단위 설정을 앱 전체가 공유하는 스토어.
// 어느 컴포넌트에서 바꿔도 이 값을 쓰는 모든 화면이 함께 갱신된다.
export const useConfigStore = defineStore('config', {
  // state — 저장되는 값 (함수로 반환해야 인스턴스마다 독립된 객체가 만들어진다)
  state: () => ({
    unit: 'celsius',
  }),

  // getters — state 에서 파생되는 값. computed 와 같은 역할이다.
  getters: {
    // 현재 단위에 맞는 기호
    unitSymbol: (state) => (state.unit === 'celsius' ? '°C' : '°F'),

    // 요구사항 4 — 직접 추가한 getter. 화면에 표시할 한글 라벨
    unitLabel: (state) => (state.unit === 'celsius' ? '섭씨(°C)' : '화씨(°F)'),
  },

  // actions — state 를 바꾸는 함수. 화살표 함수를 쓰면 this 가 안 잡히니 주의.
  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },

    // 요구사항 4 — 직접 추가한 action. 값을 지정해서 설정
    setUnit(unit) {
      if (unit === 'celsius' || unit === 'fahrenheit') {
        this.unit = unit
      }
    },
  },
})
