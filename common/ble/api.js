module.exports = {
  /**
   * 初始化蓝牙设备
   */
  openBluetoothAdapter() {
    return new Promise((resolve, reject) => {
      uni.openBluetoothAdapter({
        success: res => {
          console.log('初始化蓝牙设备成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('初始化蓝牙设备失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 开始搜索蓝牙设备
   */
  startBluetoothDevicesDiscovery() {
    return new Promise((resolve, reject) => {
      uni.startBluetoothDevicesDiscovery({
        success: res => {
          console.log('开始搜索蓝牙设备成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('开始搜索蓝牙设备失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 停止搜索蓝牙设备
   */
  stopBluetoothDevicesDiscovery(types) {
    return new Promise((resolve, reject) => {
      uni.stopBluetoothDevicesDiscovery({
        success: res => {
          console.log('停止搜索蓝牙设备成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('停止搜索蓝牙设备失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
   */
  getBluetoothDevices() {
    return new Promise((resolve, reject) => {
      uni.getBluetoothDevices({
        success: res => {
          const list = res.devices.filter(v => v.localName)
          console.log('获取蓝牙设备成功', JSON.stringify(list))
          resolve(list)
        },
        fail: e => {
          console.log('获取蓝牙设备失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 获取本机蓝牙适配器状态
   */
  getBluetoothAdapterState() {
    return new Promise((resolve, reject) => {
      uni.getBluetoothAdapterState({
        success: res => {
          console.log('获取本机蓝牙适配器状态成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('获取本机蓝牙适配器状态失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 连接低功耗蓝牙
   */
  createBLEConnection({ deviceId }) {
    return new Promise((resolve, reject) => {
      uni.createBLEConnection({
        deviceId,
        success: res => {
          console.log('连接低功耗蓝牙成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('连接低功耗蓝牙失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 断开与低功耗蓝牙设备的连接
   */
  closeBLEConnection({ deviceId }) {
    return new Promise((resolve, reject) => {
      uni.closeBLEConnection({
        deviceId,
        success: res => {
          console.log('断开低功耗蓝牙成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('断开低功耗蓝牙失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 获取所有服务
   */
  getBLEDeviceServices({ deviceId }) {
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceServices({
        // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
        deviceId,
        success: res => {
          console.log('获取设备服务成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('获取设备服务失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },

  /**
   * 获取某个服务下的所有特征值
   */
  getBLEDeviceCharacteristics({ deviceId, serviceId }) {
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: res => {
          console.log('获取特征值成功', JSON.stringify(res))
          resolve(res)
          // 批量notify 特征值
          for (let i in res.characteristics) {
            let item = res.characteristics[i]
            let characteristicId = item.uuid
            let notify = item.properties.notify
            module.exports.notifyBLECharacteristicValueChange({ deviceId, serviceId, characteristicId, notify })
          }
        },
        fail: e => {
          console.log('获取特征值失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 订阅操作成功后需要设备主动更新特征值的 value，才会触发 uni.onBLECharacteristicValueChange 回调。
   */
  notifyBLECharacteristicValueChange({ deviceId, serviceId, characteristicId, notify }) {
    console.log({ deviceId, serviceId, characteristicId, notify })
    return new Promise((resolve, reject) => {
      if (!notify) {
        reject({ msg: 'not support notify' })
      } else {
        uni.notifyBLECharacteristicValueChange({
          state: true,
          deviceId,
          serviceId,
          characteristicId,
          success: res => {
            console.log('启用蓝牙设备特征值notify成功', JSON.stringify(res))
            resolve(res)
          },
          fail: e => {
            console.log('启用蓝牙设备特征值notify失败', JSON.stringify(e))
            reject(e)
          }
        })
      }
    })
  },

  /**
   * 	断开蓝牙模块
   */
  closeBluetoothAdapter() {
    return new Promise((resolve, reject) => {
      uni.closeBluetoothAdapter({
        success: res => {
          console.log('断开蓝牙模块成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('断开蓝牙模块失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  },
  /**
   * 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用
   */
  readBLECharacteristicValue({ deviceId, serviceId, characteristicId }) {
    return new Promise((resolve, reject) => {
      uni.readBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        success: res => {
          console.log('读取设备数据值成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('读取设备数据值失败', JSON.stringify(res))
          reject(e)
        }
      })
    })
  },
  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据
   * @param {*} param0
   */
  writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, buffer }) {
    // let writeCode = '534E440155369E'
    // let deviceId = this.equipment[0].deviceId
    // let serviceId = this.servicesData[0].uuid
    // let characteristicId = this.characteristicsData[0].uuid
    // //因为协议文档中，一个字节两个字符的控制命令，codeLength为命令字节数
    // let cy = 2
    // let codeLength = writeCode.length / cy
    // const buffer = new ArrayBuffer(codeLength)
    // const dataView = new DataView(buffer)
    // //在这里解析将要写入的值
    // for (let i = 0; i < codeLength; i++) {
    //   dataView.setUint8(i, '0X' + writeCode.substring(i * cy, i * cy + cy))
    //   console.log('次数：' + i + '---->' + '0X' + writeCode.substring(i * cy, i * cy + cy))
    // }
    // console.log('写入数据：' + JSON.stringify({ deviceId: deviceId, serviceId: serviceId, characteristicId: characteristicId }))

    // let oStr = "534E440155369E"
    // let buffer = this.string2buffer(oStr)

    // const codes = [0X53, 0X4E, 0X44, 0X01, 0X55, 0X36, 0X9E]
    // const buffer = new ArrayBuffer(codes.length)
    // const dataView = new DataView(buffer)
    // for (let i in codes) {
    //   dataView.setUint8(i, codes[i])
    // }
    return new Promise((resolve, reject) => {
      uni.writeBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        value: buffer,
        success: res => {
          console.log('写入成功', JSON.stringify(res))
          resolve(res)
        },
        fail: e => {
          console.log('写入失败', JSON.stringify(e))
          reject(e)
        }
      })
    })
  }
}
