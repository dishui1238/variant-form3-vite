import { systemEnv } from './hostEnv.config'

const defaultLogan = 'oa.sit'
const prefixLoganUrl = 'https://logan.devops.xiaohongshu.com/proxy/'

export const getLoganUrl = () => {
  const host = window.location.hostname
  if (/xiaohongshu\.com/i.test(host)) {
    let proxyKey = host.replace('.xiaohongshu.com', '')
    if (systemEnv === 'city') {
      proxyKey = proxyKey.replace('city', 'oa')
    }
    return `${prefixLoganUrl}${proxyKey}`
  }
  return `${prefixLoganUrl}${defaultLogan}`
}

export const LOGAN_PROTOCOL_HOST = 'https://logan.devops.xiaohongshu.com'
export const LOGAN_PROTOCOL_HOST_REGEXP = new RegExp(LOGAN_PROTOCOL_HOST)
export const LOGAN_CARTIER_PREFIX = getLoganUrl()
export const LOGAN_PREFIX = `${LOGAN_PROTOCOL_HOST}/proxy`
export const LOGAN_CARTIER_PREFIX_REGEXP = new RegExp(LOGAN_PREFIX)
