const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
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
