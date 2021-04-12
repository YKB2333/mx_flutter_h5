import http from '@/utils/http'
const SERVICE = '/gf-auth-service'

// 微信分享
export function wxShare(type, id) {
  return http.get(`${SERVICE}/wx/share/${id}/${type}`)
}