Page({
  data: {
    logs: []
  },
  onLoad() {
    this.fetchLogs();
  },
  fetchLogs() {
    const db = wx.cloud.database();
    db.collection('doc').get().then(res => {
      this.setData({ logs: res.data });
    });
  },
  createLog() {
    wx.navigateTo({ url: '/Mypages/edit/index' });
  },
  editLog(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/Mypages/edit/index?id=${id}` });
  },
  deleteLog(e) {
    const id = e.currentTarget.dataset.id;
    const db = wx.cloud.database();
    db.collection('logs').doc(id).remove().then(() => {
      this.fetchLogs();
    });
  },
  openLog(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/Mypages/reedit/index?id=${id}` });
  }
});
