export const SECTION_IMAGES_ENDPOINTS = {
  v1: {
    get:      '/v1/public/section-image',
    post:     '/v1/public/section-image',
    getById:  (id: number) => `/v1/public/section-image/${id}`,
    put:      (id: number) => `/v1/public/section-image/${id}`,
    patch:    (id: number) => `/v1/public/section-image/${id}`,
    delete:   (id: number) => `/v1/public/section-image/${id}`,
    getJoin:      '/v1/public/section-image_join',
    getJoinById:  (id: number) => `/v1/public/section-image_join/${id}`,
  },
}
