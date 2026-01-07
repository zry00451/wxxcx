Page({
  data: {
    
    backgroundImage: '',
  
    content:[]
    
  },

  onTextInput: function(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    this.setData({
      [`pages[${index}].text`]: value
    });
  },

  chooseImage: function(e) {
    const index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          [`pages[${index}].image`]: res.tempFilePaths[0]
        });
      }
    });
  },

  chooseBackground: function() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          backgroundImage: tempFilePath
        });
      }
    });
  },
  addText: function() {
    const newText = { type: 'text', text: '请输入文字', top: 50, left: 50 };
    this.setData({
      content: [...this.data.content, newText]
    });
  },

  addImage: function() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const newImage = { type: 'image', src: res.tempFilePaths[0], top: 100, left: 100 };
        this.setData({
          content: [...this.data.content, newImage]
        });
      }
    });
  },

  onTouchStart: function(e) {
    const index = e.currentTarget.dataset.index;
    const startX = e.touches[0].clientX;
    const startY = e.touches[0].clientY;
    this.setData({
      draggingIndex: index,
      startX: startX,
      startY: startY
    });
  },

  onTouchMove: function(e) {
    const { draggingIndex, startX, startY, content } = this.data;
    const moveX = e.touches[0].clientX - startX;
    const moveY = e.touches[0].clientY - startY;
    content[draggingIndex].left += moveX;
    content[draggingIndex].top += moveY;
    this.setData({
      content: content,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    });
  },

  onTouchEnd: function() {
    this.setData({
      draggingIndex: null
    });
  }
  
});
