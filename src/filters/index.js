export { formatDateStr } from '@/utils'

export  function formatMoney(val, isDivide = true) { // isDivide: 是否/100
  if (!val) return '0.00'
  if (isDivide) {
    val = (val / 100).toString().replace(/\$|\,/g,'')
  } else {
    val = val.toString().replace(/\$|\,/g,'')
  }
  if(isNaN(val)) {
    return '0.00'
  }
  let sign = (val == (val = Math.abs(val)))
  val = Math.floor(val * 100+0.50000000001)
  let cents = val % 100
  val = Math.floor(val / 100).toString()
  if(cents < 10) {
    cents = "0" + cents
  }
  for (var i = 0; i < Math.floor((val.length-(1+i))/3); i++) {
    val = val.substring(0,val.length-(4*i+3))+',' + val.substring(val.length-(4*i+3))
  }
  return (((sign) ? '' : '-') + val + '.' + cents)
}

export function ownSpec(str) {
  let json = JSON.parse(str)
  return Object.values(json).join()
}