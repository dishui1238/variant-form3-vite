import { parse, stringify } from 'query-string'

interface GetTokenRequestParams {
  serviceName: string
  ticket: string
}
interface SSO_Options {
  ssoLoginUrl: string
  ssoLogoutUrl?: string
  requestTokenFn: (params: GetTokenRequestParams, xhrRequest: typeof createXHR) => Promise<string>
  ssoLogoutFn?: (xhrRequest: typeof createXHR, options: { ssoToken: string }) => Promise<void>
  ssoCacheKey?: string
}

interface RequestOptions {
  url: string
  methods: 'POST' | 'GET'
  data?: Record<string, any>
  headers?: Record<string, string>
}

function createXHR<T>(options: RequestOptions) {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(options.methods, options.url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')

    options.headers && (Object.keys(options.headers).forEach(key => {
      xhr.setRequestHeader(key, (options.headers as Record<string, string>)[key])
    }))

    xhr.send(JSON.stringify(options?.data || {}))

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.response))
        } else {
          reject(xhr.status)
        }
      }
    }
  })
}

export class SSO {
  private ssoToken = ''

  private ssoLoginUrl

  private ssoLogoutUrl

  private requestTokenFn

  private ssoLogoutFn

  private ssoCacheKey

  constructor(options: SSO_Options) {
    const {
      ssoLoginUrl, ssoLogoutUrl, requestTokenFn, ssoLogoutFn, ssoCacheKey,
    } = options
    this.ssoLoginUrl = ssoLoginUrl
    this.ssoLogoutUrl = ssoLogoutUrl || ssoLoginUrl
    this.requestTokenFn = requestTokenFn
    this.ssoLogoutFn = ssoLogoutFn
    this.ssoCacheKey = ssoCacheKey || 'auth-token'
    this.ssoToken = localStorage.getItem(this.ssoCacheKey) || ''
  }

  async checkLogin() {
    const parsedquery = parse(location.search)
    const ticket = parsedquery.ticket as string
    delete parsedquery.ticket
    const newSearch = stringify(parsedquery)
    const baseUrl = location.origin + location.pathname
    const serviceName = newSearch ? `${baseUrl}?${newSearch}` : baseUrl
    if (!ticket && !this.ssoToken) {
      this.goLogin()
    }

    if (ticket) {
      try {
        const token = await this.requestTokenFn({ serviceName, ticket }, createXHR)
        this.setToken(token)
        window.history.replaceState({}, '', location.pathname)
      } catch (e) {
        this.goLogin()
      }
    }
  }

  setToken(token: string) {
    this.ssoToken = token
    localStorage.setItem(this.ssoCacheKey, token)
  }

  getToken() {
    return this.ssoToken
  }

  clearToken() {
    this.ssoToken = ''
    localStorage.removeItem(this.ssoCacheKey)
  }

  goLogin() {
    this.clearToken()
    window.location.href = `${this.ssoLoginUrl}/login?service=${
      location.origin + location.pathname
    }`
  }

  goLogout() {
    this.clearToken()
    window.location.href = `${this.ssoLogoutUrl}/sso/logout?service=${
      location.origin + location.pathname
    }`
  }

  async logout() {
    if (this.ssoLogoutFn) {
      this.ssoLogoutFn(createXHR, { ssoToken: this.ssoToken }).then(() => {
        this.goLogout()
      })
    } else {
      this.goLogout()
    }
  }
}
