import { SSO } from '@/utils/easy-utils'
import { envInfo } from '@/config/env.config'
// import { USER_PERMISSION } from '~/config/constVariable.config'

// const USER_PERMISSION = 'USER_PERMISSION'

export default new SSO({
  ssoLoginUrl: envInfo.SSO_LOGIN_URL,
  requestTokenFn: (params, createXhr) => createXhr<any>({
    url: `${envInfo.host}/xhs-oa/oa/loginController/ssoLogin`,
    methods: 'POST',
    data: params,
  }).then(({ data }) => {
    const { token } = data
    // localStorage.setItem(USER_PERMISSION, JSON.stringify(permissions || []))
    return token
  }),
  ssoLogoutFn: (createXhr, { ssoToken }) => {
    // localStorage.removeItem(USER_PERMISSION)
    return createXhr({
      url: `${envInfo.host}/xhs-oa/oa/loginController/loginOut`,
      methods: 'GET',
      headers: {
        authorization: ssoToken,
      },
    })
  },
})
