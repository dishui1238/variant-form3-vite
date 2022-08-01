function setSystemEnvByHost() {
  const host = window.location.host
  return host.startsWith('city') ? 'city' : 'normal'
}

export const systemEnv = setSystemEnvByHost()
// export const systemEnv = 'city'
