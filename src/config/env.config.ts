import { LOGAN_CARTIER_PREFIX } from '@/config/logan.config'

const apiHost = {
  development: {
    host: LOGAN_CARTIER_PREFIX,
    SSO_LOGIN_URL: 'http://login2.sit.xiaohongshu.com',
  },
  test: {
    host: LOGAN_CARTIER_PREFIX,
    SSO_LOGIN_URL: 'http://login2.sit.xiaohongshu.com',
  },
  production: {
    host: '',
    SSO_LOGIN_URL: 'https://login2.xiaohongshu.com',
  },
}

let nodeEnv = process.env.NODE_ENV as 'development' | 'production' | 'test'

if (location.host === 'oa.sit.xiaohongshu.com' || location.host === 'city.sit.xiaohongshu.com') {
  nodeEnv = 'development'
} else if (location.host === 'oa.xiaohongshu.com' || location.host === 'city.xiaohongshu.com') {
  nodeEnv = 'production'
}

const envInfo = apiHost[nodeEnv]

export {
  nodeEnv,
  envInfo,
}
