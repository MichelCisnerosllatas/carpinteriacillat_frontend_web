export const FURNITURE_ENDPOINTS = {
  v1: {
    getJoin: '/v1/public/furniture_join',
    getJoinById: (id: number) => `/v1/public/furniture_join/${id}`,
    get: '/v1/public/furniture',
    getById: (id: number) => `/v1/public/furniture/${id}`,
  },
}
