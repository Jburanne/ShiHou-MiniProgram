// pages/future/future.js
var app = getApp()
var iconsrc=[];
var day = ['今天', '明天', '后天'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:day,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    that.showPage()
    
    // that.getLocation();
  },

  showPage: function(){
    var that=this
    wx.getStorage({
      key: 'now_city_forecast',
      // 设置daily_forecast
      success: function (res) {
        var daily_forecast = res.data
        // 把dailyforecast中的date形式改为月-日
        daily_forecast.forEach((item) => {
          var temp = item.date
          item.date = temp.substring(temp.length - 5, temp.length)
        })
        that.setData({
          daily_forecast: daily_forecast,
        }),
          // 绘制曲线
          that.drawForecastView(res.data);
        // 设置天气图标
        that.setTypeIcon(res.data);
      },
    })
    // 获取城市
    wx.getStorage({
      key: 'now_city',
      success: function (res) {
        that.setData({
          city: res.data
        })
      },
    })
  },


// 根据天气类型设置天气图标
  setTypeIcon: function(forecast){
    var that=this
    forecast.forEach((item) =>{
      switch(item.cond_txt_d){
        case "多云":
          iconsrc.push("../../images/weather_duoyun.png");
          break;
        case "晴":
          iconsrc.push("../../images/weather_qing.png");
          break;
        case "大暴雪":
          iconsrc.push("../../images/weather_dabaoxue.png");
          break;
        case "大雪":
          iconsrc.push("../../images/weather_daxue.png");
          break;
        case "大雨":
          iconsrc.push("../../images/weather_dayu.png");
          break;
        case "雷阵雨":
          iconsrc.push("../../images/weather_leizhenyu.png");
          break;
        case "雾":
          iconsrc.push("../../images/weather_wu.png");
          break;
        case "小雪":
          iconsrc.push("../../images/weather_xiaoxue.png");
          break;
        case "小雨":
          iconsrc.push("../../images/weather_xiaoyu.png");
          break;
        case "阴":
          iconsrc.push("../../images/weather_yin.png");
          break;
        case "雨夹雪":
          iconsrc.push("../../images/weather_yujiaxue.png");
          break;
        case "阵雪":
          iconsrc.push("../../images/weather_zhenxue.png");
          break;
        case "阵雨":
          iconsrc.push("../../images/weather_zhenyu.png");
          break;
        case "中雪":
          iconsrc.push("../../images/weather_zhongxue.png");
          break;
        case "中雨":
          iconsrc.push("../../images/weather_zhongyu.png");
          break;
        default:
          iconsrc.push("../../images/weather_null.png")
      }
    })
    that.setData({
      type_icon:iconsrc,
    })
  },

  // 绘制温度曲线
  drawForecastView: function(forecast){//参数forecast为数据模型
    const forecastCtx = wx.createCanvasContext('forcastCanvas')
  console.log("forecastWeather", forecast)
  let width = 750
  let height = 130
  let dot = width / 12
  let maxTmp = parseInt(forecast[0].tmp_max) 
    console.log("maxtmp", maxTmp)
  let minTmp = parseInt(forecast[0].tmp_min) 
  forecast.forEach((item) => {
      if (maxTmp < parseInt(item.tmp_max)) {
        maxTmp = parseInt(item.tmp_max)
      }
      if (minTmp > parseInt(item.tmp_min)) {
        minTmp = parseInt(item.tmp_min)
      }
    })
    console.log("maxtmp", maxTmp)
  let average = (minTmp + maxTmp) / 2
 
  let dValue = maxTmp - average
  let gradient = 4;
    while(gradient * dValue > height / 2 - 30){
  gradient = gradient - 0.5
}
console.log('倍数', gradient)
let flag = 1
forecastCtx.beginPath()
//最高温度
forecast.forEach((item) => {
  let x1 = flag * dot;
  let y1 = height / 2 - (parseInt(item.tmp_max) - average) * gradient
  item.maxX = x1
  item.maxY = y1
  //画线
  if (flag == 1) {
    forecastCtx.moveTo(x1, y1)
  } else {
    forecastCtx.lineTo(x1, y1)
  }
  //画圆圈
  forecastCtx.arc(x1, y1, 3, 0, 2 * Math.PI)
  flag = flag + 2
})

//设置最高温度的线条样式
forecastCtx.setStrokeStyle("#e64340")
forecastCtx.setLineWidth(3)
forecastCtx.stroke()
//最低温度
forecastCtx.beginPath()
flag = 1
forecast.forEach((item) => {
  let x2 = flag * dot;
  let y2 = height / 2 + (average - parseInt(item.tmp_min)) * gradient
  item.minX = x2
  item.minY = y2
  //画线
  if (flag == 1) {
    forecastCtx.moveTo(x2, y2)
  } else {
    forecastCtx.lineTo(x2, y2)
  }
  //画圆圈
  forecastCtx.arc(x2, y2, 3, 0, 2 * Math.PI)
  flag = flag + 2
})
//设置最低温度的线条样式
forecastCtx.setStrokeStyle("#7cb5ec")
forecastCtx.setLineWidth(3)
forecastCtx.stroke()
console.log(forecast)
forecastCtx.setFontSize(12)
forecastCtx.setTextAlign('center')
forecastCtx.setFillStyle("#ffffff")
//画文字
for (var i = 0; i < forecast.length; i++) {
  forecastCtx.moveTo(forecast[i].maxX, 20)
  forecastCtx.fillText(" " + forecast[i].tmp_max + "°", forecast[i].maxX, forecast[i].maxY - 10)
  forecastCtx.fillText(" " + forecast[i].tmp_min + "°", forecast[i].minX, forecast[i].minY + 20)
  forecastCtx.setFillStyle("#ffffff")
}

forecastCtx.draw()
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
    var that=this
    that.showPage()
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