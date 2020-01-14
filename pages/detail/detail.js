// pages/detail/detail.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listid: null, //列表ID
    videoModal: false, //视频看店 弹窗
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var listid = options.listid;
    console.log(options)
    console.log("id值+++++++++++", listid)
    //店铺详情页
    wx.request({
      url: app.globalData.address + 'shopget',
      method: 'post', //请求方式
      data: {
        id: listid,
      }, //请求参数
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        this.setData({
          addr: res.data.data.addr,
          area: res.data.data.area,
          city: res.data.data.city,
          deposit_way: res.data.data.deposit_way,
          door_width: res.data.data.door_width,
          floor: res.data.data.floor,
          id: res.data.data.id,
          img: res.data.data.img,
          lat: res.data.data.lat,
          lng: res.data.data.lng,
          measure: res.data.data.measure,
          mobile: res.data.data.mobile,
          monthly: res.data.data.monthly,
          name: res.data.data.name,
          pay_type: res.data.data.pay_type,
          province: res.data.data.province,
          recommend: res.data.data.recommend,
          status: res.data.data.status,
          type: res.data.data.type,
          username: res.data.data.username,
          time: res.data.data.time,
          video: res.data.data.video,
          tag: res.data.tag,
          bnrUrl: res.data.bnrUrl,
        });
        console.log("详情页++",res)
      }
    });
  },
  //点击拨打电话
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.mobile,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
 //点击视频看店弹出弹窗
  bindVideo: function () {
    this.setData({
      videoModal: true,
    })
  },
  //隐藏视频看店弹窗
  hideModal: function () {
    this.setData({
      videoModal: false
    });
  },
  regionchange(e) {
    console.log(e.type)
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