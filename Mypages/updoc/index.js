Page({
  data: {
    textContent: '',
    imagePath: '',
    content: {}
  },

  onTextInput: function(e) {
    this.setData({
      textContent: e.detail.value
    });
  },

  chooseImage: function() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          imagePath: res.tempFilePaths[0]
        });
      }
    });
  },

  submitContent: function() {
    const { textContent, imagePath } = this.data;
    if (!textContent || !imagePath) {
      wx.showToast({
        title: '请填写文字并选择图片',
        icon: 'none'
      });
      return;
    }

    // 上传图片到云存储
    //const cloudPath = `user-content/${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}.png`;
    wx.cloud.uploadFile({
      cloudPath,
      filePath: imagePath,
      success: (res) => {
        const fileID = res.fileID;
        // 将文字内容和图片的 fileID 存入云数据库
        const db = wx.cloud.database();
        db.collection('contents').add({
          data: {
            text: textContent,
            imageFileID: fileID,
            createTime: db.serverDate()
          },
          success: (res) => {
            const contentId = res._id;
            wx.showToast({
              title: '内容提交成功',
              success: () => {
                // 跳转到分享页面
                wx.navigateTo({
                  //url: `/pages/viewContent/viewContent?contentId=${contentId}`
                });
              }
            });
          },
          fail: (err) => {
            wx.showToast({
              title: '内容提交失败',
              icon: 'none'
            });
          }
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        });
      }
    });
  },
  onLoad: function(options) {
    const contentId = options.contentId;
    if (contentId) {
      this.getContentById(contentId);
    } else {
      wx.showToast({
        title: '无法获取内容',
        icon: 'none'
      });
    }
  },

  getContentById: function(id) {
    const db = wx.cloud.database();
    db.collection('contents').doc(id).get({
      success: (res) => {
        const content = res.data;
        // 获取图片的临时链接
        wx.cloud.getTempFileURL({
          fileList: [content.imageFileID],
          success: (res) => {
            content.imageUrl = res.fileList[0].tempFileURL;
            this.setData({
              content
            });
          },
          fail: (err) => {
            wx.showToast({
              title: '图片加载失败',
              icon: 'none'
            });
          }
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '内容加载失败',
          icon: 'none'
        });
      }
    });
  },

  onShareAppMessage: function() {
    const { _id } = this.data.content;
    return {
      title: '我分享了一个有趣的内容，快来看看吧！',
      //path: `/pages/viewContent/viewContent?contentId=${_id}`
    };
  }
});
