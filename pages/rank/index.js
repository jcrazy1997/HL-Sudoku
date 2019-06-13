// pages/record/index.js
import fromNow, { computeTime } from '../../utils/moment.js'
// import { degree } from '../../utils/config.js'
// import { adapterDegree } from '../../utils/config.js'
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    countsAll: 2,
    canvasSize: 355,
    showTip1: false,
    showTip2: false,
    loadingTip: '数据读取中...',
  },

  currentCanvasImg: null,
  currentList: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.globalData.requestHost+'/api/scores',
      success:res=>{
        var items = []
        var responseData = res.data
        console.log(responseData)
        var len = responseData.data.length
        console.log(len)
        for(var i = 0;i<len;i++){
          var rankInfo = responseData.data[i]
          var shadeDegree = parseInt(rankInfo.degree * 100)
          var speedTime = this.convertIntToTime(rankInfo.score_time)
          var item = {
            rank:i+1,
            nickname: rankInfo.nickname,
            degree: shadeDegree,
            avatar_url: rankInfo.avatar_url,
            score_time:speedTime
          }
          items.push(item)
        }
        console.log(items)
        this.setData({
          records: items
        })
      }
    })
    this.setData({
      canvasSize: app.globalData.deviceInfo.screenWidth - 20,
    })

    // 显示当前设定等级的canvas
    let currentDegree = app.globalData.shadeDegree
    //this.renderRecords(currentDegree)
    //this.renderLastRecords()

    // draw canvas
    //this.drawCanvas(currentDegree)

  },

  convertIntToTime(time){
    let m = Math.floor(time / 60)
    let s = time % 60 < 10 ? '0' + time % 60 : time % 60
    return m+':'+s
  },

  currentCanvasToImg(cw, ch) {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: res => {
        this.currentCanvasImg = res.tempFilePath
      },
      fail: () => {
        setTimeout(() => {
          this.currentCanvasToImg()
        }, 50)
      }
    })
  },

  parseShadeDegree(shadeDegree) {
    if (shadeDegree === 0) {
      return 0
    } else {
      // 取个位数字返回
      return shadeDegree % 10 !== 0 ? shadeDegree % 10 : 10
    }
  },

  renderRecords(degree) {
    // console.log('in')
    // records
    let range = app.adapterDegree(degree, 'range')

    wx.getStorage({
      key: 'records',
      success: res => {
        let list = []
        let countsAll = 0
        // console.log(res.data)
        res.data.map(item => {
          let shade = parseInt(item.shadeDegree * 100)
          let selected = (shade >= range[0] && shade <= range[1]) ? true : false
          list.push({
            degree: app.adapterDegree(item.shadeDegree),
            counts: item.counts,
            showTime: item.showTime,
            recordTime: fromNow(item.recordTime),
            selected: selected
          })
          countsAll += item.counts
        })
        this.setData({
          records: list,
          countsAll: countsAll,
          loadingTip: countsAll === 0 ? '请完成一局数独再来看看吧' : '读取成功，数据渲染中...'
        })
      },
      fail: () => {
        this.setData({
          loadingTip: '请完成一局数独再来看看吧'
        })
      }
    })
  },

  showTip(e) {
    let type = e.currentTarget.dataset.type
    if (type === 'tip1') {
      this.setData({
        showTip1: true
      })
    } else if (type === 'tip2') {
      this.setData({
        showTip2: true
      })
    }
  },

  drawItem(e) {
    this.currentCanvasImg = null
    this.currentList = null
    let idx = e.currentTarget.dataset.idx
    // degree值为0，1，2，3，4，5，6，7，8，9
    // 为0的时候避免判断为false, 1的时候为第二级，避免为1成为第一级
    let degree = idx === 0 ? 0.1 : idx * .11
    this.drawCanvas(degree)
    this.renderRecords(degree)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})