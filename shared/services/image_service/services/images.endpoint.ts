export const IMAGES_ENDPOINTS = {
  v1: {
    get:      '/v1/public/image',
    getById:  (id: number) => `/v1/public/image/${id}`,
    post:     '/v1/public/image',
    upload:   '/v1/public/image/upload',
    put:      (id: number) => `/v1/public/image/${id}`,
    patch:    (id: number) => `/v1/public/image/${id}`,
    delete:   (id: number) => `/v1/public/image/${id}`,
  },
}
