//app.js
import { degree } from './utils/config.js'

App({

  globalData: {
    deviceInfo: null,
    // 遮挡率
    shadeDegree: .3,
    // 性能优化
    optimization: false,

    requestHost: 'https://sudoku.52kuaina.cn',
    share: null,
    degree: degree,
  },

  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        this.globalData.deviceInfo = res
      },
    })
    this.globalData.shadeDegree = wx.getStorageSync('shadeDegree') || .3

    this.globalData.optimization = wx.getStorageSync('optimization') || false

  },

  adapterDegree(shadeDegree, returnType = 'title') {
    let setDegree = parseInt(shadeDegree * 100)
    let title, range
    this.globalData.degree.map(item => {
      if (setDegree >= item.range[0] && setDegree <= item.range[1]) {
        title = item.title
        range = item.range
        // 好像并不会跳过剩余的循环
        return
      }
    })
    if (returnType === 'range') {
      return range
    }
    return title
  }

})
