import commands from '@/common/ble/commands.js'
import bleapi from '@/common/ble/api.js'
import debounce from '@/common/debounce/index.js'
import gbk from '@/common/gbk'

export default {
  response: '',
  watchType: null,
  deviceId: null,
  serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
  characteristicId: '0000FFF2-0000-1000-8000-00805F9B34FB',
  notifyId: '0000FFF1-0000-1000-8000-00805F9B34FB',
  getRealData() {
    this.write('GET_REAL_DATA')
  },
  getUnitName() {
    this.write('GET_UNIT_NAME')
  },
  getVersionInfo() {
    this.write('GET_VERSION_INFO')
  },
  getDownloadInfo() {
    this.write('GET_DOWNLOAD_INFO')
  },
  write(key) {
    this.response = ''
    this.watchType = key
    const deviceId = this.deviceId
    const serviceId = this.serviceId
    const characteristicId = this.characteristicId
    const array = Array.from(commands[key])
    const buffer = new Uint8Array(array).buffer
    bleapi.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, buffer }).then(res => {})
  },
  notify() {
    const deviceId = this.deviceId
    const serviceId = this.serviceId
    const characteristicId = this.notifyId
    uni.notifyBLECharacteristicValueChange({
      state: true,
      deviceId,
      serviceId,
      characteristicId,
      success: res => {
        console.log('启用蓝牙设备特征值notify成功', JSON.stringify(res))
      },
      fail: e => {
        console.log('启用蓝牙设备特征值notify失败', JSON.stringify(e))
      }
    })
  },
  watch(callback) {
    uni.onBLECharacteristicValueChange(res => {
      console.log('监听蓝牙设备特征值变化', this.watchType, JSON.stringify(res))
      if (res.characteristicId === this.notifyId) {
        switch (this.watchType) {
          case 'GET_VERSION_INFO':
            this.response += util.ab2hex(res.value)
            debounce(() => {
              callback(this.getResponse('41434b0118', '0000'))
            })
            break
          case 'GET_UNIT_NAME':
            this.response += util.ab2hex(res.value)
            debounce(() => {
              callback(this.getResponse('41434b0250', '0000'))
            })
            break
          case 'GET_REAL_DATA':
            this.response += util.ab2hex(res.value)
            debounce(() => {
              console.log(this.response)
              // 解析温度值
              const temp = this.decodeValue(this.response.substring(this.response.length - 4 - 2 - 4 - 4, this.response.length - 4 - 2 - 4))
              // 解析湿度值
              const shidu = this.decodeValue(this.response.substring(this.response.length - 4 - 2 - 4, this.response.length - 4 - 2))
              // 解析电量
              let chargestr = this.response.substring(this.response.length - 4 - 2, this.response.length - 4)
              const charge = parseInt(chargestr, 16) / 10
              callback({ temp, shidu, charge })
            })
            break
          case 'GET_DOWNLOAD_INFO':
            this.response += util.ab2hex(res.value)
            debounce(() => {
              console.log(this.response)
              const time = this.decodeTime()
              const temp = this.decodeValue(this.response.substring(this.response.length - 12, this.response.length - 8))
              const shidu = this.decodeValue(this.response.substring(this.response.length - 8, this.response.length - 4))
              callback({ time, temp, shidu })
            })
            break
          default:
            console.log('default case')
        }
      }
    })
  },
  getResponse(start, end) {
    console.log('getResponse：' + this.response)
    const sub = this.response.substring(this.response.indexOf(start) + start.length, this.response.indexOf(end))
    return { value: util.hex2str(sub) }
  },
  /**
   * 按照协议解析时间
   * 年6bit / 月4bit /日 5bit / 时 5bit / 分6bit  /秒 6bit
   */
  decodeTime() {
    let timestr = this.response.substring(this.response.length - 4 - 4 - 4 - 8, this.response.length - 4 - 4 - 4)
    let system2 = '0' + this.convertSystem(timestr, 16, 2)
    let year = this.convertSystem(system2.substring(0, 6), 2, 10)
    let month = this.convertSystem(system2.substring(6, 10), 2, 10)
    let day = this.convertSystem(system2.substring(10, 15), 2, 10)
    let hour = this.convertSystem(system2.substring(15, 20), 2, 10)
    let minute = this.convertSystem(system2.substring(20, 26), 2, 10)
    let second = this.convertSystem(system2.substring(26, 32), 2, 10)
    return `20${year}-${month}-${day} ${hour}:${minute}:${second}`
  },
  /**
   * 按照协议解析温度值、湿度值
   * 16进制转换为10进制除以10
   * @param {String} v : 4位，低位在前，高位在后，必须转换
   */
  decodeValue(v) {
    let v1 = v.substring(0, 2)
    let v2 = v.substring(2, 4)
    v = parseInt(v1, 16) > parseInt(v2, 16) ? v2 + v1 : v
    return parseInt(v, 16) / 10
  },
  /**
   * 任意进制转换
   * @param {String|Number} v : 值
   * @param {Number} m : 当前进制
   * @param {Number} n : 需要转换的禁止
   */
  convertSystem(v, m, n) {
    var s = v + ''
    var result = parseInt(s, m).toString(n)
    return result
  }
}

const util = {
  // jbk解码
  decode: function (str) {
    return gbk.decode(str)
  },
  // jbk编码
  encode: function (str) {
    return gbk.encode(str)
  },
  // arraybuffer转16进制
  ab2hex: function (buffer) {
    let hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    })
    return hexArr.join('')
  },
  // 16进制转字符串，中文需要gbk解码
  hex2str: function (str, detype = 'gbk') {
    if (str.length % 2 != 0) return
    let res = []
    let gbks = []
    for (var i = 0; i < str.length; i = i + 2) {
      gbks.push(parseInt(str.substr(i, 2), 16))
      res.push(String.fromCharCode(parseInt(str.substr(i, 2), 16)))
    }
    return detype === 'gbk' ? util.decode(gbks) : res.join('')
  },
  /**
   * 将字符串转换成ArrayBufer
   */
  string2buffer: function (str) {
    let val = ''
    if (!str) return
    let length = str.length
    let index = 0
    let array = []
    while (index < length) {
      array.push(str.substring(index, index + 2))
      index = index + 2
    }
    val = array.join(',')

    // 将16进制转化为ArrayBuffer
    return new Uint8Array(
      val.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      })
    ).buffer
  }
}
