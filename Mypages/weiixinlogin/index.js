// Mypages/weiixinlogin/index.js
// pages/show/show.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app=getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,//头像临时路径，默认是defaultAvatarUrl的灰色头像
  },
  
  /**
   * 获取头像的临时路径   */
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail //e.detail是从前端传过来的所选头像的临时路径
    this.setData({         
      avatarUrl,        //将所选头像临时路径赋值给avatarUrl
    })
  },
 
   /**
    *获取文本框所输入的昵称信息*/
  inputValue(e){
    console.log(e)
    this.setData({
      inputNickname:e.detail.value
    })
  },
   /**
    *授权登录，将API调整后返回的nickName和avatarUrl改成我们自定义选择的头像和昵称*/
  submit(e){
    var that=this
    wx.getUserProfile({ //获取登录授权的API
      desc: '获取用户必要信息',
      success(res){
        app.globalData.userInfo=res.userInfo //将API返回的信息赋值给全局变量userInfo
        app.globalData.userInfo.nickName=that.data.inputNickname //更改全局变量中的userinfo中的昵称
        app.globalData.userInfo.avatarUrl=that.data.avatarUrl //更改头像临时路径
        console.log(app.globalData.userInfo)
        wx.setStorageSync('userInfo', res.userInfo) //将信息本地储存，方便下次不用再次授权登录
        wx.showToast({
          title: '授权成功!',
          success(){
            wx.navigateTo({
              url: '/pages/info/info',//登录成功返回到主页
            })
          }
        })
      }
    })
  }
})