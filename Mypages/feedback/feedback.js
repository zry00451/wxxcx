Page({
  data: {
    content: '',
    contact: '',
    images: []
  },

  onInput(e) {
    this.setData({ content: e.detail.value })
  },

  onContactInput(e) {
    this.setData({ contact: e.detail.value })
  },

  chooseImage() {
    if (this.data.images.length >= 3) {
      wx.showToast({ title: '最多上传3张', icon: 'none' })
      return
    }

    wx.chooseImage({
      count: 3 - this.data.images.length,
      success: res => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
      }
    })
  },

  async submit() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请填写反馈内容', icon: 'none' })
      return
    }

    wx.showLoading({ title: '提交中...' })

    try {
      const cloudPaths = []

      for (let path of this.data.images) {
        const res = await wx.cloud.uploadFile({
          cloudPath: `feedback/${Date.now()}-${Math.random()}.png`,
          filePath: path
        })
        cloudPaths.push(res.fileID)
      }

      await wx.cloud.database().collection('feedback').add({
        data: {
          content: this.data.content,
          contact: this.data.contact,
          images: cloudPaths,
          createTime: new Date(),
          status: 'new'
        }
      })

      wx.showToast({ title: '提交成功' })
      this.setData({ content: '', contact: '', images: [] })

    } catch (e) {
      wx.showToast({ title: '提交失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  }
})
