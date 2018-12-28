//index.js
Page({
  onLoad: function () {
    console.log('onload')
    var that = this
    that.getLocation();
  },

  //获取经纬度方法
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        var latitude = res.latitude
        var longtitude = res.longitude
        console.log('lat:' + latitude + " lon:" + longtitude);
        that.getCity(latitude, longtitude);
      },
    })
  },

  //获取城市
  getCity: function (latitude, longtitude) {
    var that = this
    var url = "https://api.map.baidu.com/geocoder/v2/";
    var params = {
      ak: "cqLXq2x5I0UZI0LXH13TpAefG45BkECr",
      output: "json",
      location: latitude + "," + longtitude
    }
    wx.request({
      url: url,
      data: params,
      success: function (res) {
        var city = res.data.result.addressComponent.city;
        var cityName = city.substring(0, city.length - 1);
        that.setData({
          city: cityName,
        })
        // 保存城市信息，便于未来天气页面获取
        wx.setStorage({
          key: 'now_city',
          data: cityName,
        })
        that.getWeather(cityName);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //获取天气信息
  getWeather: function (city) {
    var that = this
    var url = "https://free-api.heweather.com/s6/weather"
    var url2 = "https://free-api.heweather.com/s6/air"
    var params = {
      location: city,
      key: "8c2c415db78b449982d6194f6b898a79"
    }
    wx.request({
      url: url,
      data: params,
      success: function (res) {
        var tmp = res.data.HeWeather6[0].now.tmp;//温度
        //console.log(temp)
        var type = res.data.HeWeather6[0].now.cond_txt;//天气类型
        var code = res.data.HeWeather6[0].now.cond_code;
        var wind = res.data.HeWeather6[0].now.wind_sc;//风力等级
        var humidity = res.data.HeWeather6[0].now.hum;//湿度
        var daily_forecast = res.data.HeWeather6[0].daily_forecast;//天气预测
        // 保存未来天气信息，便于未来天气页面获取
        wx.setStorage({
          key: 'now_city_forecast',
          data: daily_forecast,
        })
        that.setData({
          tmp: tmp,
          type: type,
          wind: wind,
          humidity: humidity,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.request({
      url: url2,
      data: params,
      success: function (res) {
        var quality = res.data.HeWeather6[0].air_now_city.qlty;
        var pm = res.data.HeWeather6[0].air_now_city.aqi;
        that.setData({
          quality: quality,
          pm:pm,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  onPullDownRefresh() {
    this.getLocation(() => {   
      wx.stopPullDownRefresh()
    })
  },
})