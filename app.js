// app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
    userName: null, // 用户设定的名称
    importedComponents: []
  },

  onLaunch(options) {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: "cloud1-4g0itg39d552ccb5",
        traceUser: true,
      });
    }
    // 检查用户登录状态
     this.checkLocalLogin(options);

    // 处理分享文件导入场景
    if (options.scene === 1044 && options.query && options.query.path) {
      this.handleFileImport(options);
    }

    //this.globalData = {};
  },
  // 检查本地登录信息
   checkLocalLogin(options) {
    try {
      const localUserInfo = wx.getStorageSync("userInfo");
      
      if (localUserInfo && localUserInfo.openid) {
        // 本地有登录信息，直接使用
        console.log('发现本地登录信息，自动登录');
        this.globalData.userInfo = localUserInfo;
        this.globalData.openid = localUserInfo.openid;
        this.globalData.userName = localUserInfo.userName || localUserInfo.nickname;
        this.globalData.isLogin = true; 
        // 后台同步云端数据（不阻塞）
       // this.syncFromCloud(localUserInfo.openid);
        console.log('自动登录成功，用户名:', this.globalData.userName);
      } else {
      
    //  wx.reLaunch({
       // url: '/Mypages/editorH/index?id=0'
     // });
        // 没有 -> 跳转到登录页
        if (options.id&& options.from) {
          // 保存原始页面信息
          wx.setStorageSync('pendingNavigation', options);
        }
        // 本地没有登录信息
        console.log('本地无登录信息');
        this.globalData.isLogin = false;
      }
    } catch (error) {
      console.error('检查本地登录信息失败', error);
      this.globalData.isLogin = false;
    }
  },

  // 从云端同步数据（后台执行）
  async syncFromCloud(openid) {
    try {
      const db = wx.cloud.database();
      const result = await db.collection('users').where({
        openid: openid
      }).get();

      if (result.data && result.data.length > 0) {
        const cloudUserInfo = result.data[0];
        
        if (cloudUserInfo.userName !== this.globalData.userName) {
          // 云端数据更新了，同步到本地
          console.log('云端数据已更新，同步到本地');
          this.globalData.userInfo = cloudUserInfo;
          this.globalData.userName = cloudUserInfo.userName;
          wx.setStorageSync('userInfo', cloudUserInfo);
        }
      }
    } catch (error) {
      console.error('从云端同步数据失败', error);
    }
  },
// 处理文件导入
handleFileImport(options) {
  const filePath = decodeURIComponent(options.query.path);
  const fs = wx.getFileSystemManager();

  fs.readFile({
    filePath,
    encoding: 'utf8',
    success: res => {
      try {
        const data = JSON.parse(res.data);
        this.globalData.importedComponents = data.components || [];
        wx.redirectTo({
          url: '/Mypages/editorH/index?from=import'
        });
      } catch (error) {
        console.error('解析导入文件失败', error);
        wx.showToast({
          title: '文件格式错误',
          icon: 'none'
        });
      }
    },
    fail: err => {
      console.error('读取文件失败', err);
      wx.showToast({
        title: '读取文件失败',
        icon: 'none'
      });
    }
  });
}
});
