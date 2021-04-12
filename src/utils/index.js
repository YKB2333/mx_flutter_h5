

// 判断是否为空
export function isEmpty(obj) {
  if (Array.isArray(obj) && obj.length == 0) {
    return true
  } else if (typeof obj == 'undefined' || obj == null) {
    return true
  } else if (typeof obj == 'string' && obj.trim() == '') {
    return true
  } else if (typeof obj == 'object' && JSON.stringify(obj) == "{}") {
    return true
  } else {
    return false
  }
}

// 节流函数
export function throttle(fn, delay){
  let timer
  let delays =  delay || 200
  return function(...args) {
    if(!timer) {
      timer = setTimeout(()=>{
        clearTimeout(timer)
        timer = null
      }, delays)
      fn.apply(this, args)
    }
  }
}

// 防抖函数
export function debounce(fn, delay) {
  let timer
  let delays =  delay || 200
  // 使用闭包，保证每次使用的定时器是同一个
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(()=>{
      fn.apply(this, args)
      // 结束之后清除定时器
      clearTimeout(timer)
    }, delays)
  }
}

// 获取URL参数
export function getQueryObject() {
  let url = location.search
  let obj = new Object()
  if (url.indexOf("?") != -1) {
    let str = url.substr(1)
    let strs = str.split("&")
    for(let i = 0; i < strs.length; i ++) {
      obj[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1])
    }
  }
  return obj;
}

export function formatDateStr(val) {
  if (!val) return ''
  return val.split(' ')[0]
} 
