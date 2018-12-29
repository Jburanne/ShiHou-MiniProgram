// pages/search/search.js
var app = getApp()
var hotCities = ["北京", "上海", "广州", "深圳", "南京", "武汉", "杭州"];

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
    
  },
  choose(e) {
    console.log("点击了")
    var selectedCity=e.currentTarget.dataset.name;
    console.log(selectedCity);
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
    // let name = e.currentTarget.dataset.name
    // let pages = getCurrentPages()
    // let len = pages.length
    // let indexPage = pages[len - 2]
    // if (name) {
    //   indexPage.search(name, () => {
    //     wx.navigateBack({})
    //   })
    // } else {
    //   indexPage.init({}, () => {
    //     wx.navigateBack({})
    //   })
    // }
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