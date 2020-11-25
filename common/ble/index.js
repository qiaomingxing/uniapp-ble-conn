import commands from '@/common/ble/commands.js'
import bleapi from '@/common/ble/api.js'
import debounce from '@/common/debounce/index.js'
import util from '@/common/ble/util.js'

export default {
  response: '',
  watchType: null,
  deviceId: null,
  serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
  characteristicId: '0000FFF2-0000-1000-8000-00805F9B34FB',
  notifyId: '0000FFF1-0000-1000-8000-00805F9B34FB',
  // 开机
  poweron() {
    this.write('POWER_ON')
  },
  // 关机
  poweroff() {
    this.write('POWER_OFF')
  },
  // 获取实时数据
  getRealData() {
    this.write('GET_REAL_DATA')
  },
  // 获取单位名称
  getUnitName() {
    this.write('GET_UNIT_NAME')
  },
  // 获取版本信息
  getVersionInfo() {
    this.write('GET_VERSION_INFO')
  },
  // 获取历史数据下载信息
  getDownloadInfo() {
    this.write('GET_DOWNLOAD_INFO')
  },
  // 历史数据下载
  download(param) {
    this.write('DOWNLOAD', param)
  },
  // 写入设备数据
  write(key, param) {
    console.log('写入命令：', commands[key](param))
    this.response = ''
    this.watchType = key
    const deviceId = this.deviceId
    const serviceId = this.serviceId
    const characteristicId = this.characteristicId
    const array = Array.from(commands[key](param))
    const buffer = new Uint8Array(array).buffer
    bleapi.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, buffer }).then(res => {})
  },
  /**
   * 启用设备特征值notify
   */
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
  /**
   * 设备特征值监听变化回调
   * @param {*} callback : 回调方法
   */
  watch(callback) {
    uni.onBLECharacteristicValueChange(res => {
      console.log('监听蓝牙设备特征值变化', this.watchType, JSON.stringify(res))
      if (res.characteristicId === this.notifyId) {
        switch (this.watchType) {
          case 'POWER_ON':
          case 'POWER_OFF':
            this.response += util.ab2hex(res.value) // 41434b0d01990d18
            console.log(this.response)
            debounce(() => {
              const isPoweron = this.watchType === 'POWER_ON'
              callback({ code: 1, data: { power: isPoweron ? 1 : 0 }, msg: 'success' })
            })
            break
          case 'GET_VERSION_INFO':
            this.response += util.ab2hex(res.value)
            debounce(() => {
              const softwareVersion = this.decodeStr(10, 30)
              const hardwareVerison = this.decodeStr(30, 50)
              callback({ code: 1, data: { softwareVersion, hardwareVerison }, msg: 'success' })
            })
            break
          case 'GET_UNIT_NAME':
            this.response += util.ab2hex(res.value)
            debounce(() => {
              const unitName = this.decodeStr(10, this.response.length - 4)
              callback({ data: { unitName } })
            })
            break
          case 'GET_REAL_DATA':
            this.response += util.ab2hex(res.value)
            debounce(() => {
              console.log(this.response)
              // 解析温度值
              const temp = this.decodeValue(this.substring(22, 26))
              // 解析湿度值
              const shidu = this.decodeValue(this.substring(26, 30))
              // 解析电量
              const charge = this.decodeValue(this.substring(30, 32), false)
              callback({ data: { temp, shidu, charge } })
            })
            break
          case 'GET_DOWNLOAD_INFO':
            this.response += util.ab2hex(res.value)
            debounce(() => {
              console.log(this.response)
              const time = this.decodeTime(this.response.substring(this.response.length - 16, this.response.length - 12))
              const temp = this.decodeValue(this.response.substring(this.response.length - 12, this.response.length - 8))
              const shidu = this.decodeValue(this.response.substring(this.response.length - 8, this.response.length - 4))
              const pages = this.decodeValue(this.response.substring(14, 18)) * 10
              callback({ data: { time, temp, shidu, pages } })
            })
            break
          case 'DOWNLOAD':
            this.response += util.ab2hex(res.value)
            debounce(() => {
              console.log(this.response)
              const pageNo = this.decodeValue(this.substring(10, 14)) * 10
              const pageSize = this.decodeValue(this.substring(14, 16)) * 10
              this.response = this.substring(16, this.response.length - 4)
              const list = []
              for (let i = 0; i < this.response.length; i += 16) {
                const item = this.substring(i, i + 16)
                const time = this.decodeTime(this.substring(0, 8, item))
                const temp = this.decodeValue(this.substring(8, 12, item))
                const shidu = this.decodeValue(this.substring(12, 16, item))
                list.push({ time, temp, shidu })
              }
              callback({ code: 1, msg: 'success', data: { pageNo, pageSize, list } })
            }, 1000)
            break
          default:
            console.log('default case')
        }
      }
    })
  },
  decodeStr(start, end) {
    return util.hex2str(this.response.substring(start, end))
  },
  /**
   * 按照协议解析时间
   * 年6bit / 月4bit /日 5bit / 时 5bit / 分6bit  /秒 6bit
   */
  decodeTime(v) {
    let system2 = ('0' + util.convertSystem(v, 16, 2)).padEnd(32, '0')
    let year = util.convertSystem(system2.substring(0, 6), 2, 10)
    let month = util.convertSystem(system2.substring(6, 10), 2, 10)
    let day = util.convertSystem(system2.substring(10, 15), 2, 10)
    let hour = util.convertSystem(system2.substring(15, 20), 2, 10).padStart(2, '0')
    let minute = util.convertSystem(system2.substring(20, 26), 2, 10).padStart(2, '0')
    let second = util.convertSystem(system2.substring(26, 32), 2, 10).padStart(2, '0')
    return `20${year}-${month}-${day} ${hour}:${minute}:${second}`
  },
  /**
   * 按照协议解析温度值、湿度值
   * 16进制转换为10进制除以10
   * @param {String} v : 4位，低位在前，高位在后，必须转换
   */
  decodeValue(v, isLowBefore = true) {
    if (isLowBefore) v = util.reverse(v)
    return parseInt(util.convertSystem(v, 16, 10)) / 10
  },
  substring(start, end, v = this.response) {
    return v.substring(start, end)
  },
  substr(start, len, v = this.response) {
    return v.substr(start, len)
  }
}
