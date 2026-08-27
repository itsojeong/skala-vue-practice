import { defineStore } from 'pinia'

// 요구사항 4 — 직접 추가한 스토어. 즐겨찾기한 도시 id 를 앱 전체가 공유한다.
// 대시보드에서 별을 누르면 상세 페이지에서도 즐겨찾기 상태가 그대로 유지된다.
export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favoriteIds: [],
  }),

  getters: {
    favoriteCount: (state) => state.favoriteIds.length,

    // 인자를 받는 getter 는 "함수를 반환"하는 형태로 만든다
    isFavorite: (state) => (cityId) => state.favoriteIds.includes(cityId),
  },

  actions: {
    toggleFavorite(cityId) {
      const index = this.favoriteIds.indexOf(cityId)
      if (index === -1) {
        this.favoriteIds.push(cityId)
      } else {
        this.favoriteIds.splice(index, 1)
      }
    },

    clearFavorites() {
      this.favoriteIds = []
    },
  },
})
