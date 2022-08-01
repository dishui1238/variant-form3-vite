import Axios from 'axios'
import { ElMessage } from 'element-plus'
import { Fetch } from '@/utils/easy-utils/fetch'
import systemSso from '@/plugins/systemSso'
import { envInfo } from '@/config/env.config'

const request = new Fetch({
  baseURL: `${envInfo.host}`,
  timeout: 30000,
  withCredentials: false,
  cacheRequest: true,
  cacheRequestFn: 'cancel',
  beforeRequest(config) {
    config.headers && (config.headers.authorization = systemSso.getToken())
    if (config.method === 'get') {
      const requestParams = {} as Record<string, any>
      Object.keys(config.params).forEach(k => {
        if (config.params[k] !== '') {
          requestParams[k] = config.params[k]
        }
      })
      config.params = requestParams
    }
    return config
  },
  beforeResponse: response => {
    const res = response.data
    if (!res?.success) {
      const errMsg = res?.msg || '未知错误'
      if (!(response.config as any)?.otherOptions?.showMessage) {
        ElMessage.error(errMsg)
      }

      return Promise.reject(res?.code || errMsg)
    }
    return response
  },
  responseError(error) {
    if (!Axios.isCancel(error)) {
      if (error.response && error.response.status === 401) {
        systemSso.goLogout()
      } else {
        ElMessage.error(`${error.response?.data?.message}`)
      }
    }
    return Promise.reject(error)
  },
})

export { request }
