// Mypages/booklist/booklist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //bgUrl: '/images/list-scf.png'
  },
 
  openNotice1: function() {
    wx.navigateTo({
      url: '/Mypages/notice1/notice1'  // 假设你有一个用户须知页面
    });
  },
  openNotice2: function() {
    wx.navigateTo({
      url: '/Mypages/notice2/notice2'  // 假设你有一个用户须知页面
    });
  },
  openLogin: function() {
    wx.navigateTo({
      url: '/Mypages/weiixinlogin/index'  // 假设你有一个用户须知页面
    });
  },
  openhome: function() {
    wx.navigateTo({
      url: '/Mypages/userhome/index'  // 假设你有一个用户须知页面
    });
  },
  openlist: function() {
    wx.navigateTo({
      url: '/Mypages/editorimage/index'  // 假设你有一个用户须知页面
    });
  },
  openlist1(){
    wx.navigateTo({
      url: '/Mypages/list1/index'  // 假设你有一个用户须知页面
      
    });
    console.log("chenggong");
  },

  openPopup(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      showIndex:index
    })
  },
  //关闭弹窗
  closePopup(){
    this.setData({
      showIndex:null
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    var that = this;
    // 动态获取屏幕高度
    wx.getSystemInfo({
      success: (result) => {
        that.setData({
          height: result.windowHeight
        });
      },
    })
  },
})