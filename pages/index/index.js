//index.js
Page({
  onLoad: function (options) {
    console.log('onload')
    var that=this
    that.showPage()
  },

// 加载页面内容
  showPage: function(){
    var that = this
    wx.getStorage({
      key: 'selectedCity',
      success: function (res) {
        // 如果搜索城市页面传来了值，则依据传来的城市加载信息
        if (res.data != null && res.data != '') {
          that.getWeather(res.data);
          wx.setStorage({
            key: 'now_city',
            data: res.data,
          })
          console.log(res.data)
          that.setData({
            city: res.data,
          })
          wx.setStorage({
            key: 'selectedCity',
            data: '',
          })
        }
        // 若没有传来值则根据定位加载信息
        else {
          that.getLocation();
          wx.setStorage({
            key: 'selectedCity',
            data: '',
          })
        }
      },
    })

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
        that.setData({
          city: city,
        })
        // 保存城市信息，便于未来天气页面获取
        wx.setStorage({
          key: 'now_city',
          data: city,
        })
        that.getWeather(city);
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
        console.log("测试" + res.data.HeWeather6[0].basic.admin_area);
        //设置首页的省份logo
        that.setData({
          iconsrc: "http://192.144.139.121/ShiHou/province_icon/p_" + res.data.HeWeather6[0].basic.admin_area+".png",
        }),
        that.setBg(parseInt(tmp));
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
        //设置天气图标
        that.setTypeIcon(type)
        //设置标语
        that.setWords(type)
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

  // 确定背景图片
  setBg: function(tmp){
    var that=this;
    // 随机产生背景图片标号
    var bgnum=parseInt(4*Math.random()+1)
    console.log(bgnum)
    var bgsrc=""
    // 根据温度范围确定背景图片
    if(tmp >= -20 && tmp < 10){
      bgsrc ="http://192.144.139.121/ShiHou/food_bg/f1/food_bg_"+bgnum+".jpg";
    }else if(tmp >=10 && tmp < 20 ){
      bgsrc = "http://192.144.139.121/ShiHou/food_bg/f2/food_bg_" + bgnum + ".jpg";
    }else if(tmp >= 20 && tmp <= 30){
      bgsrc = "http://192.144.139.121/ShiHou/food_bg/f3/food_bg_" + bgnum + ".jpg";
    }else{
      bgsrc = "http://192.144.139.121/ShiHou/food_bg/food_bg_null.jpg";
    }
    that.setData({
      bgsrc:bgsrc,
    })
    console.log(bgsrc)

  },

  // 根据天气类型设置天气图标
  setTypeIcon: function (type) {
    var that = this
    var iconsrc=""
      switch (type) {
        case "多云":
          iconsrc ="../../images/weather_duoyun.png";
          break;
        case "晴":
          iconsrc ="../../images/weather_qing.png";
          break;
        case "大暴雪":
          iconsrc ="../../images/weather_dabaoxue.png";
          break;
        case "大雪":
          iconsrc ="../../images/weather_daxue.png";
          break;
        case "大雨":
          iconsrc ="../../images/weather_dayu.png";
          break;
        case "雷阵雨":
          iconsrc ="../../images/weather_leizhenyu.png";
          break;
        case "雾":
          iconsrc ="../../images/weather_wu.png";
          break;
        case "小雪":
          iconsrc ="../../images/weather_xiaoxue.png";
          break;
        case "小雨":
          iconsrc ="../../images/weather_xiaoyu.png";
          break;
        case "阴":
          iconsrc ="../../images/weather_yin.png";
          break;
        case "雨夹雪":
          iconsrc ="../../images/weather_yujiaxue.png";
          break;
        case "阵雪":
          iconsrc ="../../images/weather_zhenxue.png";
          break;
        case "阵雨":
          iconsrc ="../../images/weather_zhenyu.png";
          break;
        case "中雪":
          iconsrc ="../../images/weather_zhongxue.png";
          break;
        case "中雨":
          iconsrc ="../../images/weather_zhongyu.png";
          break;
        default:
          iconsrc ="../../images/weather_null.png"
      }
      that.setData({
        typeicon:iconsrc,
      })

  },

// 分享功能
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '食候天气', // 转发后 所显示的title
      path: '/pages/index/index', // 相对的路径
      success: (res) => {    // 成功后要做的事情
        console.log(res.shareTickets[0])
        // console.log

        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
            console.log(that.setData.isShow)
          },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },

  //手动选择地点
  chooseLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var latitude = res.latitude //纬度
        var longitude = res.longitude //经度
        console.log("纬度经度 lat:" + latitude + " lon:" + longitude)
        //调用天气查询
        that.getCity(latitude, longitude);
      }
    })
  },

  //根据天气设置首页标语
  setWords: function(type){
    var that=this
    var words=""
    if(type.indexOf('雨') != -1){
      words="最美的不是下雨天，是曾与你躲过雨的屋檐"
    } else if (type.indexOf('云') != -1){
      words="所有的云都跑到我这里"
    }
    else if(type.indexOf('晴')!=-1){
      words ="载着你仿佛载着阳光"
    }else if(type.indexOf('雪')!=-1){
      words="零下已结晶的誓言不会坏"
    } else if (type.indexOf('阴') != -1) {
      words = "风筝在阴天搁浅，想念还在等待救援"
    }
    that.setData({
      words:words,
    })

  },
})