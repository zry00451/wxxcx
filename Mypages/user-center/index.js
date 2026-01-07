const { envList } = require('../../envList');

// pages/me/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    showTip: false,
    title:"",
    userInfo: null, // 存储用户信息
    content:""
  },

  getOpenId() {
    wx.showLoading({
      title: '',
    });
    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          
          type: 'saveUserInfo',
        },
      })
      .then((resp) => {
        this.setData({
          haveGetOpenId: true,
          openId: resp.result.openid,
        });
        wx.hideLoading();
      })
      .catch((e) => {
        wx.hideLoading();
        const { errCode, errMsg } = e
        if (errMsg.includes('Environment not found')) {
          this.setData({
            showTip: true,
            title: "云开发环境未找到",
            content: "如果已经开通云开发，请检查环境ID与 `miniprogram/app.js` 中的 `env` 参数是否一致。"
          });
          return
        }
        if (errMsg.includes('FunctionName parameter could not be found')) {
          this.setData({
            showTip: true,
            title: "请上传云函数",
            content: "在'cloudfunctions/quickstartFunctions'目录右键，选择【上传并部署-云端安装依赖】，等待云函数上传完成后重试。"
          });
          return
        }
      });
  },

  gotoWxCodePage() {
    wx.navigateTo({
      url: `/pages/exampleDetail/index?envId=${envList?.[0]?.envId}&type=getMiniProgramCode`,
    });
  },
  // 页面加载时检查用户登录状态
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo'); // 读取 Storage
    if (userInfo) {
      this.setData({
        userInfo,
      });
    }
  },

  // 获取用户信息并存储
  getUserProfile() {
    wx.getUserProfile({
      desc: '获取您的昵称、头像等信息',
      success: (res) => {
        console.log('用户信息：', res.userInfo);

        // 将用户信息存储到 Storage
        wx.setStorageSync('userInfo', res.userInfo);

        // 更新页面数据
        this.setData({
          userInfo: res.userInfo,
        });

        // 调用云函数存储用户信息
        this.saveUserInfoToCloud(res.userInfo);
      },
      fail: (err) => {
        console.log('用户拒绝授权：', err);
      },
    });
  },

  // 调用云函数，将用户信息存储到云数据库
  saveUserInfoToCloud(userInfo) {
    wx.cloud
      .callFunction({
        name: 'saveUserInfo',
        data: {
          userInfo,
        },
      })
      .then((res) => {
        console.log('用户信息存储成功：', res);
      })
      .catch((err) => {
        console.error('存储用户信息失败：', err);
      });
  },

  // 退出登录
  logout() {
    wx.removeStorageSync('userInfo'); // 删除存储
    this.setData({
      userInfo: null,
    });
    wx.showToast({
      title: '已退出登录',
      icon: 'success',
    });
  },
});
