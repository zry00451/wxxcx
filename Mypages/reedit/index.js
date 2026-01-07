// pages/view/view.js
Page({
  data: {
    docId: '',
    document: {
      content: '',
      imageUrl: '',
      backgroundImage: ''
    }
  },

  onLoad(options) {
    // 通过分享链接传入文档ID，查询文档内容
    if (options.docId) {
      this.setData({ docId: options.docId });
      this.loadDocument(options.docId);
    } else {
      wx.showToast({
        title: '未找到文档',
        icon: 'none'
      });
    }
  },

  loadDocument(docId) {
    const db = wx.cloud.database();
    db.collection('documents').doc(docId).get({
      success: (res) => {
        this.setData({ document: res.data });
      },
      fail: (err) => {
        console.error('加载文档失败', err);
      }
    });
  },

  onContentInput(e) {
    let document = this.data.document;
    document.content = e.detail.value;
    this.setData({ document });
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album','camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        let document = this.data.document;
        document.imageUrl = tempFilePath;
        this.setData({ document });
      },
      fail: (err) => {
        console.error('chooseImage failed', err);
      }
    });
  },

  chooseBackground() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album','camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        let document = this.data.document;
        document.backgroundImage = tempFilePath;
        this.setData({ document });
      },
      fail: (err) => {
        console.error('chooseBackground failed', err);
      }
    });
  },

  updateDocument() {
    const { docId, document } = this.data;
    if (!docId) {
      wx.showToast({
        title: '文档ID错误',
        icon: 'none'
      });
      return;
    }
    const db = wx.cloud.database();
    db.collection('documents').doc(docId).update({
      data: {
        content: document.content,
        imageUrl: document.imageUrl,
        backgroundImage: document.backgroundImage,
        lastUpdated: Date.now()
      },
      success: (res) => {
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('更新失败', err);
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '我分享的文档',
      path: '/Mypages/reedit/index?docId=' + this.data.docId,
      imageUrl: this.data.document.imageUrl
    };
  }
});
