
import http from '@/utils/http'
const SERVICE = '/gf-backstage-service'

// 后台字典配置查询
export function getSysdictQuery(dictType, dictKey) {
  return http.post(`${SERVICE}/api/sysdict/open/query`, { dictType, dictKey })
}

// 获取积分相关配置
export function getIntegralConfig() {
  return http.get(`${SERVICE}/api/sysdict/open/get_integral_config`)
}