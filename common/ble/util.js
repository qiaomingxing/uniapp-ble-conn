import gbk from '@/common/gbk'
import crc from '@/common/ble/crc.js'

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
  },
  /**
   * 任意进制转换
   * @param {String|Number} v : 值
   * @param {Number} m : 当前进制
   * @param {Number} n : 需要转换的进制
   */
  convertSystem(v, m, n) {
    var s = v + ''
    var result = parseInt(s, m).toString(n)
    return result
  },
  /**
   * 不足位补0
   * @param {*} v : 数字
   * @param {*} n : 位数
   */
  fill0(v, n) {
    return Array(n > v ? n - ('' + v).length + 1 : 0).join(0) + v
  },
  /**
   * 每隔n位添加空格
   * @param {*} v
   * @param {*} n
   */
  fillSpace(v) {
    return v.replace(/\s*/g, '').replace(/(\w{2})(?=\w)/g, '$1 ')
  },
  crc16(v) {
    return crc.crc16(v)
  }
}

export default util
