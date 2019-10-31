const formatTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

const PromiseEND = Symbol('PromiseEND')


let _index = 0

const serverThrottle = (f, keyName = '__serverThrottleRunning') => {
  const _key = `${keyName}_${_index++}`
  return function (...arr) {
    const running = this[_key]
    if (!running) {
      const res = f.apply(this, arr)
      if (res instanceof Promise) {
        res.then(data => {
          this[_key] = data === PromiseEND
        })
      } else {
        this[_key] = res === PromiseEND
      }
    }
  }
}

module.exports = {
  formatTime: formatTime,
  serverThrottle,
  PromiseEND
}
