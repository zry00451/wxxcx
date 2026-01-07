// Mypages/login/login.js
Page({
  data: {
    loggedIn: false, // 登录状态
    userInfo: null,  // 用户信息
  },

  // 页面加载时检查登录状态
  onLoad() {
    this.checkLoginStatus(); // 检测 session_key
  },

  // 检查用户登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({
        loggedIn: true,
        userInfo: userInfo,
      });
      console.log("用户已登录");
    } else {
      console.log("用户未登录");
    }
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: "获取用户信息以提供个性化服务",
      success: (res) => {
        console.log("用户信息：", res.userInfo);
        this.setData({
          loggedIn: true,
          userInfo: res.userInfo,
        });

        // 存储用户信息
        wx.setStorageSync("userInfo", res.userInfo);
        this.loginToServer(); // 登录并换取 session_key / token
      },
      fail: (err) => {
        console.log("用户拒绝授权：", err);
      },
    });
  },

  // 通过 wx.login 登录服务器
  loginToServer() {
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log("登录成功，code:", res.code);

          // 发送 code 到服务器，获取 token / session_key
          wx.request({
            url: "https://your-server.com/login", // 服务器地址
            method: "POST",
            data: {
              code: res.code,
            },
            success: (res) => {
              console.log("服务器返回：", res.data);
              if (res.data.token) {
                wx.setStorageSync("token", res.data.token); // 存储 token
              }
            },
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  },

  // 退出登录
  logout() {
    wx.removeStorageSync("userInfo"); // 删除用户信息
    wx.removeStorageSync("token");    // 删除 token
    this.setData({
      loggedIn: false,
      userInfo: null,
    });
    console.log("用户已退出登录");
  },
});
