export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly url: string,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown; params?: QueryParams };

function withQuery(url: string, params?: QueryParams): string {
  if (!params) return url;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  }

  const qs = query.toString();
  return qs ? `${url}?${qs}` : url;
}

// Trabaja con URLs absolutas ya resueltas (ver buildUrl). No esta atado a un
// solo backend, porque un service puede llamar a varios backends y
// versiones distintas dentro de las mismas funciones.
async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, params, ...rest } = options;

  // multipart/form-data (ej. subida de imagenes): no se serializa a JSON y
  // no se fuerza el Content-Type, el navegador debe fijar el boundary solo.
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(withQuery(url, params), {
    ...rest,
    headers: isFormData
      ? { ...headers }
      : {
          "Content-Type": "application/json",
          ...headers,
        },
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new HttpError(response.status, response.url, `Error ${response.status} al llamar ${response.url}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const httpClient = {
  get: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options?: RequestOptions) => request<T>(url, { ...options, method: "POST", body }),
  put: <T>(url: string, body?: unknown, options?: RequestOptions) => request<T>(url, { ...options, method: "PUT", body }),
  patch: <T>(url: string, body?: unknown, options?: RequestOptions) => request<T>(url, { ...options, method: "PATCH", body }),
  delete: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: "DELETE" }),
};
