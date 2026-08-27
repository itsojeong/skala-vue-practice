// 과제 6부터는 날씨 값을 API 로 받아오므로, 여기에는 "어디를 조회할지"만 남는다.
// 도시 이름 대신 좌표를 쓰는 이유: 한글/영문 표기 차이로 검색이 실패하는 일이 없다.
export const cityList = [
  { id: 'city_01', name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 'city_02', name: '수원', lat: 37.2636, lon: 127.0286 },
  { id: 'city_03', name: '부산', lat: 35.1796, lon: 129.0756 },
  { id: 'city_04', name: '강릉', lat: 37.7519, lon: 128.8761 },
  { id: 'city_05', name: '제주', lat: 33.4996, lon: 126.5312 },
]

export const findCityById = (cityId) => cityList.find((city) => city.id === cityId)
