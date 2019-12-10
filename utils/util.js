const formatTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null
  }

  const _arr = time.split('T')
  const dateList = _arr.shift().split('-').map(item => Number(item))
  const timeList = _arr.shift().split('.').shift().split(':').map(item => Number(item))

  dateList[1] -= 1
  
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  const date = new Date(dateList[0], dateList[1], dateList[2], timeList[0], timeList[1], timeList[2])
  /* if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  } */
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
