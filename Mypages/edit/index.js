// pages/edit/edit.js
Page({
  data: {
    content: '',         // 用户输入的文本内容
    imageUrl: '',        // 上传的图片 URL
    backgroundImage: '', // 上传的背景图 URL
    docId: ''            // 编辑后的文档ID（用于后续分享）
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  // 上传图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 直接使用临时文件路径或上传到云存储后再获取 URL
        this.setData({ imageUrl: res.tempFilePaths[0] });
      },
      fail: (err) => {
        console.error('chooseImage failed', err);
      }
    });
  },

  // 上传背景图
  chooseBackground() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ backgroundImage: res.tempFilePaths[0] });
      },
      fail: (err) => {
        console.error('chooseBackground failed', err);
      }
    });
  },

  // 保存文档到云数据库
  saveDocument() {
    const { content, imageUrl, backgroundImage } = this.data;
    if (!content && !imageUrl) {
      wx.showToast({
        title: '文档内容不能为空',
        icon: 'none'
      });
      return;
    }
    const db = wx.cloud.database();
    db.collection('documents').add({
      data: {
        content,
        imageUrl,
        backgroundImage,
        lastUpdated: Date.now(),
        // 保存创建者的openid
        author: wx.getStorageSync('openid') || '' // 假设openid已存储
      },
      success: (res) => {
        // res._id 为文档ID
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
        this.setData({ docId: res._id });
      },
      fail: (err) => {
        console.error('保存失败', err);
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 其他函数，例如分享处理在 onShareAppMessage 中设置
  onShareAppMessage() {
    const { docId } = this.data;
    return {
      title: '我分享的文档内容',
      path: '/Mypages/reedit/index?docId=' + docId,
      imageUrl: this.data.imageUrl // 可选分享封面
    };
  }
});
