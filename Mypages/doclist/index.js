Page({
  data: {
    boards: [], // 存储白板列表
    currentBoard: null, // 当前编辑的白板
    showPopup: false, // 控制分享弹出框的显示
  },

  onLoad() {
    this.loadBoards();
  },

  // 加载白板列表
  loadBoards() {
    // 模拟从数据库加载数据
    const boards = wx.getStorageSync('boards') || [];
    this.setData({ boards });
  },

  // 创建新白板
  createNewBoard() {
    const newBoard = { id: Date.now(), text: '', imagePath: '' };
    this.setData({ currentBoard: newBoard });
  },

  // 打开已有白板进行编辑
  openBoard(e) {
    const { id } = e.currentTarget.dataset;
    const board = this.data.boards.find(b => b.id === id);
    this.setData({ currentBoard: board });
  },

  // 处理文字输入
  onTextInput(e) {
    const text = e.detail.value;
    this.setData({ 'currentBoard.text': text });
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const imagePath = res.tempFilePaths[0];
        this.setData({ 'currentBoard.imagePath': imagePath });
      },
    });
  },

  // 保存白板
  saveBoard() {
    let boards = this.data.boards;
    const index = boards.findIndex(b => b.id === this.data.currentBoard.id);

    if (index > -1) {
      boards[index] = this.data.currentBoard;
    } else {
      boards.push(this.data.currentBoard);
    }

    wx.setStorageSync('boards', boards);
    this.setData({ boards, currentBoard: null });
    wx.showToast({ title: '保存成功' });
  },

  // 显示分享弹出框
  shareBoard() {
    this.setData({ showPopup: true });
  },

  // 关闭分享弹出框
  closePopup() {
    this.setData({ showPopup: false });
  },

  // 确认分享
  confirmShare() {
    this.closePopup();
    wx.showToast({ title: '分享成功' });
    // 在此添加实际的分享逻辑，例如生成分享链接等
  },
});
