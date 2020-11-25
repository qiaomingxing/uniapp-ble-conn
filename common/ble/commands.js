import util from '@/common/ble/util.js'

module.exports = {
  GET_REAL_DATA: () => [0x53, 0x4e, 0x44, 0x09, 0x55, 0x31, 0x5e], // 获取实时数据
  GET_VERSION_INFO: () => [0x53, 0x4e, 0x44, 0x01, 0x55, 0x36, 0x9e], // 获取版本信息
  GET_UNIT_NAME: () => [0x53, 0x4e, 0x44, 0x02, 0x55, 0x36, 0x6e], // 获取单位名称
  GET_DOWNLOAD_INFO: () => [0x53, 0x4e, 0x44, 0x0e, 0x55, 0x33, 0x6e], // 获取下载信息
  DOWNLOAD: (page = 1) => {
    const param = '534e440f55' // 前导+功能码+命令类型
    const package16 = util
      .convertSystem(page, 10, 16)
      .padStart(4, 0)
      .match(/([0-9a-zA-Z]){2}/g)
      .reverse()
      .join('') // 当前下载包数，低位在前，高位在后
    const crc16 = util.crc16(util.fillSpace(param + package16)) // 校验码
    return util
      .fillSpace(param + package16 + crc16)
      .split(' ')
      .map(v => '0x' + v)
  },
  POWER_ON: () => [0x53, 0x4e, 0x44, 0x0d, 0xaa, 0xa0, 0x9f, 0x9d], // 开机
  POWER_OFF: () => [0x53, 0x4e, 0x44, 0x0d, 0xaa, 0x0a, 0x1f, 0xe2] // 关机
}
