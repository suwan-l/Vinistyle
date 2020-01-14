var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopList: [],//店铺选择列表数据

    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,//授权

    //城市选择器
    region: ['江苏省', '南京市', '雨花台区'],

    s_city : '',//当前城市
    searchKeyword :"",//搜索关键词    
    latitude : "",//纬度
    longitude : ""//经度
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    qqmapsdk = new QQMapWX({
      key: '7SBBZ-4IZCU-5O6VR-2BIMQ-5WWRO-BEBZI' //这里自己的key秘钥进行填充
    });
    //查看是否授权用户信息
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              wx.login({
                success: res => {
                  // debugger
                  that.getshoplist();//用户已授权用户信息--> 调用店铺列表方法
                  // 获取到用户的 code 之后：res.code
                  console.log("用户的code:" + res.code);
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });   
  },
  //点击用户信息授权
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //debugger
      that.getshoplist();//点击用户授权用户信息--> 调用店铺列表方法

      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息+++", e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
      
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  // 获取店铺列表信息
  getshoplist: function (res) {
    var that = this;
    wx.request({
      url: app.globalData.address + 'shoplist',
      method: 'post', //请求方式
      data: {
      }, //请求参数
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        var data = res.data.data
        this.setData({
          shopList: data
        });
        console.log("店铺列表接口+++++++",res);
        // console.log("店铺列表信息+++++++",this.data.shopList);
      }   
    });
  },

  //点击店铺列表跳转详情页点击事情
  listDetail: function (e) {
    wx.navigateTo({
      url: "../detail/detail?listid=" + e.currentTarget.dataset.listid
    })
    console.log("列表id值++++", e.currentTarget.dataset.listid)
  },

  // 获取当前地理位置
  getLocal: function () {
    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: this.data.s_city, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: res =>{//成功后的回调
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        this.setData({
          latitude: latitude,
          longitude: longitude
        });
        console.log("经度++" + longitude);
        console.log("纬度++" + latitude);
      },
    });
  },
  
  //省市区选择
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    //店铺城市区域筛选 开始
    var s_city = e.detail.value[1];
    s_city = s_city.substring(0, s_city.length - 1);
    console.log("市s_city" + s_city);
    this.setData({
      region: e.detail.value,
      s_city: s_city
    });

    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: this.data.s_city, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: res => {//成功后的回调
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        this.setData({
          latitude: latitude,
          longitude: longitude
        });
        console.log("经度++" + longitude);
        console.log("纬度++" + latitude);
        
        //列表筛选页面渲染请求
        wx.request({
          url: app.globalData.address + 'shoplist', //请求接口的url
          method: 'post', //请求方式
          data: {
            keyword: this.data.searchKeyword,
            city: this.data.s_city,
            lat: this.data.latitude,
            lng: this.data.longitude,
          },//请求参数
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          success: res => {
            var data = res.data.data;
            this.setData({
              shopList: data
            });
            console.log("筛选结果+++++", res);
          }
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  //输入关键词搜索
  keywords: function (e) {
    var searchKeyword = e.detail.value;
    this.setData({
      searchKeyword: searchKeyword
    });
  },
  //关键词搜索按钮点击事件
  keybtn: function (e) { 
    //调用地址经纬度方法
    this.getLocal();
    //列表筛选页面渲染请求
    wx.request({
      url: app.globalData.address + 'shoplist', //请求接口的url
      method: 'post', //请求方式
      data: {
        keyword: this.data.searchKeyword,
        city: this.data.s_city,
        lat: this.data.latitude,
        lng: this.data.longitude,
      },//请求参数
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: res => {
        var data = res.data.data;
        this.setData({
          shopList: data
        });
        console.log("筛选结果+++++", res);
      }
    });
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