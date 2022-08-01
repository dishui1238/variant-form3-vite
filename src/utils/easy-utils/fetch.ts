import axios, {
  Canceler, Method, AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosPromise, AxiosError,
} from 'axios'
import { objToFormData } from './objToFormData'

type CacheRequestFn = 'cancel' | 'return'

interface ApiFetchConfig extends AxiosRequestConfig {
  beforeRequest?: (nowConfig: ApiFetchConfig, initConfig: ApiFetchConfig) => any
  requestError?: (err: AxiosError, requestFn: (config: AxiosRequestConfig) => AxiosPromise<any>, initConfig: ApiFetchConfig) => any
  beforeResponse?: (responseData: AxiosResponse, nowConfig: ApiFetchConfig, initConfig: ApiFetchConfig) => any
  responseError?: (err: AxiosError, requestFn: (config: AxiosRequestConfig) => AxiosPromise<any>, initConfig: ApiFetchConfig) => any
  cacheRequest?: boolean
  cacheRequestFn?: CacheRequestFn
}

interface RequestCacheContent<T> extends AxiosPromise<T> {
  cancel?: Canceler
}

interface ApiFetchSetConfig extends AxiosRequestConfig {
  requestSetKey?: string
  otherOptions?: Record<string, any>
}

interface RequestContent {
  data?: any
  query?: any
  formdata?: any
}

const FetchCancelToken = axios.CancelToken

const buildUniqueUrl = (url: string, method: Method, params: Record<string | number, any> = {}, data: Record<string | number, any> = {}): string => {
  const paramStr = (obj: Record<string | number, any>) => {
    if (toString.call(obj) === '[object Object]') {
      return JSON.stringify(Object.keys(obj).sort().reduce((result: Record<string | number, any>, key) => {
        result[key] = obj[key]
        return result
      }, {}))
    }
    if (toString.call(obj) === '[object FormData]') {
      const formdataobj: Record<string | number, any> = {}
      obj.forEach((value: any, key: any) => {
        formdataobj[key] = value
      })
      return JSON.stringify(formdataobj)
    }
    return JSON.stringify(obj)
  }
  return `${url}?${paramStr(params)}&${paramStr(data)}&${method}`
}

/**
   * 构建参数
   *
   * //请求类型
   * @param mehods
   * //请求路径
   * @param url
   * //请求数据
   * @param data
   * //请求选项
   * @param options
   */
const setRequestArgs = (method: Method, url: string, content?: RequestContent, options?: Record<string, any>): ApiFetchSetConfig => {
  const config: ApiFetchSetConfig = {
    method: method.toUpperCase() as Method,
    url,
  }

  if (options) {
    config.otherOptions = options
  }

  if (options?.headers) {
    config.headers = options.headers
  }

  config.params = content?.query || {}
  if (content?.formdata) {
    config.data = objToFormData(content.formdata)
  } else {
    config.data = content?.data || {}
  }

  return config
}

export class Fetch {
  // axios工厂函数的普遍配置
  private config: ApiFetchConfig

  // 拦截器对象
  private fetchInstance: AxiosInstance

  // 发出请求缓存但并未返回的 promise，以及相对应 cancel 函数
  private cache: Map<string, RequestCacheContent<any>> = new Map()

  constructor(config: ApiFetchConfig) {
    this.config = config
    this.fetchInstance = axios.create(config)

    this.initIntercept()
  }

  // 初始化拦截器
  private initIntercept() {
    // 请求拦截器
    this.fetchInstance.interceptors.request.use(config => {
      if (this.config.beforeRequest) {
        const conf = this.config.beforeRequest(config, this.config)
        return conf || config
      }
      return config
    }, error => {
      if (this.config.requestError) {
        const err = this.config.requestError(error, (config: AxiosRequestConfig) => this.createRequest(this.fetchInstance, config), this.config)
      }
    })

    // 返回参数时拦截
    this.fetchInstance.interceptors.response.use(response => {
      if (this.config.beforeResponse) {
        const req = this.config.beforeResponse(response, this.config, response.config)
        return req || response
      }
      return response.data
    }, error => {
      if (this.config.responseError) {
        const err = this.config.responseError(error, (config: AxiosRequestConfig) => this.createRequest(this.fetchInstance, config), this.config)
        return err || error
      }
      return error
    })
  }

  private createRequest<T>(axiosPromiseFactory: (apiConfig: AxiosRequestConfig) => AxiosPromise<T>, config: ApiFetchSetConfig): RequestCacheContent<T> {
    // 是否需要 cache
    const cacheRequest = typeof config.otherOptions?.cacheRequest === 'boolean' ? config.otherOptions.cacheRequest : this.config.cacheRequest
    // cache 函数
    const cacheRequestFn: CacheRequestFn | undefined = config.otherOptions?.cacheRequestFn ? config.otherOptions?.cacheRequestFn : this.config.cacheRequestFn

    const requestSetKey = buildUniqueUrl(config.url as string, config.method as Method, config.params, config.data)

    let requestCache = this.cache.get(requestSetKey)

    if (cacheRequest && requestCache) {
      if (cacheRequestFn === 'cancel') {
        requestCache.cancel && requestCache.cancel('request cancel')
      } else if (cacheRequestFn === 'return') {
        return requestCache
      }
    }
    const source = FetchCancelToken.source()
    config.cancelToken = source.token
    config.requestSetKey = requestSetKey
    requestCache = axiosPromiseFactory(config).then(response => {
      this.cache.delete(requestSetKey)
      return response
    }).catch(err => {
      this.cache.delete(requestSetKey)
      throw err
    })
    requestCache && (requestCache.cancel = source.cancel)

    this.cache.set(requestSetKey, requestCache)
    return requestCache
  }


  public cancelAll() {
    this.cache.forEach(cacheContent => {
      cacheContent.cancel && cacheContent.cancel()
    })
  }

  public get<T>(url: string, content?: RequestContent, options?: Record<string, any>): RequestCacheContent<T> {
    const config = setRequestArgs('GET', url, content, options)
    return this.createRequest(this.fetchInstance, config)
  }

  public post<T>(url: string, content?: RequestContent, options?: Record<string, any>): RequestCacheContent<T> {
    const config = setRequestArgs('POST', url, content, options)
    return this.createRequest(this.fetchInstance, config)
  }

  public delete<T>(url: string, content?: RequestContent, options?: Record<string, any>): RequestCacheContent<T> {
    const config = setRequestArgs('DELETE', url, content, options)
    return this.createRequest(this.fetchInstance, config)
  }

  public put<T>(url: string, content?: RequestContent, options?: Record<string, any>): RequestCacheContent<T> {
    const config = setRequestArgs('PUT', url, content, options)
    return this.createRequest(this.fetchInstance, config)
  }

  public patch<T>(url: string, content?: RequestContent, options?: Record<string, any>): RequestCacheContent<T> {
    const config = setRequestArgs('PATCH', url, content, options)
    return this.createRequest(this.fetchInstance, config)
  }

  public options<T>(url: string, content?: RequestContent, options?: Record<string, any>): RequestCacheContent<T> {
    const config = setRequestArgs('OPTIONS', url, content, options)
    return this.createRequest(this.fetchInstance, config)
  }

  public head<T>(url: string, content?: RequestContent, options?: Record<string, any>): RequestCacheContent<T> {
    const config = setRequestArgs('HEAD', url, content, options)
    return this.createRequest(this.fetchInstance, config)
  }

}