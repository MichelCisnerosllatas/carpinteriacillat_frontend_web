export const SECTIONS_ENDPOINTS = {
  v1: {
    get:      '/v1/public/section',
    post:     '/v1/public/section',
    getById:  (id: number) => `/v1/public/section/${id}`,
    put:      (id: number) => `/v1/public/section/${id}`,
    patch:    (id: number) => `/v1/public/section/${id}`,
    delete:   (id: number) => `/v1/public/section/${id}`,
    reorder:  '/v1/public/section/reorder',
    getJoin:       '/v1/public/section_join',
    getJoinById:   (id: number) => `/v1/public/section_join/${id}`,
  },
}
