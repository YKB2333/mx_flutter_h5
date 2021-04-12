
import http from '@/utils/http'

const SERVICE = '/gf-order-service'

// 购物车列表
export function getCartList() {
  return http.post(`${SERVICE}/api/ordercart/list`)
}
// 添加购物车
export function addCart(quantity, skuId) {
  return http.post(`${SERVICE}/api/ordercart/add`, { quantity, skuId })
}