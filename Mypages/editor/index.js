Page({
  data: {
    backgroundImage: '',
    uploadedImage: '',
    textContent: '',
    textX: 0,
    textY: 0,
    imageX: 0,
    imageY: 0
  },

  chooseBackground: function() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          backgroundImage: tempFilePath
        });
        this.adjustPagesBasedOnImage(tempFilePath);
      }
    });
  },

  chooseImage: function() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          uploadedImage: res.tempFilePaths[0]
        });
      }
    });
  },

  onTextInput: function(e) {
    this.setData({
      textContent: e.detail.value
    });
  },

  onTextChange: function(e) {
    this.setData({
      textX: e.detail.x,
      textY: e.detail.y
    });
  },

  onImageChange: function(e) {
    this.setData({
      imageX: e.detail.x,
      imageY: e.detail.y
    });
  },

  adjustPagesBasedOnImage: function(imagePath) {
    wx.getImageInfo({
      src: imagePath,
      success: (res) => {
        const imgWidth = res.width;
        const imgHeight = res.height;
        const screenWidth = wx.getSystemInfoSync().windowWidth;
        const screenHeight = wx.getSystemInfoSync().windowHeight;

        const widthRatio = imgWidth / screenWidth;
        const heightRatio = imgHeight / screenHeight;

        let requiredPages = 1;

        if (widthRatio > 1 || heightRatio > 1) {
          requiredPages = Math.ceil(Math.max(widthRatio, heightRatio));
        }

        this.setData({
          totalPages: requiredPages
        });
      }
    });
  }
});
