// pages/search/search.js
let staticData = require('../../data/staticData.js')
let utils = require('../../utils/utils.js')
var app = getApp()
var hotCities = ["北京市", "上海市", "广州市", "深圳市", "南京市", "武汉市", "杭州市"];

Page({ 
  /**
   * 页面的初始数据
   */
  data: { 
    hotCities:hotCities,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let cities = this.getSortedAreaObj(staticData.cities || [])
    this.setData({
      cities,
      showItems: cities,
    })   
  },
  // 点击某个城市，跳转到主页，显示该城市的天气信息
  choose(e) {
    console.log("点击了")
    var selectedCity=e.currentTarget.dataset.name;
    console.log(selectedCity);
    // 记录点击的城市
    wx.setStorage({
      key: 'selectedCity',
      data: selectedCity,
    })
    wx.switchTab({
      url: '/pages/index/index',
      //跳转后重新加载页面
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      } 
    })
    //搜索框和搜索结果初始化
    this.setData({
      inputText: '',
      showItems: this.data.cities,
    })
  },

  // 按照字母顺序生成需要的数据格式
  getSortedAreaObj(areas) {
    // let areas = staticData.areas
    areas = areas.sort((a, b) => {
      if (a.letter > b.letter) {
        return 1
      }
      if (a.letter < b.letter) {
        return -1
      }
      return 0
    })
    let obj = {}
    for (let i = 0, len = areas.length; i < len; i++) {
      let item = areas[i]
      delete item.districts
      let letter = item.letter
      if (!obj[letter]) {
        obj[letter] = []
      }
      obj[letter].push(item)
    }
    // 返回一个对象，直接用 wx:for 来遍历对象，index 为 key，item 为 value，item 是一个数组
    return obj
  },

// 根据输入内容匹配城市，若城市名中包含输入的信息，则将城市push进showitems
  inputFilter(e) {
    let alternative = {}
    let cities = this.data.cities
    let value = e.detail.value.replace(/\s+/g, '')
    if (value.length) {
      for (let i in cities) {
        let items = cities[i]
        for (let j = 0, len = items.length; j < len; j++) {
          let item = items[j]
          if (item.name.indexOf(value) !== -1) {
            if (utils.isEmptyObject(alternative[i])) {
              alternative[i] = []
            }
            alternative[i].push(item)
          }
        }
      }
      if (utils.isEmptyObject(alternative)) {
        alternative = null
      }
      this.setData({
        alternative,
        showItems: alternative,
      })
    } else {
      this.setData({
        alternative: null,
        showItems: cities,
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})