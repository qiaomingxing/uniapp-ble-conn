<template>
  <app-layout>
    <view class="uni-padding-wrap uni-common-mt">
      <view> 本蓝牙协议只支持低功耗蓝牙协议ble。如果想连接非ble蓝牙设备，请在社区搜索 Native.js 蓝牙。 </view>
      <view class="uni-btn-v">
        <button type="primary" :disabled="disabled[0]" @click="openBluetoothAdapter">初始化蓝牙模块</button>
        <view v-if="!adapterState.available">
          {{ '蓝牙适配器不可用,请初始化蓝牙模块' }}
        </view>
        <button type="primary" :loading="searchLoad" :disabled="disabled[1]" @click="startBluetoothDevicesDiscovery">开始搜索蓝牙设备</button>
        <button type="primary" :disabled="disabled[2]" @click="stopBluetoothDevicesDiscovery(false)">停止搜索蓝牙设备</button>
        <button type="primary" :loading="newDeviceLoad" :disabled="disabled[3]" @click="queryDevices">选择设备</button>
        <view v-if="equipment.length > 0">
          {{ (connected ? '已连接设备' : '已选择设备') + ' : ' + equipment[0].name + ' (' + equipment[0].deviceId + ')' }}
        </view>
        <button type="primary" :disabled="disabled[4]" @click="createBLEConnection">连接蓝牙设备</button>
        <button type="primary" :disabled="disabled[5]" @click="getBLEDeviceServices">选择设备服务</button>
        <view v-if="servicesData.length > 0">已选服务uuid：{{ servicesData[0].uuid }}</view>
        <button type="primary" :disabled="disabled[6]" @click="getBLEDeviceCharacteristics">获取服务的特征值</button>
        <view v-if="characteristicsData.length > 0">
          <view class="uni-list_name">uuid:{{ characteristicsData[0].uuid }}</view>
          <view class="uni-list_item">是否支持 read 操作:{{ characteristicsData[0].properties.read }}</view>
          <view class="uni-list_item">是否支持 write 操作:{{ characteristicsData[0].properties.write }}</view>
          <view class="uni-list_item">是否支持 notify 操作:{{ characteristicsData[0].properties.notify }}</view>
          <view class="uni-list_item">是否支持 indicate 操作:{{ characteristicsData[0].properties.indicate }}</view>
        </view>
        <button type="primary" :disabled="disabled[7]" @click="readBLECharacteristicValue">读取特征值数据</button>
        <view v-if="valueChangeData.serviceId">
          <view class="list-name">特征值最新的值:{{ bufValue(valueChangeData) || '还没有最新值' }}</view>
        </view>
        <button type="primary" :disabled="disabled[8]" @click="writeBLECharacteristicValue">写入特征值数据</button>
        <button type="primary" :disabled="disabled[9]" @click="closeBLEConnection">断开蓝牙设备</button>
        <button type="primary" :disabled="disabled[10]" @click="closeBluetoothAdapter">关闭蓝牙模块</button>
      </view>
    </view>
    <!-- 遮罩 -->
    <view v-if="maskShow" class="uni-mask" @touchmove.stop.prevent="moveHandle" @click="maskclose">
      <scroll-view class="uni-scroll_box" scroll-y @touchmove.stop.prevent="moveHandle" @click.stop="moveHandle">
        <view class="uni-title">已经发现{{ list.length }}{{ showMaskType === 'device' ? '台设备' : '个服务' }}:</view>
        <view class="uni-list-box" v-for="(item, index) in list" :key="index" @click="tapQuery(item)">
          <view v-if="showMaskType === 'device'">
            <view class="uni-list_name">{{ item.name || item.localName }}</view>
            <view class="uni-list_item">信号强度:{{ item.RSSI }}dBm</view>
            <view class="uni-list_item">UUID:{{ item.deviceId }}</view>
            <view class="list-item" v-if="showMaskType === 'device'">Service数量:{{ item.advertisServiceUUIDs.length }}</view>
          </view>
          <view v-if="showMaskType === 'service'">
            <view class="uni-list_item" style="line-height: 2.2">
              UUID: {{ item.uuid }}
              <text v-if="showMaskType === 'service'">
                {{ item.isPrimary ? '（主服务）' : '' }}
              </text>
            </view>
          </view>
          <view v-if="showMaskType === 'characteristics'">
            <view class="uni-list_name">uuid:{{ item.uuid }}</view>
            <view class="uni-list_item">是否支持 read 操作:{{ item.properties.read }}</view>
            <view class="uni-list_item">是否支持 write 操作:{{ item.properties.write }}</view>
            <view class="uni-list_item">是否支持 notify 操作:{{ item.properties.notify }}</view>
            <view class="uni-list_item">是否支持 indicate 操作:{{ item.properties.indicate }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </app-layout>
</template>
<script>
import bleapi from '@/common/ble/api.js'
import commands from '@/common/ble/commands.js'
import ble from '@/common/ble/index.js'

export default {
  data() {
    return {
      title: 'bluetooth',
      disabled: [false, true, true, true, true, true, true, true, true, true, true],
      newDeviceLoad: false,
      searchLoad: false,
      maskShow: false,
      equipment: [],
      adapterState: {
        discovering: false,
        available: false
      },
      connected: false,
      showMaskType: 'device',
      servicesData: [],
      characteristicsData: [],
      valueChangeData: {},
      isStop: true,
      list: []
    }
  },
  onLoad() {
    this.onBLEConnectionStateChange()
  },
  computed: {
    bufValue() {
      return function (v) {
        return v.value
      }
    }
  },
  methods: {
    moveHandle() {},
    /**
     * 关闭遮罩
     */
    maskclose() {
      this.maskShow = false
    },
    /**
     * 选择设备
     */
    queryDevices() {
      // this.newDeviceLoad = true;
      this.showMaskType = 'device'
      this.maskShow = true
    },
    tapQuery(item) {
      if (this.showMaskType === 'device') {
        this.$set(this.disabled, 4, false)
        if (this.equipment.length > 0) {
          this.equipment[0] = item
        } else {
          this.equipment.push(item)
        }
        this.newDeviceLoad = false
      }
      if (this.showMaskType === 'service') {
        this.$set(this.disabled, 6, false)
        if (this.servicesData.length > 0) {
          this.servicesData[0] = item
        } else {
          this.servicesData.push(item)
        }
      }
      if (this.showMaskType === 'characteristics') {
        this.$set(this.disabled, 7, false)
        this.$set(this.disabled, 8, false)
        if (this.characteristicsData.length > 0) {
          this.characteristicsData[0] = item
        } else {
          this.characteristicsData.push(item)
        }
      }
      this.maskShow = false
    },
    /**
     * 初始化蓝牙设备
     */
    openBluetoothAdapter() {
      bleapi
        .openBluetoothAdapter()
        .then(res => {
          this.isStop = false
          this.$set(this.disabled, 0, true)
          this.$set(this.disabled, 1, false)
          this.$set(this.disabled, 10, false)
          this.getBluetoothAdapterState()
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode, e.errMsg)
          }
        })
    },
    /**
     * 开始搜索蓝牙设备
     */
    startBluetoothDevicesDiscovery() {
      bleapi
        .startBluetoothDevicesDiscovery()
        .then(res => {
          this.searchLoad = true
          this.$set(this.disabled, 1, true)
          this.$set(this.disabled, 2, false)
          this.$set(this.disabled, 3, false)
          this.onBluetoothDeviceFound()
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 停止搜索蓝牙设备
     */
    stopBluetoothDevicesDiscovery(types) {
      bleapi
        .stopBluetoothDevicesDiscovery()
        .then(res => {
          if (types) {
            this.$set(this.disabled, 1, true)
          } else {
            this.$set(this.disabled, 1, false)
          }
          this.$set(this.disabled, 2, true)
          // this.$set(this.disabled, 3, true);
          this.searchLoad = false
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 发现外围设备
     */
    onBluetoothDeviceFound() {
      uni.onBluetoothDeviceFound(res => {
        // this.$set(this.disabled, 3, false);
        console.log('发现外围设备成功', JSON.stringify(res))
        this.getBluetoothDevices()
      })
    },
    /**
     * 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
     */
    getBluetoothDevices() {
      console.log('getBluetoothDevices')
      bleapi
        .getBluetoothDevices()
        .then(res => {
          this.newDeviceLoad = false
          this.list = res
        })
        .chatch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 获取本机蓝牙适配器状态
     */
    getBluetoothAdapterState() {
      bleapi
        .getBluetoothAdapterState()
        .then(res => {
          this.adapterState = res
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 连接低功耗蓝牙
     */
    createBLEConnection() {
      let deviceId = this.equipment[0].deviceId
      uni.showToast({
        title: '连接蓝牙...',
        icon: 'loading',
        duration: 99999
      })
      bleapi
        .createBLEConnection({ deviceId })
        .then(res => {
          // 连接设备后断开搜索 并且不能搜索设备
          this.stopBluetoothDevicesDiscovery(true)
          uni.hideToast()
          uni.showToast({
            title: '连接成功',
            icon: 'success',
            duration: 2000
          })
          this.$set(this.disabled, 3, true)
          this.$set(this.disabled, 4, true)
          this.$set(this.disabled, 5, false)
          this.$set(this.disabled, 9, false)
          this.connected = true
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 断开与低功耗蓝牙设备的连接
     */
    closeBLEConnection() {
      let deviceId = this.equipment[0].deviceId
      bleapi
        .closeBLEConnection({ deviceId })
        .then(res => {
          this.$set(this.disabled, 1, false)
          this.$set(this.disabled, 3, true)
          this.$set(this.disabled, 4, true)
          this.$set(this.disabled, 5, true)
          this.$set(this.disabled, 6, true)
          this.$set(this.disabled, 7, true)
          this.$set(this.disabled, 8, true)
          this.$set(this.disabled, 9, true)
          this.equipment = []
          this.servicesData = []
          this.characteristicsData = []
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 获取所有服务
     */
    getBLEDeviceServices() {
      let deviceId = this.equipment[0].deviceId
      bleapi
        .getBLEDeviceServices({ deviceId })
        .then(res => {
          this.$set(this.disabled, 7, true)
          this.$set(this.disabled, 8, true)
          this.showMaskType = 'service'
          this.list = res.services
          this.characteristicsData = []
          if (this.list.length <= 0) {
            toast('获取服务失败，请重试!')
            return
          }
          this.maskShow = true
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 获取某个服务下的所有特征值
     */
    getBLEDeviceCharacteristics() {
      let deviceId = this.equipment[0].deviceId
      let serviceId = this.servicesData[0].uuid
      console.log(deviceId)
      console.log(serviceId)

      bleapi
        .getBLEDeviceCharacteristics({ deviceId, serviceId })
        .then(res => {
          this.$set(this.disabled, 7, true)
          this.valueChangeData = {}
          this.showMaskType = 'characteristics'
          this.list = res.characteristics
          if (this.list.length <= 0) {
            toast('获取特征值失败，请重试!')
            return
          }
          this.maskShow = true
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
     */
    onBLEConnectionStateChange() {
      uni.onBLEConnectionStateChange(res => {
        console.log('监听蓝牙连接状态', JSON.stringify(res))
        if (!res.connected) {
          if (this.isStop) return
          console.log('断开低功耗蓝牙成功:')
          this.$set(this.disabled, 1, false)
          this.$set(this.disabled, 3, true)
          this.$set(this.disabled, 4, true)
          this.$set(this.disabled, 5, true)
          this.$set(this.disabled, 6, true)
          this.$set(this.disabled, 7, true)
          this.$set(this.disabled, 8, true)
          this.$set(this.disabled, 9, true)
          this.searchLoad = false
          this.equipment = []
          this.servicesData = []
          this.characteristicsData = []
          this.valueChangeData = {}
          toast('已经断开当前蓝牙连接')
        }
      })
    },
    /**
     * 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用
     */
    readBLECharacteristicValue() {
      let deviceId = this.equipment[0].deviceId
      let serviceId = this.servicesData[0].uuid
      let characteristicId = this.characteristicsData[0].uuid
      this.onBLECharacteristicValueChange()
      bleapi
        .readBLECharacteristicValue({ deviceId, serviceId, characteristicId })
        .then(res => {
          this.notifyBLECharacteristicValueChange()
        })
        .catch(e => {
          if (e.errCode !== 0) {
            initTypes(e.errCode)
          }
        })
    },
    /**
     * 写入控制命令
     * writeCode 写入的控制命令
     */
    writeBLECharacteristicValue() {
      const deviceId = this.equipment[0].deviceId
      const serviceId = this.servicesData[0].uuid
      const characteristicId = this.characteristicsData[0].uuid
      const array = Array.from(commands.GET_UNIT_NAME)
      const buffer = new Uint8Array(array).buffer
      this.onBLECharacteristicValueChange()
      bleapi.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, buffer }).then(res => {})
    },
    /**
     * 监听低功耗蓝牙设备的特征值变化事件。
     */
    onBLECharacteristicValueChange() {
      uni.onBLECharacteristicValueChange(res => {
        console.log('监听蓝牙设备特征值变化', JSON.stringify(res))
        console.log(bleapi.ab2hex(res.value))
        this.valueChangeData = res
      })
    },
    /**
     * 订阅操作成功后需要设备主动更新特征值的 value，才会触发 uni.onBLECharacteristicValueChange 回调。
     */
    notifyBLECharacteristicValueChange() {
      let deviceId = this.equipment[0].deviceId
      let serviceId = this.servicesData[0].uuid
      let characteristicId = this.characteristicsData[0].uuid
      let notify = this.characteristicsData[0].properties.notify
      bleapi.notifyBLECharacteristicValueChange(deviceId, serviceId, characteristicId, notify).then(res => {})
    },
    /**
     * 	断开蓝牙模块
     */
    closeBluetoothAdapter(OBJECT) {
      bleapi.closeBluetoothAdapter().then(res => {
        this.isStop = true
        this.$set(this.disabled, 0, false)
        this.$set(this.disabled, 1, true)
        this.$set(this.disabled, 2, true)
        this.$set(this.disabled, 3, true)
        this.$set(this.disabled, 4, true)
        this.$set(this.disabled, 5, true)
        this.$set(this.disabled, 6, true)
        this.$set(this.disabled, 7, true)
        this.$set(this.disabled, 8, true)
        this.$set(this.disabled, 9, true)
        this.$set(this.disabled, 10, true)
        this.equipment = []
        this.servicesData = []
        this.characteristicsData = []
        this.valueChangeData = {}
        this.adapterState = []
        this.searchLoad = false
        toast('断开蓝牙模块')
      })
    }
  }
}

/**
 * 判断初始化蓝牙状态
 */
function initTypes(code, errMsg) {
  switch (code) {
    case 10000:
      toast('未初始化蓝牙适配器')
      break
    case 10001:
      toast('未检测到蓝牙，请打开蓝牙重试！')
      break
    case 10002:
      toast('没有找到指定设备')
      break
    case 10003:
      toast('连接失败')
      break
    case 10004:
      toast('没有找到指定服务')
      break
    case 10005:
      toast('没有找到指定特征值')
      break
    case 10006:
      toast('当前连接已断开')
      break
    case 10007:
      toast('当前特征值不支持此操作')
      break
    case 10008:
      toast('其余所有系统上报的异常')
      break
    case 10009:
      toast('Android 系统特有，系统版本低于 4.3 不支持 BLE')
      break
    default:
      toast(errMsg)
  }
}

/**
 * 弹出框封装
 */
function toast(content, showCancel = false) {
  uni.showModal({
    title: '提示',
    content,
    showCancel
  })
}
</script>

<style>
page {
  background: #fff;
  padding: 0 20rpx;
  margin: 20rpx 0;
  box-sizing: border-box;
}

button {
  margin-top: 30rpx;
}

.uni-title {
  text-align: center;
}

.uni-mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  padding: 0 30rpx;
  box-sizing: border-box;
}

.uni-scroll_box {
  height: 70%;
  background: #fff;
  border-radius: 20rpx;
}

.uni-list-box {
  margin: 0 20rpx;
  padding: 15rpx 0;
  border-bottom: 1px #f5f5f5 solid;
  box-sizing: border-box;
}

.uni-list:last-child {
  border: none;
}

.uni-list_name {
  font-size: 30rpx;
  color: #333;
}

.uni-list_item {
  font-size: 24rpx;
  color: #555;
  line-height: 1.5;
}

.uni-success_box {
  position: absolute;
  left: 0;
  bottom: 0;
  min-height: 100rpx;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  border-top: 1px #eee solid;
}

.uni-success_sub {
  /* width: 100%%; */
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
}

.uni-close_button {
  padding: 0 20rpx;
  height: 60rpx;
  line-height: 60rpx;
  background: #ce3c39;
  color: #ffffff;
  border-radius: 10rpx;
}

.uni-success_content {
  height: 600rpx;
  margin: 30rpx;
  margin-top: 0;
  border: 1px #eee solid;
  padding: 30rpx;
}

.uni-content_list {
  padding-bottom: 10rpx;
  border-bottom: 1px #f5f5f5 solid;
}

.uni-tips {
  text-align: center;
  font-size: 24rpx;
  color: #666;
}
</style>
