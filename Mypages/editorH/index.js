let longPressTimer = null;
let lastTapTime = 0;
Page({
  data: {
    id:'',
    imagePath: '', // 背景图路径
    backgroundFileID: "",   // 上传后背景图的 fileID
    openid: '',
    screenW: 0,
    screengh: 0,
    screenH:0,
    displayW: 0,
    displayH: 0,
    offsetX: 0,
    startX: 0,
    overlays: [], // 覆盖元素列表
    selectedOverlayIdx: null,
    showContextMenu: false, // 是否显示操作菜单
    isLandscape: false, // 是否为横屏模式
    originalDisplayW: 0, // 原始宽度
    originalDisplayH: 0, // 原始高度
    previewImagePath: '', // 预览图片路径
    previewDisplayW:0,
    previewDisplayH:0,
    previewOffsetX:0,
    isGeneratingPreview: false, // 是否正在生成预览图
    contextMenuPosition: { x: 0, y: 0 }, // 操作菜单的位置
    draggingIdx: null,
    editingIdx: null,
    editorH:0,
    editorW:0,
    lastTouch: { x: 0, y: 0 },
    selectedComponentIndex: null,  // 当前已选择的组件索引
    connections: [] ,       // 存储连接线：[{from: idx1, to: idx2}]
    selectedForConnection: null, // 暂存第一个选中的组件 index
    // 自动滚动相关
    isAutoScrolling: false,
    autoScrollTimer: null,
    autoScrollSpeed: 2,
    edgeThreshold: 50, // 边缘检测阈值（像素）
    scrollDirection: null,
    fadeAnimation: null,
    showHint: false,
    showLoginBtn: false,
    isLogin:false,
    userInfo: null,
    showPicker: false,
    emojiList: [],
    egList:[],
    selectedemoji:null,
    tabs: [{ name: '全部' }, { name: '最近' }],
    activeTab: 0,
    linkingSourceId: '',   
    compositionslist1:[],  
    title:'',
    creater:'',
    showDropdown: false,
    shshowDropup: false,
    showNicknameModal: false,
    tempNickname:'',
    // 点击检测相关
    tapStartTime: 0,
    tapCount: 0,
    tapTimer: null,
    longPressTimer: null,
    isDragging: false,
    isLongPress: false,
    // 连线模式相关
    isConnectingMode: false,
    isDeleteConnectionMode: false, // 是否处于删除连线模式
    highlightedConnectionIndex:null,
    firstSelectedForConnect: null,
    firstSelectedPosition: null, // 第一个选中的连接点位置
    deleteButtonPositions: [], // 存储按钮位置
    isFromShare: false,

    //isColorSelected:false,
    // 文字编辑相关
    textInput: '', // 当前编辑的文字内容
    textInputLength: 0, // 文字长度
    maxTextLength: 200, // 最大字数限制
    showIndex: '-1',
    connectSquares: [],
    nickname:'',

    showPreview: false,           // 是否显示预览
  previewImagePath: '',         // 预览图片路径
  isLandscapePreview: false,    // 是否横屏预览
  previewDisplayW: 0,           // 预览显示宽度
  previewDisplayH: 0,           // 预览显示高度
  previewOffsetX: 0,            // 预览水平偏移
  previewOffsetY: 0 ,            // 预览垂直偏移
  isResizing: false,
  resizingIdx: null,
  resizeStartX: 0,
  resizeStartY: 0,
  resizeStartWidth: 0,
  resizeStartHeight: 0,
  showBackgroundSelector: false,
  selectedBackgroundId: null,
  bgList: [],
  userName: '',
    loading: false,
    selectedColorConnectionIndex: null, // 当前选中要改颜色的连线
    hideCanvas:false,
    canvasInitializing: false,  // ✅ 添加初始化状态标记
    canvasReady: false  ,        // ✅ Canvas 就绪标记
    canvasContext: null,
     // ✅ 保存初始化 Promise
  canvasNode: null,
  // 可选颜色列表
  connectionColors: [
    '#1890ff', // 蓝色
    '#52c41a', // 绿色
    '#faad14', // 橙色
    '#ff4d4f', // 红色
    '#722ed1', // 紫色
    '#13c2c2', // 青色
    '#eb2f96', // 粉色
    '#fa8c16', // 金色
    '#a0d911', // 黄绿
    '#2f54eb', // 深蓝
    '#000000', // 黑色
    '#8c8c8c'  // 灰色
  ],
  showmenu:true,
  showMask1: false,
  showMask2: false,
  showMask3: false,
  showmaskstart:false,
  guideStep: 0, // 0=无引导，1/2/3 对应遮罩
  currentStep: 0,
  isPaused: false,
  guideTimer: null,
  showloginpanel:false,
  agreed: false,
  showbuttonnotice:false,
  egallow:true,
  notcancel:true,

  },

  onLoad(options) {
 
    // 从 URL 参数或缓存中获取 hasRetried 状态
    const hasRetried = options.retry === '1' || wx.getStorageSync('hasRetried');
    this.setData({ hasRetried });
    const systemInfo = wx.getSystemInfoSync();
    this.screenH=systemInfo.windowHeight;
    this.screenW = systemInfo.windowWidth;   
    this.setData({
      originalDisplayW: systemInfo.windowWidth,
      originalDisplayH: systemInfo.windowHeight,

      screenW: systemInfo.windowWidth,
      screengh:systemInfo.windowHeight,
      screenH:systemInfo.windowHeight,
      displayH: systemInfo.windowHeight,
      displayW: systemInfo.windowWidth
    });
    this.reloadfiles()
   console.log(options);
   if (options.from === 'share') {
     //this.shareload();
    this.setData({ isFromShare: true });
  }
  let egallow=wx.getStorageSync('egallow');
  if (egallow === false) {
 this.setData({ egallow: false});
 } else {
   this.setData({ egallow:true });
    wx.setStorageSync('egallow', true)
  }
  let notcancel=wx.getStorageSync('notcancel');
  if (notcancel === false) {
 this.setData({notcancel: false});
 } else {
   this.setData({ notcancel:true });
    wx.setStorageSync('notcancel', true)
  }
const userInfo = wx.getStorageSync('userInfo');
    
if (!userInfo || !userInfo.openid) {
 this.setData({
      isLogin: false
    });
 
} else {
  this.setData({
    isLogin: true,
    userName: userInfo.userName || userInfo.nickname
  });
  this.setData({ userInfo, showLoginBtn: false,
  nickname:userInfo.nickname });
  console.log(userInfo);
}
   const { id} = options;
    this.setData({
      id:id,
    });
    console.log(this.data.id);
    if(id==0){
    this.egload1();
      //this.toggleOrientation();
    }
   else{
     this.loadEditorData(id);
     
   };

 
    wx.showShareMenu({
      withShareTicket: true
    });

    this.loademoji();
    this.shareload();
    this.loadbg();
 //this.egload2();
    
  },

 

  onShow() {
    // 页面显示时重新绘制连接线
    if (this.data.connections.length > 0) {
      setTimeout(() => {
        this.drawConnections();
      }, 100);
    }
  },
  shareload(){
    
    const localData = wx.getStorageSync('compositions') || [];
    console.log(localData);
    this.setData({ compositionslist1: localData });
    const existing = this.data.compositionslist1.find(item => String(item.id) === String(this.data.id));
    console.log(this.data.id);
   console.log(existing);
    if (existing) {
     
      return; // 终止后续逻辑
    }else{
    const newItem = {
      id:this.data.id,
      creator:this.data.nickName,
      title:this.data.nickName+"许愿墙",
      createdAt: Date.now(),
      updatedAt:  Date.now()

    };
    const updated = [...this.data.compositionslist1, newItem];
    this.setData({ compositionslist1: updated });
    wx.setStorageSync('compositions', updated);}
  },
  loademoji(){
    const fs = wx.getFileSystemManager();
    const baseDir = '/images/';
    const emojiListPush = [];

    for (let i = 1; i <= 20; i++) {
      //const filePath = `${baseDir}gaw${i}.png`;
      // 检查文件是否存在
      const filePath =`${wx.env.USER_DATA_PATH}/gaw${i}.png`;
      try {
        fs.accessSync(filePath);
        emojiListPush.push({ src: `${wx.env.USER_DATA_PATH}/gaw${i}.png`});
      } catch (err) {
        console.warn(`未找到图片：${filePath}`);
      }
      
    }
    const newemoji= wx.getStorageSync('localEmojis') || [];
    emojiListPush.push(...newemoji); 
    this.setData({ emojiList: emojiListPush });
    console.log('emojiList:', emojiListPush);
  },
  loadplayeg(){
    const fs = wx.getFileSystemManager();
    const baseDir = '/images/';
    const egListPush = [];

    for (let i = 1; i <= 2; i++) {
      //const filePath = `${baseDir}gaw${i}.png`;
      // 检查文件是否存在
      const filePath =`${wx.env.USER_DATA_PATH}/playeg${i}.jpg`;
      try {
        fs.accessSync(filePath);
        egListPush.push({ src: `${wx.env.USER_DATA_PATH}/palyeg${i}.jpg`});
      } catch (err) {
        console.warn(`未找到图片：${filePath}`);
      }
      
    }
    const neweg= wx.getStorageSync('localplayegs') || [];
    egListPush.push(...neweg); 
    this.setData({ egList: egListPush });
    console.log('egList:', egListPush);
  },
  loadbg(){
    const fs = wx.getFileSystemManager();
    const baseDir = '/images/';
    const bgListPush = [];

    for (let i = 4; i <= 9; i++) {
      //const filePath = `${baseDir}gaw${i}.png`;
      // 检查文件是否存在
      const filePath =`${wx.env.USER_DATA_PATH}/bg${i}.jpg`;
      try {
        fs.accessSync(filePath);
        bgListPush.push({ src: `${wx.env.USER_DATA_PATH}/bg${i}.jpg`});
      } catch (err) {
        console.warn(`未找到图片：${filePath}`);
      }
      
    }
    const newbg= wx.getStorageSync('localbgs') || [];
    bgListPush.push(...newbg); 
    this.setData({ bgList: bgListPush });
    console.log('bgList:', bgListPush);
  },
  toggleDropdown() {
    this.setData({ showDropdown: !this.data.showDropdown });
  },
  toggleDropup() {
    this.setData({ showDropup: !this.data.showDropup });
  },
  deleteItem() {
    const id = this.data.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个项目吗？',
      confirmText: '删除',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 用户点击确认删除
          const localList = wx.getStorageSync("compositions") || [];
          const compositions = localList.filter(c => c.id !== id);
  
          wx.setStorageSync('compositions', compositions);
  
          if (id === "0") {
            wx.setStorageSync("allowExample", false);
            console.log("例子删除，已永久关闭开关");
          }
  
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        } else if (res.cancel) {
          // 用户点击取消，不做操作
          console.log('用户取消删除');
        }
      },
      fail: (err) => {
        console.error('弹窗调用失败', err);
      }
    });
  },
  egload1(){
  
   if(this.data.isLogin){
    if(!this.data.egallow){
      return
   }
     this.setData({showbuttonnotice:true})
   }
    this.setData({showmenu:false});
    const path =`/images/playeg1-1.jpg`;
    //const path ="/images/playeg1.jpg";
    console.log(path);
 
    console.log(this.data.isLandscape);
     // ✅ 先检查文件是否存在
     wx.getFileInfo({
      filePath: path,
      success: (res) => {
        console.log('✅ 文件存在,大小:', res.size);
        // 文件存在,继续加载
        this.loadImageAndScroll(path);
      },
      fail: (err) => {
        console.error('❌ 文件不存在:', err);
        // ✅ 文件不存在,尝试重新生成或重载页面
        //this.handleMissingResource(path);
      }
    });
    
  },
  loadImageAndScroll(path){
    wx.getImageInfo({
      src: path,
      success: imgInfo => {
        const sysInfo = wx.getSystemInfoSync();
        const screenH = sysInfo.windowHeight;
        const screenW = sysInfo.windowWidth;

          const scale = screenH / imgInfo.height;
          const displayW = imgInfo.width * scale;
          const displayH = screenH;
          let offsetX = screenW - displayW;
          
          if (screenW > displayW) {
            offsetX = (screenW - displayW) / 2;
          }
          // ✅ 关键修复:在 setData 的回调中启动滚动
      this.setData({
        displayW,
        displayH,
        offsetX,
        imagePath: path,
        screenW  // 也保存 screenW 到 data 中
      }, () => {
        
        // 确保数据已经更新完成
        console.log('加载完成数据更新完成:', {
          displayW: this.data.displayW,
          offsetX: this.data.offsetX,
          screenW: this.data.screenW
        });
        
        // 现在启动滚动
        this.startAutoScroll('left', () => {
          console.log('🎉 滚动完成!');
          this.setData({ showmenu: true });
          this.showMasksInOrder();
        });
      });
    },
    fail: err => {
      console.error('加载图片失败:', err);
      this.setData({ isLoading: false });  // ✅ 失败也要取消加载状态
    }
  });
  },
egload2(){
  if(!this.data.egallow){
     return
  }
  if(this.data.isLogin){
    console.log("islogin?");
    this.setData({showbuttonnotice:true})
  }
  this.setData({showmenu:false});
  const path =`${wx.env.USER_DATA_PATH}/playeg2.jpg`;
  console.log(path);

  console.log(this.data.isLandscape);
  wx.getImageInfo({
    src: path,
    success: imgInfo => {
      const sysInfo = wx.getSystemInfoSync();
      const screenH = sysInfo.windowHeight;
      const screenW = sysInfo.windowWidth;

        const scale = screenH / imgInfo.height;
        const displayW = imgInfo.width * scale;
        const displayH = screenH;
        let offsetX = 0;
        
        if (screenW > displayW) {
          offsetX = (screenW - displayW) / 2;
        }
       // ✅ 在回调中启动滚动
      this.setData({
        displayW,
        displayH,
        offsetX,
        imagePath: path,
        screenW
      }, () => {
        console.log('数据更新完成:', {
          displayW: this.data.displayW,
          offsetX: this.data.offsetX,
          screenW: this.data.screenW
        });
        
        this.startAutoScroll('right', () => {
          console.log('🎉 滚动完成!');
          this.setData({ showmenu: true });
          this.showMasksInOrder();
        });
      });
    },
    fail: err => {
      console.error('加载图片失败:', err);
    }
  });
},
onLogincancel(){
this.setData({showloginpanel:false,
  showmenu:true,
notcancel:false})
wx.setStorageSync('notcancel', false)
},
showloginpanel(){
  this.setData({showloginpanel:true})
},
noeg(){
   // 防止定时器继续跑
   if (this.data.guideTimer) {
    clearTimeout(this.data.guideTimer);
    this.setData({ guideTimer: null });
  }
      this.setData({
        egallow: false,
    
        // 立刻关闭所有引导
        showmaskstart: false,
        showMask1: false,
        showMask2: false,
        showMask3: false,
        showbuttonnotice: false,

        showmenu:true,
        isPaused: true,
        currentStep: 0,
        imagePath:'',
        guideStep:0,
      });
      if (this.data.autoScrollTimer) {
     
        clearInterval(this.data.autoScrollTimer);
        this.setData({ autoScrollTimer: null });
      }
     
      this.stopAutoScroll();
},
showMasksInOrder() {
  // ❌ 用户已选择不再显示
 
  this.setData({
    showmaskstart: true,
    
    isPaused: false,
    currentStep: 0
  })
  this.runGuideStep()
},
runGuideStep() {
  if (this.data.isPaused) return

  const step = this.data.currentStep

  switch (step) {
    case 0:
      this.setData({
       
        showMask1: true,
        guideStep: 1
      })
      break

    case 1:
      this.toggleDropup()
      this.setData({
        showMask1: false,
        showMask2: true,
        guideStep: 2
      })
      break

    case 2:
      this.toggleDropup()
      this.setData({
        showMask2: false,
        showMask3: true,
        guideStep: 3
      })
      break

    case 3:
      this.setData({
        showmaskstart:false,
        showMask3: false,
        guideStep: 0
      })
      if (this.data.isLogin) {
        this.setData({
     
         showbuttonnotice:false,
          imagePath:'',
        })
      } else {
        
        this.setData({
          showmenu:false,
          showloginpanel: true,
          imagePath:'',
        })
      }
      return
  }

  const timer = setTimeout(() => {
    this.setData({
      currentStep: step + 1
    })
    this.runGuideStep()
  }, 1000)

  this.setData({ guideTimer: timer })
},
toggleGuidePause() {
  const { isPaused, guideTimer } = this.data

  // 👉 当前是播放状态 → 暂停
  if (!isPaused) {
    if (guideTimer) {
      clearTimeout(guideTimer)
    }
    this.setData({
      isPaused: true,
      guideTimer: null
    })
    return
  }

  // 👉 当前是暂停状态 → 继续
  this.setData({
    isPaused: false
  })
  this.runGuideStep()
},
// 勾选协议
onAgreeChange(e) {
  this.setData({
    agreed: e.detail.value.includes('agree')
  })
},


know(){
  const localKey = `localComponentList_${this.data.id}`;
    console.log(localKey);
    const localData = wx.getStorageSync(localKey) ;
     console.log(localData);
},
debugStorage() {
  const keys = wx.getStorageInfoSync().keys;
  console.log('所有存储keys:', keys);
  
  // 查看所有包含 localComponentList 的key
  keys.forEach(key => {
    if (key.includes('localComponentList')) {
      const data = wx.getStorageSync(key);
      console.log(`Key: ${key}, Data:`, data);
    }
  });
},
reloadfiles(){
  console.log("在运行")
  const existingPaths = wx.getStorageSync('localFilePaths') || [];
  if(existingPaths.length<31){
    console.log(existingPaths.length);
    this.downloadAllFiles();

  }
},
   downloadAllFiles() {
    // 这里你需要提前获取两个文件夹下所有文件的 fileID 列表
    // 你可以在云数据库里维护一个文件列表，或者用云函数获取云存储目录内容

    const fileList = [
      // folderA
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/bg/bg9.jpg',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/bg/bg6.jpg',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/bg/bg7.jpg',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/bg/bg8.jpg',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/bg/bg4.jpg',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/bg/bg3.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/bg/bg5.jpg',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/bg/playeg1.jpg',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/bg/playeg2.jpg',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw1.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw2.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw3.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw4.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw5.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw6.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw7.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw8.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw9.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw10.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw11.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw12.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw13.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw14.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw15.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw16.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw17.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw18.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw19.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/gaw20.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/button11.png',
      'cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/button22.png',
    ];
    

    return new Promise((resolve, reject) => {
      const existingPaths = wx.getStorageSync('localFilePaths') || [];
      const fs = wx.getFileSystemManager();
  
      let finished = 0;
      let hasError = false;
  
      if (fileList.length === 0) {
        return resolve(); // 没文件直接结束
      }
  
      fileList.forEach(fileID => {
        wx.cloud.downloadFile({
          fileID,
          success: res => {
            const savePath = `${wx.env.USER_DATA_PATH}/${this.getFileName(fileID)}`;
            if (!existingPaths.includes(savePath)) {
              try {
                fs.saveFileSync(res.tempFilePath, savePath);
                existingPaths.push(savePath);
              } catch (err) {
                console.error("保存失败:", err);
              }
            }
          },
          fail: err => {
            console.error("下载失败:", err);
            hasError = true;
          },
          complete: () => {
            finished++;
            if (finished === fileList.length) {
              wx.setStorageSync('localFilePaths', existingPaths);
              console.log("📂 下载并缓存完成:", existingPaths);
              hasError ? reject("部分文件下载失败") : resolve();
            }
          }
        });
      });
    });
   
  },
  getFileName(path) {
    if (!path || typeof path !== 'string') {
      console.warn("getFileName 传入的 path 无效:", path);
      return '';
    }
    return path.split('/').pop(); 
  },
    // 上传背景图 添加文字图片组件
addText() {
      const sysInfo = wx.getSystemInfoSync();
      const screenH = sysInfo.windowHeight;
      const screenW = sysInfo.windowWidth;
  
  // 默认文本框大小
  const defaultWidth = 200;
  const defaultHeight = 100;
  
  // 计算屏幕中心位置，减去背景偏移
  const centerX = screenW / 2 - this.data.offsetX;
  const centerY = screenH / 2;
  
  // 计算组件在画布上的位置（让组件中心对准屏幕中心）
  const left = centerX - defaultWidth / 2;
  const top = centerY - defaultHeight / 2;
  
  const compid = this.data.overlays.length;
  
  // 构造新的文字覆盖元素
  const newOverlay = {
    compid,
    type: 'text',
    text: '', // 初始为空文本
    top,
    left,
    //width: defaultWidth,
    //height: defaultHeight,
    groupid: "",
    color:"#000000"
  };

  // 将新元素追加到 overlays，并立即进入编辑模式
  const newIndex = this.data.overlays.length;
  this.setData({
    overlays: [...this.data.overlays, newOverlay],
    selectedOverlayIdx: newIndex,
    editingIdx: newIndex,  // 直接进入编辑模式
    textInput: '',         // 清空输入框
    textInputLength: 0,
    isDragging: false      // 确保不在拖拽状态
  });

  console.log('添加新文本组件:', {
    位置: { left, top },
    屏幕中心: { centerX, centerY },
    背景偏移: this.data.offsetX,
    组件索引: newIndex
  });
         
     
    },
    addImg() {
      wx.chooseImage({
        count: 1,
        success: res => {
          const tempPath = res.tempFilePaths[0];
          wx.navigateTo({
            url: '/Mypages/editorimage/index',    // 跳到裁剪页 :contentReference[oaicite:0]{index=0}
            success: navRes => {
              // 通过 eventChannel 传递图片临时路径
              navRes.eventChannel.emit('initCrop', { imagePath: tempPath });
                // 2) 再监听裁剪页回传的 cropDone 事件
            navRes.eventChannel.on('cropDone', ({ cropPath }) => {
              // 收到裁剪好的图，获取它的尺寸并居中展示
              wx.getImageInfo({
                src: cropPath,
                success: info => {
                  const sw = this.screenW, sh = this.screenH;
                  const targetW = sw / 3; // 宽度为屏幕的 1/3
                  const aspectRatio = info.width / info.height;
                  const targetH = targetW / aspectRatio;
                  const compid = this.data.overlays.length;
                  const groupid = "";
                  // 计算屏幕中心位置，减去背景偏移
                      const centerX = sw / 2 - this.data.offsetX;
                      const centerY = sh / 2;
  
                     // 计算组件在画布上的位置（让组件中心对准屏幕中心）
                       const left = centerX - targetW / 2;
                        const top = centerY - targetH / 2;
                  const newOverlay = {
                    compid,
                    type: 'image',
                    src:  cropPath,
                    width:  targetW,
                    height: targetH,
                    left,
                    top,
                    groupid

                  };
                  this.setData({
                    overlays: [...this.data.overlays, newOverlay],
                    selectedOverlayIdx: this.data.overlays.length
                  });
                }
              });
            });
          }
        });
      }
    });
  },
/**
 * 打开背景选择器
 */
uploadBackground() {
  this.setData({
    showBackgroundSelector: true,
    selectedBackgroundId: null,
    hideCanvas:true
  });
},

/**
 * 关闭背景选择器
 */
closeBackgroundSelector() {
 
  this.setData({
    showBackgroundSelector: false,
    hideCanvas: false
  }, () => {
    // 重新绘制连接线
    this.drawConnections();
  });
},

/**
 * 选择预设背景
 */
selectPresetBackground(e) {
  const background = e.currentTarget.dataset.item;
  if (!background) return; 
  this.setData({
    selectedBackgroundId: e.currentTarget.dataset.index
  });
  wx.showModal({
    title: '是否选择此背景图',
    content: '请确认',
    confirmText: '确认',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        
       // 应用背景
    this.applyImageBackground(background.src);
      } 
    },
    
  });
  
  
},


/** 应用图片背景*/
applyImageBackground(path) {
  if (path) {
    this.bg(path);
  }
  this.closeBackgroundSelector();
},

 // 上传自定义背景
 uploadCustomBackground() {
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempPath = res.tempFilePaths[0];
      
      // 添加到背景列表
      const bgList = this.data.bgList;
      const newBg = {
        index: bgList.length,
        name: 'bgcus'+bgList.length,
        src: tempPath
      };
      bgList.push(newBg);
       
    const localbgs = wx.getStorageSync('localbgs') || [];
    localbgs.push(newBg);
    wx.setStorageSync('localbgs', localbgs);
      this.setData({
        bgList,
        tempSelectedBackgroundId: newBg.index
      });
      
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      });
    }
  });
  
},
/**
 * 删除背景图
 */
deletebg(index) {
  const bgList = this.data.bgList;
  const background = bgList[index];
  
  // 检查是否为自定义背景|| !background.isCustom
  if (!background ) {
    wx.showToast({
      title: '预设背景无法删除',
      icon: 'none'
    });
    return;
  }
  
  // 从背景列表中移除
  bgList.splice(index, 1);
  
  // 重新设置索引
  bgList.forEach((bg, i) => {
    bg.index = i;
  });
  
  // 更新本地存储
  const localbgs = bgList.filter(bg => bg.isCustom);
  wx.setStorageSync('localbgs', localbgs);
  
  // 更新页面数据
  this.setData({ 
    bgList,
    selectedBackgroundId: null 
  });
  
  wx.showToast({
    title: '删除成功',
    icon: 'success'
  });
},

/**
 * 长按显示删除按钮
 */
onBgLongPress(e) {
  const background = e.currentTarget.dataset.item;
  const index = e.currentTarget.dataset.index;
  
  // 检查是否为自定义背景|| !background.isCustom
  if (!background ) {
    wx.showToast({
      title: '出错啦',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  
  wx.showModal({
    title: '删除背景',
    content: `确定要删除吗?`,
    confirmText: '删除',
    confirmColor: '#ff0000',
    cancelText: '取消',
    success: res => {
      if (res.confirm) {
        this.deletebg(index);
      }
    }
  });
},

/**uploadCustomBackground() {    
   wx.chooseImage({    
        count: 1,   
            success: res => {    
                   const path = res.tempFilePaths[0];       
                     this.bg(path);   
                        } 
                          }); 
                          },   



 * 原有的bg方法保持不变
 */
bg(path) {
  const localKey = `localComponentList_${this.data.id}`;
  const localData = wx.getStorageSync(localKey) || { components: [] };
  
  wx.getImageInfo({
    src: path,
    success: imgInfo => {
      const sysInfo = wx.getSystemInfoSync();
      const screenH = sysInfo.windowHeight;
      const screenW = sysInfo.windowWidth;
      console.log(this.data.isLandscape);
      if (this.data.isLandscape) {
        const scale = screenW / imgInfo.height;
        const displayW = imgInfo.width * scale;
        const displayH = screenW;
        let offsetX = 0;
        
        if (screenH > displayW) {
          offsetX = (screenH - displayW) / 2;
        }
        
        this.setData({
          displayW,
          displayH,
          offsetX
        });
      } else {
        const scale = screenH / imgInfo.height;
        const displayW = imgInfo.width * scale;
        const displayH = screenH;
        let offsetX = 0;
        
        if (screenW > displayW) {
          offsetX = (screenW - displayW) / 2;
        }
        
        this.setData({
          displayW,
          displayH,
          offsetX,
        });
      }
      console.log(path);
      localData.backgroundPath = path;
      wx.setStorageSync(localKey, localData);
      
      this.setData({
        imagePath: path,
      });
    }
  });
},
  //本地保存背景图组件
  saveToLocal() {
    const localKey = `localComponentList_${this.data.id}`;
    let localData = wx.getStorageSync(localKey) || {};
  
    // 如果没有 id，就初始化
    if (!localData.id) {
      localData.id = this.data.id || ( Date.now());
    }
  
    // 保存背景图（云端 + 本地缓存路径）
    localData.backgroundFileID = this.data.backgroundFileID || "";
    localData.backgroundPath = this.data.imagePath || "";
  
    // 初始化组件数组
    localData.components = [];
    localData.connections=this.data.connections;
  
    const overlays = this.data.overlays || [];
    const connections=this.data.connections;
    overlays.forEach((comp, idx) => {
      if (comp.type === "text") {
        localData.components.push({
          type: "text",
          text: comp.text,   // 统一字段用 content
          left: comp.left || 0,
          top: comp.top || 0,
          color:comp.color||"#000000",
        });
      } else if (comp.type === "image") {
        localData.components.push({
          type: "image",
          fileID: comp.fileID || "",      // 云端 fileID
          src: comp.src || "",      // 本地缓存路径
          left: comp.left || 0,
          top: comp.top || 0,
          width: comp.width || 100,
          height: comp.height || 100,
        });
      }
    });
  
    // 更新时间戳（毫秒）
    localData.updatedAt = Date.now();
  
    // 存入本地缓存
    wx.setStorageSync(localKey, localData);
  
    console.log("本地保存完成:", localData);
  },
savebgtolocal(){
  const localKey = `localComponentList_${this.data.id}`;
  const localData = wx.getStorageSync(localKey) || { components: [] };
  wx.saveFile({
    tempFilePath: this.data.imagePath,
    success: saveRes => {
      localData.backgroundPath = saveRes.savedFilePath; // ✅ 保存背景图路径
      wx.setStorageSync(localKey, localData);
      this.setData({ imagePath: saveRes.savedFilePath });
      console.log('背景图已保存：', saveRes.savedFilePath);
    },
    fail: err => {
      console.error('保存背景图失败', err);
    }
  });
},
  saveComponentToPermanentLocal(component) {
    const localKey = `localComponentList_${this.data.id}`;
    const localData = wx.getStorageSync(localKey) || { components: [] };
    
  
    if (component.type === 'text') {
      // 直接保存文字组件
      localData.components.push({
        type: 'text',
        text: component.text,
        top: component.top,
        left: component.left
      });
      wx.setStorageSync(localKey, localData);
     
      return;
    }
  
    if (component.type === 'image') {
      // 下载 cloud fileID → 临时路径 → 保存永久路径 → 存结构数据
     //wx.cloud.downloadFile({
        //fileID: component.src, // 注意 src 是 fileID
       // success: res => {
          wx.saveFile({
            tempFilePath: component.src,
            success: saveRes => {
              // 将永久路径存入组件
              const localImageComponent = {
                type: 'image',
                src: saveRes.savedFilePath, // 本地永久路径
                top: component.top,
                left: component.left,
                width: component.width,
                height: component.height
              };
  
              localData.components.push(localImageComponent);
              wx.setStorageSync(localKey, localData);
              
  
              console.log('图片组件已永久保存到本地', localImageComponent);
            },
            fail: err => {
              console.error('保存图片失败', err);
            }
          });
      //  },
        //fail: err => {
         // console.error('下载图片失败', err);
        //}
      //});
    }
  },
//云端上传背景图组件
async confirmsavescenecloud() {
  const now = new Date();
  const storageKey = 'cloudSaveRecord';
  const record = wx.getStorageSync(storageKey) || {};

  // 获取当前周的唯一标识（年+周数）
  const getWeekId = (date) => {
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - yearStart) / 86400000);
    const week = Math.ceil((days + yearStart.getDay() + 1) / 7);
    return `${date.getFullYear()}_${week}`;
  };

  const currentWeek = getWeekId(now);
  let { weekId, saveCount = 0 } = record;

  // 如果不是同一周，重置计数
  if (weekId !== currentWeek) {
    weekId = currentWeek;
    saveCount = 0;
  }

  // 检查次数是否超过 3 次
  if (saveCount >= 3) {
    wx.showModal({
      title: '次数已用完',
      content: '本周云存储次数已达上限（3次），请下周再试。',
      showCancel: false
    });
    return;
  }

  // 提示确认
  wx.showModal({
    title: '确认要云存储吗？',
    content: `每周最多可使用 3 次云存储，本周已使用 ${saveCount} 次。`,
    confirmText: '确认',
    confirmColor: '#ff0000',
    cancelText: '取消',
    success: async (res) => {
      if (res.confirm) {
        //await
         this.saveScene();

        // 更新记录
        wx.setStorageSync(storageKey, {
          weekId: currentWeek,
          saveCount: saveCount + 1,
          lastSaveTime: now.getTime(),
        });

        wx.showToast({
          title: `云存储成功 (${saveCount + 1}/3)`,
          icon: 'success'
        });
      }
    }
  });
},

async  saveScene() {
  this.saveToLocal();
  const localKey = `localComponentList_${this.data.id}`;
  const localData = wx.getStorageSync(localKey) || { components: [] };

  const db = wx.cloud.database();
  const fs = wx.getFileSystemManager();
  if (localData.backgroundPath) {
    let bgFileName = this.getFileName(localData.backgroundPath);

    // 如果是 gaw 开头，固定 fileID
    if (bgFileName.startsWith("gaw")) {
      localData.backgroundFileID = `cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/${fileName}`;
    } else {
      const resBg = await wx.cloud.uploadFile({
        cloudPath: "backgrounds/" + bgFileName, // 单独放 backgrounds 文件夹
        filePath: localData.backgroundPath
      });
      localData.backgroundFileID = resBg.fileID;
    }
  }
  // 遍历组件，处理图片
  for (let comp of localData.components) {
  
    if (comp.type === "image" && comp.src) {
      let fileName = this.getFileName(comp.src); // 文件名
  
      // 如果是 gaw1/gaw2 特殊情况，设定固定 fileID 路径
      if (fileName.startsWith("gaw")) {
        comp.fileID = `cloud://cloud1-4g0itg39d552ccb5.636c-cloud1-4g0itg39d552ccb5-1348350895/eg/com/${fileName}`;
      } else {
        // 上传到云存储
      
        const res = await wx.cloud.uploadFile({
          cloudPath: "images/" + fileName,
          filePath: comp.src
        });
        
        comp.fileID = res.fileID;
        console.log(comp.fileID);
      }
    }
  }

localData.connections = this.data.connections || [];
  // 更新时间戳
  localData.updatedAt = Date.now();
  wx.setStorageSync(localKey, localData)

  // 存到数据库
  await db.collection("scenes").doc(localData.id).set({
    data: localData
  });

},
async  loadScene(id,options = {}) {
  const { 
    targetId = null,           // 目标ID（用于另存为新文件）
    saveAsNew = false,         // 是否作为新文件保存
    checkLocalCache = true     // 是否检查本地缓存
  } = options;
  const db = wx.cloud.database();

  // 本地数据
  // 确定实际使用的ID和存储key
  const actualId = targetId || id;
  const localKey = `localComponentList_${actualId }`;
  let localData = wx.getStorageSync(localKey) || { components: [] };
  console.log(`加载云端数据 - 原始ID: ${id}, 目标ID: ${actualId}, 另存为新文件: ${saveAsNew}`);
    
  // 云端数据
  const cloudRes = await db.collection("scenes").doc(id).get();
  const cloudScene = cloudRes.data;
   console.log(cloudScene);
  // 判断是否需要更新
  //let finalScene = null;
 // finalScene = await this.downloadSceneResources(cloudScene);
 // console.log(finalScene)
  //if (!localData || cloudScene.updatedAt > localData.updatedAt) {
    //需要更新，合并下载图片
     const finalScene = await this.downloadSceneResources(cloudScene, {
      targetId: actualId,
      forceDownload: saveAsNew,
      checkCache: checkLocalCache && !saveAsNew
    });
    //finalScene = await this.downloadSceneResources(cloudScene);
    //wx.setStorageSync("scene_" + id, finalScene);
    //console.log("资源下载完成:", finalScene);
    
    // 保存到本地存储
    //wx.setStorageSync(localKey, finalScene);
  //} else {
    // 本地是最新的，直接用本地
   // finalScene = localData;
   // console.log(finalScene)
  //}
  localData=finalScene;
  if(finalScene===undefined){
     this.egload2();
     console.log("云存储"+finalScene);
  }
  else{
  wx.setStorageSync(localKey, localData)
  this.setData({
    overlays: localData.components,
    imagePath: localData.backgroundPath || '' ,// ✅ 加载背景图路径
    connections:localData.connections,
  });
  if (this.data.imagePath) {
    this.bg(this.data.imagePath); // 处理背景图显示逻辑
    console.log(this.data.imagePath);
  }
  console.log(this.data.overlays);
      console.log(this.data.imagePath);
      console.log(localData);
      this.toggleOrientation();
    }
  return finalScene;
  
},


// 下载图片资源（只下载本地不存在的）
async downloadSceneResources(sceneData, options = {}) {
  const {
    targetId = this.data.id, 
     // 目标ID（用于确定存储路径）
    forceDownload = false,      // 强制下载（忽略本地缓存）
    checkCache = true ,          // 是否检查本地缓存
  } = options;
  
  const fs = wx.getFileSystemManager();
  // 确保目录存在
  console.log(`下载资源 - 目标ID: ${targetId}, 强制下载: ${forceDownload}, 检查缓存: ${checkCache}`);
  
  
  const dirPath = await this.ensureDirectory(targetId);

  
  // 处理背景图
  if (sceneData.backgroundPath && sceneData.backgroundFileID) {
    try {
      const backgroundResult = await this.downloadSingleResource({
        fileID: sceneData.backgroundFileID,
        dirPath,
        resourceType: '背景图',
        forceDownload,
        checkCache
      });
      
      sceneData.backgroundPath = backgroundResult.localPath;
      console.log("背景图处理完成:", backgroundResult.localPath);
    } catch (error) {
      console.error("背景图下载失败:", error);
      sceneData.backgroundPath = `${wx.env.USER_DATA_PATH}/bg4.jpg`;
    }
  }
  
  // 处理组件图片
  if (sceneData.components && Array.isArray(sceneData.components)) {
    for (let i = 0; i < sceneData.components.length; i++) {
      const comp = sceneData.components[i];
      
      if (comp.type === "image" && comp.fileID) {
        try {
          const imageResult = await this.downloadSingleResource({
            fileID: comp.fileID,
            dirPath,
            resourceType: `组件图片[${i}]`,
            forceDownload,
            checkCache
          });
          
          comp.src = imageResult.localPath;
          console.log(`组件图片[${i}]处理完成:`, imageResult.localPath);
        } catch (error) {
          console.error(`组件图片[${i}]下载失败:`, error);
          comp.src = comp.fileID; // 保持云端地址作为备选
        }
      }
    }
  }
  return sceneData;
},
// 下载单个资源文件
async downloadSingleResource({ fileID, dirPath, resourceType, forceDownload = false, checkCache = true }) {
  const fs = wx.getFileSystemManager();
  const fileName = this.getFileName(fileID);
  const localPath = `${dirPath}/${fileName}`;
  
  // 检查本地缓存
  if (checkCache && !forceDownload) {
    try {
      fs.accessSync(localPath);
      console.log(`${resourceType}已存在缓存:`, localPath);
      return { localPath, fromCache: true };
    } catch (e) {
      // 文件不存在，需要下载
    }
  }
  
  // 下载文件
  console.log(`开始下载${resourceType}:`, fileID);
  
  try {
    const res = await wx.cloud.downloadFile({ fileID });
    console.log(`${resourceType}云端下载完成，临时文件:`, res.tempFilePath);
    
    // 确保父目录存在
    const parentDir = localPath.substring(0, localPath.lastIndexOf('/'));
    try {
      fs.accessSync(parentDir);
    } catch (dirErr) {
      fs.mkdirSync(parentDir, true);
    }
    
    // 保存文件
    fs.saveFileSync(res.tempFilePath, localPath);
    console.log(`${resourceType}保存完成:`, localPath);
    
    return { localPath, fromCache: false };
    
  } catch (downloadError) {
    console.error(`${resourceType}下载失败:`, downloadError);
    throw downloadError;
  }
},

// 确保目录存在
async ensureDirectory(targetId) {
  const fs = wx.getFileSystemManager();
  const dirPath = `${wx.env.USER_DATA_PATH}/${targetId}`;
  
  try {
    fs.accessSync(dirPath);
    console.log("目录已存在:", dirPath);
    return dirPath;
  } catch (e) {
    console.log("创建目录:", dirPath);
    try {
      fs.mkdirSync(dirPath, true);
      console.log("目录创建成功");
      return dirPath;
    } catch (mkdirError) {
      console.error("创建目录失败:", mkdirError);
      console.log("使用根目录作为备选");
      return wx.env.USER_DATA_PATH;
    }
  }
},
  uploadcloudbg(){
    const cloudPath = `backgrounds/${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
    const filePath = this.data.imagePath;
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: uploadRes => {
        const fileID = uploadRes.fileID;
        this.setData({
          backgroundFileID: fileID,
          
        });
        wx.showToast({ title: '上传成功' });
        if (this.data.id) {
          const db = wx.cloud.database();
          db.collection("compositions")
            .where({ id: this.data.id })
            .get()
            .then(res => {
              if (res.data.length > 0) {
                db.collection("compositions").doc(res.data[0]._id).update({
                  data: {
                    backgroundFileID: fileID,
                    updatedAt: db.serverDate()
                  }
                });
              }
            });
        }
      },
  
         fail: err => {
            console.error('上传失败', err);
             wx.showToast({ icon: 'error', title: '上传失败' });
         }
        });
 },
  uploadcomponentcloud(e){
    const idx = e.currentTarget.dataset.idx;
    const overlays = [...this.data.overlays];
    const component = overlays[idx];
    this.uploadComponent(component);
  },
  uploadComponent(component) {
    const db = wx.cloud.database();
    const _ = db.command;
    const userInfo = wx.getStorageSync('userInfo') || {}; // 你需要提前存用户 openid
    const timestamp = new Date();
  
    if (component.type === 'text') {
      db.collection('components').add({
        data: {
          id:this.data.id,
          type: 'text',
          text: component.text,
          top: component.top,
          left: component.left,
          authorId: userInfo.openid,
          createdAt: new Date(),
          sceneId: this.sceneId || null // 若使用场景标识
        },
        success: res => {
          console.log('文字组件上传成功', res);
        },
        fail: err => {
          console.error('文字组件上传失败', err);
        }
      });
    }
  
    else if (component.type === 'image') {
      // 先上传图片到云存储
      const cloudPath = 'components/' + Date.now() + '.png';
      wx.cloud.uploadFile({
        cloudPath,
        filePath: component.src, // 临时路径
        success: uploadRes => {
          const fileID = uploadRes.fileID;
          db.collection('components').add({
            data: {
              id:this.data.id,
              type: 'image',
              imageFileID: fileID,
              top: component.top,
              left: component.left,
              width: component.width,
              height: component.height,
              authorId: userInfo.openid,
              createdAt: new Date(),
              sceneId: this.sceneId || null
            },
            success: res => {
              console.log('图片组件上传成功', res);
            },
            fail: err => {
              console.error('图片组件上传失败', err);
            }
          });
        },
        fail: err => {
          console.error('上传图片到云存储失败', err);
        }
      });
    }
    
        db.collection('compositions').doc(this.data.id).update({
        data: {
          updatedAt: db.serverDate() // ✅ 确保更新时间字段写在 data 里
        }
      });
      wx.showToast({ title: '云端已更新' });
  },
  //云端加载背景图组件
  loadBackgroundcloud(fileID) {
    // 如果你要下载临时链接用于 `<image src="xxx"/>` 展示
    //fileID = this.data.backgroundFileID; // 云文件ID，必须提前 setData 或绑定在页面数据中
    const localKey = `localComponentList_${this.data.id}`;
    const localData = wx.getStorageSync(localKey) || { components: [] };
    wx.cloud.downloadFile({
      fileID,
      success: res => {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: saveRes => {
          
            localData.backgroundPath = saveRes.savedFilePath; // ✅ 保存背景图路径
            wx.setStorageSync(localKey, localData);
            
            this.setData({
              imagePath: savedPath
            });

            console.log('从云端下载并保存到本地');
        
        
            this.bg(this.data.imagePath);
      },
      fail: err => {
        console.error('保存文件失败', err);
        wx.showToast({ icon: 'error', title: '保存失败' });
      }
    });
  },
      fail: err => {
        console.error('获取临时链接失败', err);
      }
    });
  
  },
  loadComponentsFromCloud() {
    const localKey = `localComponentList_${this.data.id}`;
    const localData = wx.getStorageSync(localKey) || { components: [] };
    // 本地无数据，从云端加载
    const db = wx.cloud.database();
    db.collection('components')
    .where({ id: this.data.id }) // 可根据场景ID过滤
    .get({
      success: res => {
        const cloudItems = res.data || [];
        const overlays = [];

        const downloadTasks = [];

       const localComponents = wx.getStorageSync(localKey) ||{ components: [] };
       const localMap = {};
       localComponents.forEach(item => {
         if (item._id) localMap[item._id] = item.createdAt;
       });
      cloudItems.forEach(item => {
          const isNew = !localMap[item._id];
          const isUpdated = isNew || new Date(item.createdAt).getTime() > new Date(localMap[item._id]).getTime();

          if (!isUpdated) return; // ✅ 跳过未更新的数据
          if (item.type === 'text') {
            overlays.push({
              _id: item._id,
              type: 'text',
              text: item.text,
              top: item.top,
              left: item.left,
              createdAt: item.createdAt
            });
            return Promise.resolve(); // 占位符
          } else if (item.type === 'image') {
            return new Promise((resolve, reject) => {
              wx.cloud.downloadFile({
                fileID: item.imageFileID,
                success: res => {
                  wx.saveFile({
                    tempFilePath: res.tempFilePath,
                    success: saveRes => {
                      overlays.push({
                        _id: item._id,
                        type: 'image',
                        src: saveRes.savedFilePath, // ✅ 本地路径
                        top: item.top,
                        left: item.left,
                        width: item.width,
                        height: item.height,
                        createdAt: item.createdAt
                      });
                      resolve();
                    },
                    fail: err => {
                      console.error('保存文件失败', err);
                      resolve(); // 不阻塞其他任务
                    }
                  });
                },
                fail: err => {
                  console.error('下载文件失败', err);
                  resolve(); // 不阻塞其他任务
                }
              });
            });
          }
        });

        Promise.all(downloadTasks).then(() => {
          const merged = [...localComponents];
          overlays.forEach(newItem => {
            const idx = merged.findIndex(old => old._id === newItem._id);
            if (idx !== -1) merged[idx] = newItem;
            else merged.push(newItem);
          });
          wx.setStorageSync(localKey, merged);
          this.setData({ overlays: merged });
          console.log('组件及图片已下载并保存到本地缓存');
        });
      },
      fail: err => {
        console.error('加载组件失败', err);
      }
    });

  },
//本地加载背景图组件
  loadcomponentsfromlocal() {
     const localKey = `localComponentList_${this.data.id}`;
     const localData = wx.getStorageSync(localKey);
     console.log(localData);
     console.log(localKey);

  if (localData && Array.isArray(localData.components) && localData.components.length > 0) {
    this.setData({
      overlays: localData.components,
      imagePath: localData.backgroundPath || '' // ✅ 加载背景图路径
    });
    if (this.data.imagePath) {
      this.bg(this.data.imagePath); // 处理背景图显示逻辑
     
    }
    console.log('✅ 本地组件和背景图已加载');
  } else {
    console.warn('⚠️ 未找到本地组件数据');
  }
  
  },
//分享文件
async onShareSceneFile() {
  const fs = wx.getFileSystemManager();

  // 如果文件已经生成过，直接分享
  if (this.data.sceneFilePath) {
    const filePath = this.data.sceneFilePath;
    wx.shareFileMessage({
      filePath,
      fileName:this.data.nickName+ '的许愿池.gawscene',
      success: () => {
        console.log('导出路径：', filePath);
        console.log('分享成功');

        fs.readFile({
          filePath,
          encoding: 'utf8',
          success(res) {
            console.log('文件内容读取成功：', res.data);
          },
          fail(err) {
            console.error('读取失败', err);
          }
        });

        wx.showToast({ title: '分享成功', icon: 'success' });
      },
      fail: err => {
        console.log('导出路径：', filePath);
        console.error('分享失败', err);
        wx.showToast({ title: '分享失败', icon: 'error' });
      }
    });
    return;
  }

  // 封装图片路径转base64的Promise函数
  const toBase64 = (path) => {
    return new Promise((resolve, reject) => {
      fs.readFile({
        filePath: path,
        encoding: 'base64',
        success(res) {
          resolve(res.data);
        },
        fail(err) {
          console.error('转换失败', err);
          resolve(''); // 避免失败导致整个流程终止
        }
      });
    });
  };

  try {
    const { imagePath, overlays, id } = this.data;

    // 转换背景图为 base64
    const base64Databg = imagePath ? await toBase64(imagePath) : '';

    // 转换 overlays 中所有 image 类型组件的 base64
    const processedComponents = await Promise.all(overlays.map(async (item) => {
      if (item.type === 'text') {
        return {
          _id: item._id,
          type: 'text',
          text: item.text,
          top: item.top,
          left: item.left,
          createdAt: item.createdAt
        };
      } else if (item.type === 'image') {
        const base64 = item.src ? await toBase64(item.src) : '';
        return {
          _id: item._id,
          type: 'image',
          top: item.top,
          left: item.left,
          width: item.width,
          height: item.height,
          createdAt: item.createdAt,
          src: item.src || '',
          base64: base64
        };
      }
    }));

    const content = {
      id: id,
      background: base64Databg,
      components: processedComponents,
      connections:this.data.connections
    };

    const json = JSON.stringify(content, null, 2);
    const filePath = `${wx.env.USER_DATA_PATH}/scene_${id}_${Date.now()}.gawscene`;

    fs.writeFile({
      filePath,
      data: json,
      encoding: 'utf8',
      success: () => {
        this.setData({ sceneFilePath: filePath });
        console.log('导出路径：', filePath);
        wx.showToast({ title: '文件已生成，请再次点击分享', icon: 'none' });
      },
      fail: (err) => {
        console.error('写入失败', err);
        wx.showToast({ title: '生成失败', icon: 'error' });
      }
    });

  } catch (e) {
    console.error('生成失败', e);
    wx.showToast({ title: '出错了', icon: 'error' });
  }
},
 async loadEditorData(id) {

    if (!id) {
      console.error("缺少 sceneId，无法加载数据");
      return;
    }

    const localKey = `localComponentList_${this.data.id}`;
     const localData = wx.getStorageSync(localKey);
     if (localData && (localData.backgroundPath || (Array.isArray(localData.components) && localData.components.length > 0))) {
      if (this.data.isFromShare) {
        // 弹窗让用户选择
        this.showConflictDialog(id, localData);
      } else {
        this.setData({
          overlays: localData.components,
          imagePath: localData.backgroundPath || '', // ✅ 加载背景图路径
          connections:localData.connections
        });
        if (this.data.imagePath) {
          this.bg(this.data.imagePath); // 处理背景图显示逻辑
        }
        // 正常加载本地数据
        this.loadLocalData(localData);
        this.toggleOrientation();
      } 
      
     }else {
      // 2. 本地没有数据 → 去云端读取
      try {
        this.egload2();
        console.log("本地无数据，尝试从云端读取:", id);
        this.loadScene(id);
        
        
          // 3. 云端也没有 → 新建
  
      } catch (err) {
        console.warn("云端查询失败，建立新场景:", err);
        this.createnewone(id);
        this.egload2();
       
      }
    }
  },
  // 显示冲突处理弹窗
showConflictDialog(id, localData) {
  wx.showModal({
    title: '发现本地文件',
    content: '本地已存在相同ID的文件，请选择如何处理：',
    confirmText: '覆盖',
    cancelText: '新建',
    success: (res) => {
      if (res.confirm) {
        // 用户选择覆盖 - 加载云端数据并覆盖本地
        this.loadCloudDataAndOverride(id);
      } else if (res.cancel) {
        // 用户选择新建 - 生成新ID并加载云端数据
        this.loadCloudDataAsNew(id);
      }
    },
    fail: () => {
      // 弹窗失败，默认加载本地数据
      this.loadLocalData(localData);
    }
  });
},
loadLocalData(localData) {
  this.setData({         
    overlays: localData.components,         
    imagePath: localData.backgroundPath || '', // ✅ 加载背景图路径  
    connections:localData.connections, 
  });       
  if (this.data.imagePath) {         
    this.bg(this.data.imagePath); // 处理背景图显示逻辑       
  }       
  console.log(this.data.overlays);       
  console.log(this.data.imagePath);       
  console.log(localData);
},
  createnewone(id){ 
    const newScene = {
    id,
    overlays: [],
    backgroundFileID: '',
    updatedAt: Date.now(),
    
  };

  this.setData({
    overlays: [],
    backgroundFileID: '',
  });

},// 覆盖本地数据
async load1(){
  await this.loadCloudDataAndOverride(this.data.id)},
async load2(){await this.loadCloudDataAsNew(this.data.id)},
async loadCloudDataAndOverride(id) {
  try {
    console.log("从云端加载数据并覆盖本地:", id);
    await this.loadScene(id, { 
      checkLocalCache: false  // 覆盖时不检查本地缓存，强制从云端加载
    });
    wx.showToast({
      title: '已覆盖本地文件',
      icon: 'success'
    });
  } catch (err) {
    console.warn("云端加载失败:", err);
    wx.showToast({
      title: '加载失败，保留本地文件',
      icon: 'none'
    });
    // 加载本地数据作为备选
    const localData = wx.getStorageSync(`localComponentList_${id}`);
    if (localData) {
      this.loadLocalData(localData);
    }
  }
},

// 作为新文件保存
async loadCloudDataAsNew(originalId) {
  try {
    // 生成新的ID
    const newId = this.generateNewId();
    console.log(`作为新文件保存: ${originalId} -> ${newId}`);
    
    // 更新当前页面的id
    //this.setData({ id: newId });
    
    // 从云端加载原始数据
    //await this.loadScene(originalId);
   
    // 加载完成后，将数据保存为新ID
    //const currentData = {
     // components: this.data.overlays,
    //  backgroundPath: this.data.imagePath
   // };
    
    // 保存到新的本地key
   // wx.setStorageSync(`localComponentList_${newId}`, currentData);
     // 从云端加载原始数据，但使用新ID作为存储key
     const result = await this.loadScene(originalId, {
      targetId: newId,
      saveAsNew: true,
      checkLocalCache: false
    });
    console.log("云端数据加载完成:", {
      hasComponents: result?.components?.length || 0,
      hasBackground: !!result?.backgroundPath
    });
    // 更新compositions列表
    this.addToCompositions(newId);
    wx.reLaunch({
      url: `/Mypages/editorH/index?id=${newId}`
    });
    wx.showToast({
      title: '已保存为新文件',
      icon: 'success'
    });
    
  } catch (err) {
    console.warn("云端加载失败:", err);
    wx.showToast({
      title: '加载失败',
      icon: 'error'
    });
  }
},

// 生成新的ID
generateNewId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
},

// 添加到compositions列表
addToCompositions(newId) {
  const localData = wx.getStorageSync('compositions') || [];
  const newItem = {
    id: newId,
    creator: this.data.nickName,
    title: this.data.nickName + "许愿墙(副本)",
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  const updated = [...localData, newItem];
  wx.setStorageSync('compositions', updated);
},

//读取文件
  onImportTap() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: res => {
        const filePath = res.tempFiles[0].path;
        const fs = wx.getFileSystemManager();

        fs.readFile({
          filePath,
          encoding: 'utf8',
          success: readRes => {
            try {
              const parsed = JSON.parse(readRes.data);
              const localKey = `localComponentList_${parsed.id}`;
              const localData = {
                backgroundPath: parsed.background || '',
                components: parsed.components || []
              };

              wx.setStorageSync(localKey, localData); // ✅ 存储整个对象结构
              
              wx.navigateTo({
                url: `/pages/editor/editor?id=${parsed.id}`
              });
            } catch (err) {
              console.error('文件解析失败', err);
              wx.showToast({ title: '文件格式错误', icon: 'error' });
            }
          },
          fail: err => {
            console.error('文件读取失败', err);
          }
        });
      },
      fail: err => {
        console.error('文件选择失败', err);
      }
    });
  },
    // ⚠️ 重要：这个方法必须绑定到按钮的点击事件上
  // 这个方法必须绑定到按钮的点击事件上，不能自动调用
  async onLogin(e) {
    // 确保是用户主动触发的操作
    if (!e || e.type !== 'tap') {
      wx.showToast({
        title: '请点击登录按钮',
        icon: 'none'
      });
      return;
    }

    try {
      // 显示登录中的加载提示
      wx.showLoading({
        title: '登录中...',
        mask: true
      });
      wx.getSetting({
        success(res) {
      if (!res.authSetting['scope.userInfo']) {
        /* 如果不存在  先进行弹出框授权 */
        wx.authorize({
            scope: 'scope.userInfo',
            success() {}
        })
    } else {

    }
   
        }
      })
      
    const  userProfile = await this.getUserProfile();
    // 1. 获取用户授权信息（必须在用户点击时调用）
    
    
    // 2. 获取 openid
    const openid = await this.getOpenId();
    console.log('用户 openid:', openid);
    this.setData({showloginpanel:false});
    // 3. 设置初始昵称并让用户确认
    const finalNickname = await this.confirmNickname(userProfile.userInfo.nickName);
    if (!finalNickname) {
      // 用户取消登录
      return;
    }
    
    // 4. 构建并存储用户信息
    const userInfo = {
      openid: openid,
      nickname: finalNickname,
      avatarUrl: userProfile.userInfo.avatarUrl || '',
      loginTime: new Date().getTime()
    };
    
    await this.saveUserInfo(userInfo);
    
    // 5. 更新页面状态
    this.setData({
      openid: openid,
      userInfo: userInfo,
      isLogin: true,
      notcancel:true,
    });
    wx.setStorageSync('notcancel', true)
    console.log('登录成功，用户信息:', userInfo);
    
    // 6. 显示成功提示
    wx.hideLoading();
    wx.showToast({
      title: "登录成功",
      icon: "success"
    });
              // 7. 执行登录后的操作
      this.onLoginSuccess(userInfo);
      
    } catch (error) {
      wx.hideLoading();
      this.handleLoginError(error);
    }
  },

  // 辅助方法：获取用户授权信息
  // ⚠️ 重要：这个方法只能在用户点击事件中调用
  getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善用户资料', // 必须说明用途
        success: (res) => {
          console.log('用户授权成功');
          console.log('微信用户信息:', res.userInfo);
          console.log('微信昵称:', res.userInfo.nickName);
          resolve(res);
       
        },
        fail: (error) => {
          console.log('用户拒绝授权或授权失败:', error);
          reject(error);
        }
      });
    });
  },

  // 辅助方法：获取 openid
  async getOpenId() {
    const cloudRes = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      }
    });
    
    if (!cloudRes.result || !cloudRes.result.openid) {
      throw new Error('获取openid失败');
    }
    
    return cloudRes.result.openid;
  },

  // 辅助方法：确认昵称
  confirmNickname(initialNickname) {
    return new Promise((resolve, reject) => {
      console.log('初始昵称:', initialNickname);
      
      wx.showModal({
        title: "确认昵称",
        content: `${initialNickname}`,
        editable: true,
        placeholderText: initialNickname,
        confirmText: '确认',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 用户点击确认
            let finalNickname = initialNickname;
            
            if (res.content && res.content.trim()) {
              // 验证昵称长度和内容
              const trimmedContent = res.content.trim();
              if (trimmedContent.length > 20) {
                wx.showToast({
                  title: '昵称不能超过20个字符',
                  icon: 'none'
                });
                // 重新弹出确认框
                this.confirmNickname(initialNickname).then(resolve).catch(reject);
                return;
              }
              finalNickname = trimmedContent;
            }
            
            resolve(finalNickname);
          } else {
            // 用户取消
            wx.showToast({
              title: '登录已取消',
              icon: 'none'
            });
            resolve(null);
          }
        },
        fail: reject
      });
    });
  },

  // 辅助方法：保存用户信息
  async saveUserInfo(userInfo) {
    try {
      // 保存到本地存储
      wx.setStorageSync('userInfo', userInfo);
      
      // 可选：同时保存到云数据库
      // await this.saveToCloud(userInfo);
      
    } catch (error) {
      console.error('保存用户信息失败:', error);
      throw new Error('保存用户信息失败');
    }
  },

  // 辅助方法：处理登录错误
  handleLoginError(error) {
    console.error('登录失败:', error);
    
    let errorMsg = '登录失败，请重试';
    
    if (error.errMsg) {
      if (error.errMsg.includes('getUserProfile:fail auth deny')) {
        errorMsg = '登录需要您的授权，请重新点击登录';
      } else if (error.errMsg.includes('getUserProfile:fail')) {
        errorMsg = '获取用户信息失败，请重试';
      } else if (error.errMsg.includes('cloud') || error.errMsg.includes('network')) {
        errorMsg = '网络错误，请检查网络连接';
      } else if (error.errMsg.includes('function not found')) {
        errorMsg = '服务配置错误，请联系客服';
      }
    }
    
    wx.showToast({
      title: errorMsg,
      icon: 'none',
      duration: 3000
    });
  },

  // 辅助方法：登录成功后的操作
  onLoginSuccess(userInfo) {
    // 这里可以添加登录成功后需要执行的操作
    console.log('执行登录成功后的操作');
    
    const pendingNav = wx.getStorageSync('pendingNavigation');
    if (pendingNav) {
      console.log(pendingNav );
      wx.removeStorageSync('pendingNavigation');
      const queryString = Object.keys(pendingNav.query)
        .map(key => `${key}=${pendingNav.query[key]}`)
        .join('&');
      
      wx.reLaunch({
        url: `/${pendingNav.path}?${queryString}`
      });
    } else {
      // 默认跳转到首页或其他页面
      wx.navigateTo({
        url: '/Mypages/list1/index'
      });
      
    }
    
   
    // 示例：可以跳转到主页
    // wx.switchTab({
    //   url: '/pages/index/index'
    // });
    
    // 或者触发自定义事件
  // this.triggerEvent('loginSuccess', { userInfo });
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.removeStorageSync('userInfo');
          
          // 更新页面状态
          this.setData({
            isLoggedIn: false,
            openid: '',
            userInfo: null
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 显示隐私政策
  showPrivacy() {
    wx.navigateTo({
      url: '/Mypages/notice1/notice1'
    });
  },

  // 显示用户协议
  showTerms() {
    wx.navigateTo({
      url: '/Mypages/notice2/notice2'
    });
  },
  saveNickname() {
    const { tempNickname, openid } = this.data;
    if (!tempNickname) {
      wx.showToast({ title: "昵称不能为空", icon: "none" });
      return;
    }
    this.setData({
      nickname: tempNickname,
      showNicknameModal: false
    });
    const userInfo = {
      openid,
      nickname:this.data.nickname,
      
    };
    console.log(userInfo);
        wx.setStorageSync('userInfo', userInfo);
    wx.showToast({ title: "昵称已保存", icon: "success" });
  },
  showPicker() {
    this.setData({ showPicker: true });
  },

  hidePicker() {
    this.setData({ showPicker: false });
  },
 
  share(){
    const localPath = wx.getStorageSync('localBackgroundPath');
    const localKey = `localComponentList_${this.data.id}`;
    const localComponents = wx.getStorageSync(localKey) || [];
    const fs = wx.getFileSystemManager();
    const content = {
      version: '1.0',
      id:this.data.id,
      background:localPath,

      components: localComponents.map(item => {
        if (item.type === 'text') {
          return {
            _id: item._id,
            type: 'text',
            text: item.text,
            top: item.top,
            left: item.left,
            createdAt: item.createdAt
          };
        } else if (item.type === 'image') {
          return {
            _id: item._id,
            type: 'image',
            top: item.top,
            left: item.left,
            width: item.width,
            height: item.height,
            createdAt: item.createdAt,
            // 图片路径保留 wxfile:// 本地路径，提示导入时加载
            src: item.src || ''
          };
        }
      })
    };
    const json = JSON.stringify(content);
    
    // 可自定义扩展名（比如 .gawscene）方便识别
    const filePath = `${wx.env.USER_DATA_PATH}/scene_${this.data.id}_${Date.now()}.gawscene`;
    
    fs.writeFile({
      filePath,
      data: json,
      encoding: 'utf8',
      success: () => {
        wx.shareFileMessage({
          filePath,
          fileName: '自定义组件场景.gawscene',
          success: () => {
            console.log('分享成功'),
            console.log('导出路径：', filePath);
        },
          fail: err => console.error('分享失败', err)
        });
      },
      fail: err => console.error('写入失败', err)
    });
    
},
ondeleteselect(e){
  wx.showModal({
    title: '删除组件',
    content: '是否删除组件？',
    success: res => {
      if (res.confirm) {
        this.deleteOverlay(e);
      }
      }
    })
},
 // 删除按钮
 deleteOverlay(e) {
  const idx = e.currentTarget.dataset.idx;
  const overlays = [...this.data.overlays];
   // 删除相关连线
const connections = this.data.connections.filter(conn => 
  conn.from !== idx && conn.to !== idx
);

overlays.splice(idx, 1);
// 更新连线中的索引（因为删除了一个组件，后续组件索引会前移）
const updatedConnections = connections.map(conn => ({
  ...conn,
  from: conn.from > idx ? conn.from - 1 : conn.from,
  to: conn.to > idx ? conn.to - 1 : conn.to
}));

  // 如果正在编辑这个组件，先退出编辑模式
if (this.data.editingIdx === idx) {
  this.setData({
    editingIdx: null,
    textInput: '',
    textInputLength: 0
  });
}

this.setData({
  overlays,
  connections: updatedConnections,
  selectedOverlayIdx: null
}, () => {
  // 重新绘制连接线
  this.drawConnections();
});
},
  onEmojiSelect(e) {
    const emoji = e.currentTarget.dataset.item;
    this.setData({ selectedemoji: e.currentTarget.dataset.index });
    if (!emoji || !emoji.src) {
      console.warn('缺少 emoji 数据', emoji);
      return;
    }
  
    wx.showModal({
      title: '添加图片',
      content: '是否将该图片添加到画布中？',
      success: res => {
        if (res.confirm) {
          wx.getImageInfo({
            src: emoji.src,
            success: info => {
              if (!info || !info.width || !info.height || info.width <= 0 || info.height <= 0) {
                console.warn('图片尺寸获取失败，使用默认尺寸');
                info = { width: 300, height: 300 }; // 默认正方形尺寸
              }
              console.log(info.width,info.height);
              const sw = this.screenW, sh = this.screenH;
              const targetW = sw / 3;
              const aspectRatio = info.width / info.height;
              const targetH = targetW / aspectRatio;
              console.log('计算结果:', sw, sh, targetW, targetH, aspectRatio);
              // 检查异常：宽高为 0 或 NaN，就设置默认值
                // 计算屏幕中心位置，减去背景偏移
                const centerX = sw / 2 - this.data.offsetX;
                const centerY = sh / 2;

               // 计算组件在画布上的位置（让组件中心对准屏幕中心）
                 const left = centerX - targetW / 2;
                  const top = centerY - targetH / 2;
              const newOverlay = {
                type: 'image',
                src: emoji.src,
                width: targetW,
                height: targetH,
                left,
                top
              };
              this.setData({
                overlays: [...this.data.overlays, newOverlay],
                selectedOverlayIdx: this.data.overlays.length
              });
              console.log('添加 overlay:', newOverlay);
            },
            fail: err => {
              wx.showToast({ title: '加载失败', icon: 'error' });
              console.error('图片信息获取失败', err);
            }
          });
        }
      }
    });
  
    
  },

  addToEmojiList(component) {
    if (component.type !== 'image') return;
  
    const emojiListlocal = wx.getStorageSync('localEmojis') || [];
  
    // 避免重复添加
    if (!emojiListlocal.find(item => item.localPath === component.src)) {
      const newEmoji = { src: component.src };
            emojiListlocal.unshift(newEmoji);
      // 可用 unshift 添加到前面
      this.setData({emojiList:[...this.data.emojiList,newEmoji]});
      wx.setStorageSync('localEmojis', emojiListlocal);
      wx.showToast({ title: '已添加到表情包' });
    } else {
      wx.showToast({ title: '已存在', icon: 'none' });
    }
  },
  onEmojiComponentTap(e) {
    const idx = e.currentTarget.dataset.idx;
    const overlays = [...this.data.overlays];
    const component = overlays[idx];
    console.log(component);
    this.addToEmojiList(component);
  },
  addemoji(){
    const emojiListlocal = wx.getStorageSync('localEmojis') || [];
    wx.chooseImage({
      count: 1,
      success: res => {
        const tempPath = res.tempFilePaths[0];
        wx.navigateTo({
          url: '/Mypages/editorimage/index',    // 跳到裁剪页 :contentReference[oaicite:0]{index=0}
          success: navRes => {
            // 通过 eventChannel 传递图片临时路径
            navRes.eventChannel.emit('initCrop', { imagePath: tempPath });
              // 2) 再监听裁剪页回传的 cropDone 事件
            navRes.eventChannel.on('cropDone', ({ cropPath }) => {
            // 收到裁剪好的图，获取它的尺寸并居中展示
              const newEmoji = { src: cropPath };
              emojiListlocal.unshift(newEmoji);
            
               wx.setStorageSync('localEmojis', emojiListlocal);
               wx.showToast({ title: '已添加到表情包' });
               this.setData({emojiList:[...this.data.emojiList,newEmoji]});
            
          });
        }
      });
    }
  });
  },
  clearAllEmojis() {
    wx.removeStorageSync('localEmojis'); // 清除缓存
    //this.setData({
      //emojiList: this.data.emojiList.filter(item => !item.src.startsWith('wxfile://')) // 只保留非本地图片
    //});
    wx.showToast({ title: '已清空自定义表情' });
  },
  // 长按显示删除按钮
  onEmojiDelet(e) {
    const index = e.currentTarget.dataset.index;
    const emojiList = this.data.emojiList;
    
  
  },

  onEmojiLongPress(e) {
    e.stopPropagation && e.stopPropagation(); // 如果存在则调用
    const index = e.currentTarget.dataset.index;
    const emojiList = this.data.emojiList;
    const itemToDelete = emojiList[index];
    wx.showModal({
      title: '删除表情包',
      content: '是否删除表情包？',
      success: res => {
        if (res.confirm) {


    // 从 emojiList 中删除该项
    emojiList.splice(index, 1);
  
    // 从 localEmojis 中也删除对应项
    let localEmojis = wx.getStorageSync('localEmojis') || [];
    localEmojis = localEmojis.filter(item => item.src !== itemToDelete.src);
    wx.setStorageSync('localEmojis', localEmojis);
  
    this.setData({ emojiList });
    wx.showToast({ title: '已删除' });
  }
  else{
     // 点击取消，隐藏删除按钮
     emojiList[index].showDelete = false;
     this.setData({ emojiList });
  }
}
})
  },
  
  playBreathingHint(cycles = 3) {
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in-out'
    });

    let fadeIn = true;
    let count = 0;

    this.breathingTimer = setInterval(() => {
      if (fadeIn) {
        animation.opacity(1).step();
      } else {
        animation.opacity(0.2).step();
        count++;
        if (count >= cycles) {
          clearInterval(this.breathingTimer);
          this.setData({ showHint: false }); // 隐藏提示
        }
      }

      this.setData({
        fadeAnimation: animation.export()
      });

      fadeIn = !fadeIn;
    }, 1000);
  },

  onUnload() {
    if (this.breathingTimer) clearInterval(this.breathingTimer);
  },
  onShareAppMessage() {
    return {
      title: this.data.nickName+'的分享',
      path: `/Mypages/editorH/index?id=${this.data.id}&from=share`,
      imageUrl: this.data.backgroundFileID // 可选：自定义封面图
    };
  },
  openPopup(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      showIndex:index,
      hideCanvas: true 
    })
  },
  closePopup() {
   
    this.setData({
      showIndex: '-1',
      hideCanvas: false
    }, () => {
      // 重新绘制连接线
      this.drawConnections();
    });
  },
  

  // 背景触摸开始
  touchstartBg(e) {
    // 只有在没有选中组件时才能拖拽背景
    if (this.data.selectedOverlayIdx !== null) {
      return;
    }
    
    this.setData({
      startX: e.touches[0].pageX
    });
  },

  // 背景触摸移动
  touchmoveBg(e) {
    // 只有在没有选中组件时才能拖拽背景
    if (this.data.selectedOverlayIdx !== null) {
      return;
    }

    const deltaX = e.touches[0].pageX - this.data.startX;
    let newOffsetX = this.data.offsetX + deltaX;

    const { screenW, displayW } = this.data;
    const maxOffset = 0;
    const minOffset = screenW - displayW;
    if (newOffsetX > 0) {
      newOffsetX = 0;  // 不能超出左侧
    }
    if (newOffsetX < screenW - displayW) {
      newOffsetX = screenW - displayW;  // 不能超出右侧
    }
  
    // 限制偏移范围
    //newOffsetX = Math.max(minOffset, Math.min(maxOffset, newOffsetX));

    this.setData({
      offsetX: newOffsetX,
      startX: e.touches[0].pageX
    });
  },

  // 背景点击 - 取消选中
  onBgTap(e) {
    // 取消选中和编辑状态
    // 如果正在编辑，先完成编辑
  if (this.data.editingIdx !== null) {
    this.onTextBlur();
  }
    this.setData({
      selectedOverlayIdx: null,
      draggingIdx:null,
      editingIdx: null
    });
  },

  

  onOverlayTap(e) {
    const idx = e.currentTarget.dataset.idx;
    console.log(idx);
    // 阻止事件冒泡，确保只选中不触发背景拖动
    this.setData({
      selectedOverlayIdx: idx,
      draggingIdx: null
    });
  },

 

  // 修复的 startDragOverlay 函数
  startDragOverlay(e) {
 // 如果在删除连线模式下，执行删除连线操作
 if (this.data.isDeleteConnectionMode) {
  this.deleteComponentConnections(e);
  return;
}

    // 如果在连线模式下，优先处理连线逻辑
  if (this.data.isConnectingMode) {
    if (this.handleOverlayTapForConnection(e)) {
      return; // 连线处理完成，不执行拖拽
    }
  }
    const idx = parseInt(e.currentTarget.dataset.idx);
    console.log('解析的索引:', idx);
    
    if (isNaN(idx)) {
      console.error('索引解析失败 - dataset.index:', e.currentTarget.dataset.index);
      return;
    }
    
    const now = Date.now();
       // 清除之前的定时器
       if (this.data.tapTimer) {
        clearTimeout(this.data.tapTimer);
      }
      if (this.data.longPressTimer) {
        clearTimeout(this.data.longPressTimer);
      }
    
     // 检测双击
  if (this.lastTapTime && (now - this.lastTapTime) < 300) {
    console.log('检测到双击，进入编辑模式:', idx);
    clearTimeout(this.singleTapTimer); // 清掉单击定时器，避免误触
    this. handleDoubleTap(idx);
    this.lastTapTime = 0; // 重置，避免连续触发
    return;
  }

  // 单击（先设置定时器，延迟判断是否为双击）
  this.lastTapTime = now;
  this.singleTapTimer = setTimeout(() => {
    console.log('检测到单击，开始拖动:', idx);
    // 保存开始拖动时的状态
    const touch = e.touches[0];
    const overlays = [...this.data.overlays];
    const overlay = overlays[idx];
    if (!overlay) return;
    // 处理可能的字符串数据
   
    overlay.left = parseFloat(overlay.left) || 0;
    overlay.top = parseFloat(overlay.top) || 0;
    const startLeft = isNaN(overlay.left) ? 0 : overlay.left;
    const startTop = isNaN(overlay.top) ? 0 : overlay.top;
    this.dragStartInfo = {
      startTouchX: touch.pageX,
      startTouchY: touch.pageY,
      startLeft,
      startTop
    };
   
    
    this.setData({
      selectedOverlayIdx: idx,
      draggingIdx:idx,
      lastTouch: {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      },
      isDragging: true,
      isLongPress: false
    });
  }, 300); // 300ms内未检测到第二次点击 → 认定为单击
   console.log('开始',this.data.lastTouch);

    
    // 设置长按定时器
    const longPressTimer = setTimeout(() => {
     console.log('长按定时器触发，索引:', idx);
     this.handleLongPress(idx);
    }, 500);
  
    this.setData({ longPressTimer });
  },
  // 组件触摸移动
  moveDragOverlay(e) {
    const idx = this.data.draggingIdx;
    if (idx == null || !this.data.isDragging) return;
    const touch = e.touches[0];
    const offsetX = touch.pageX -  this.dragStartInfo.startTouchX;
    const offsetY = touch.pageY -  this.dragStartInfo.startTouchY;
    
    
// 更新组件位置
    let newLeft = this.dragStartInfo.startLeft + offsetX;
    let newTop =this.dragStartInfo.startTop+ offsetY;
    
  
    newTop = parseFloat(newTop) || 0;
  
    const overlays = [...this.data.overlays];
    const overlay = overlays[idx];
    if (!overlay) return;
    const { screenW, edgeThreshold } = this.data;
    
    // 检测是否在左边缘
    if (touch.pageX< edgeThreshold) {
      this.startAutoScroll('left');
    }
    // 检测是否在右边缘
    else if (touch.pageX > screenW - edgeThreshold) {
      this.startAutoScroll('right');
    }
    // 不在边缘，停止滚动
    else {
      this.stopAutoScroll();
    }
    // 边界约束
    const elemW = overlay.width || overlay._origWidth || 80;
    const elemH = overlay.height || overlay._origHeight || 40;
    const maxLeft = this.data.displayW - elemW;
    const maxTop = this.data.screenH - elemH;
    
    newLeft = Math.max(0, Math.min(maxLeft, newLeft));
    newTop = Math.max(0, Math.min(maxTop, newTop));
    if (isNaN(newLeft)) newLeft = 0;
    if (isNaN(newTop)) newTop = 0;
    overlay.left = newLeft;
    overlay.top = newTop;
    //this.data.lastTouch.x = e.touches[0].pageX;    
    //this.data.lastTouch.y = e.touches[0].pageY;    
    
    const currentTouch = {
      x: touch.pageX,
      y: touch.pageY
    };
         // 最后一起更新 overlays 和 lastTouch    
    //this.setData({       overlays,       lastTouch: currentTouch    });
    this.setData({ overlays,lastTouch: currentTouch  }, () => {
      // 位置更新后重新绘制连接线
      this.drawConnections();
    });
  

 
    // 更新触摸位置
   
  },

  // 组件触摸结束
  endDragOverlay(e) {
    
    
    const idx = parseInt(e.currentTarget.dataset.idx);
    const now = Date.now();
    const touchDuration = now - this.data.tapStartTime;

    // 清除定时器
    if (this.data.longPressTimer) {
      clearTimeout(this.data.longPressTimer);
      this.setData({ longPressTimer: null });
    }

    // 停止自动滚动
    this.stopAutoScroll();

    // 如果是拖拽状态，结束拖拽
    if (this.data.isDragging) {
      this.setData({
        draggingIdx: null,
        isDragging: false
      });
      return;
    }

    // 如果是长按，不处理点击
    if (this.data.isLongPress) {
     this.setData({ isLongPress: false });
    return;
    }

    // 处理点击事件（短按）
    if (touchDuration < 500) {
      this.handleTap(idx);
    }
  },
  handleTap(idx) {
    // 如果在连线模式
    if (this.data.isConnectingMode) {
      this.handleConnectionTap(idx);
      return;
    }
    const now = Date.now();
    
    // 增加点击次数
   this.data.tapCount++;
    
    if (this.data.tapCount === 1) {
      // 第一次点击，等待300ms判断是否有第二次点击
      const tapTimer = setTimeout(() => {
        // 单击处理
        this.handleSingleTap(idx);
        this.data.tapCount = 0;
      }, 300);
      
      this.setData({ tapTimer });
      
    } else if (this.data.tapCount === 2) {
      // 双击处理
      if (this.data.tapTimer) {
        clearTimeout(this.data.tapTimer);
      }
      this.handleDoubleTap(idx);
      this.data.tapCount = 0;
    }
  },

  // 单击处理 - 选中组件
  handleSingleTap(idx) {
    console.log('单击选中组件:', idx);
    this.setData({
      selectedOverlayIdx: idx,
      editingIdx: null // 退出编辑状态
    });
  },

  // 双击处理 - 文字组件进入编辑状态
  handleDoubleTap(idx) {
    const overlay = this.data.overlays[idx];
  if (overlay && overlay.type === 'text') {
    console.log('Double tap edit text component:', idx);
    this.setData({
      selectedOverlayIdx: idx,
      editingIdx: idx,
      textInput: overlay.text || '', // Initialize textInput with current text
      textInputLength: (overlay.text || '').length // Initialize length
    });
  }
  },

  // 长按处理 - 开始拖拽
  handleLongPress(idx) {
    console.log('长按开始拖拽:', idx);
    this.setData({
      selectedOverlayIdx: idx,
      draggingIdx: idx,
      editingIdx: null, // 退出编辑状态
      isDragging: true,
      isLongPress: true
    });
  },
  updateOverlayPosition(idx, deltaX, deltaY) {
    const overlays = [...this.data.overlays];
    const overlay = overlays[idx];
    
    if (!overlay) return;

    let newLeft = overlay.left + deltaX;
    let newTop = overlay.top + deltaY;

    // 边界约束
    const elemW = overlay.width || overlay._origWidth || 80;
    const elemH = overlay.height || overlay._origHeight || 40;
    const maxLeft = this.data.displayW - elemW;
    const maxTop = this.data.screenH - elemH;

    newLeft = Math.max(0, Math.min(maxLeft, newLeft));
    newTop = Math.max(0, Math.min(maxTop, newTop));

    overlay.left = newLeft;
    overlay.top = newTop;
    this.data.lastTouch.x = e.touches[0].pageX;    
    this.data.lastTouch.y = e.touches[0].pageY;       
         // 最后一起更新 overlays 和 lastTouch    
    this.setData({       overlays,       lastTouch: this.data.lastTouch     });
    
  },

  // =================== 边缘滚动处理 ===================

  // 检测边缘滚动
  checkEdgeScroll(touchX) {
    const { screenW, edgeThreshold } = this.data;
    
    // 检测是否在左边缘
    if (touchX < edgeThreshold) {
      this.startAutoScroll('left');
    }
    // 检测是否在右边缘
    else if (touchX > screenW - edgeThreshold) {
      this.startAutoScroll('right');
    }
    // 不在边缘，停止滚动
    else {
      this.stopAutoScroll();
    }
  },

  // 开始自动滚动
  startAutoScroll(direction, onComplete) {
    // 如果已经在滚动同一方向，不重复启动
    if (this.data.autoScrollTimer && this.data.scrollDirection === direction) {
      return;
    }
    // 停止之前的滚动
    this.stopAutoScroll('restart');
     // 保存回调函数
  this.autoScrollCallback = onComplete;
    const timer = setInterval(() => {
      this.performAutoScroll(direction);
    }, 16); // 约60fps

    this.setData({
      autoScrollTimer: timer,
      scrollDirection: direction,
      isAutoScrolling: true
    });
  },

  // 执行自动滚动
  performAutoScroll(direction) {
    const { offsetX, autoScrollSpeed, screenW, displayW } = this.data;
    let newOffsetX = offsetX;

    if (direction === 'left') {
      newOffsetX += autoScrollSpeed;
    } else if (direction === 'right') {
      newOffsetX -= autoScrollSpeed;
    }

    // 边界限制
    //const maxOffset = 0;
    //const minOffset = screenW - displayW;
    //newOffsetX = Math.max(minOffset, Math.min(maxOffset, newOffsetX));
    if (newOffsetX > 0) {
      newOffsetX = 0;  // 不能超出左侧
    }
    if (newOffsetX < screenW - displayW) {
      newOffsetX = screenW - displayW;  // 不能超出右侧
    }
     // ✅ 使用容差值避免浮点数精度问题
  const epsilon = 0.1;
  if (Math.abs(newOffsetX - offsetX) < epsilon) {
    console.log('到达边界,停止滚动', {
      newOffsetX,
      offsetX,
      diff: newOffsetX - offsetX
    });
    this.stopAutoScroll('reach-boundary');
    return;
  }

    // 关键修复：计算背景滚动的距离
  const scrollDelta = newOffsetX - offsetX;
  
  // 如果正在拖动组件，同步调整组件位置和拖动起始点
  if (this.data.draggingIdx != null && this.dragStartInfo) {
    const overlays = [...this.data.overlays];
    const overlay = overlays[this.data.draggingIdx];
    
    if (overlay) {
      const componentAdjustment = -scrollDelta;
      // 调整组件的绝对位置，让它在视觉上保持在相同位置
      overlay.left += componentAdjustment ;
      
      // 同时调整拖动起始点，保持相对关系
      this.dragStartInfo.startLeft += componentAdjustment ;
      
      // 边界约束
      const elemW = overlay.width || overlay._origWidth || 80;
      const maxLeft = this.data.displayW - elemW;
      overlay.left = Math.max(0, Math.min(maxLeft, overlay.left));
      
      console.log('自动滚动调整组件位置:', {
        direction,
        scrollDelta,
        oldLeft: overlay.left - scrollDelta,
        newLeft: overlay.left,
        startLeft: this.dragStartInfo.startLeft
      });
      
      // 更新组件位置
      this.setData({ overlays });
    }
  }
    this.setData({ offsetX: newOffsetX });
  },

  // 停止自动滚动
  stopAutoScroll(reason = 'unknown') {
    console.log('🚨 stopAutoScroll called:', reason)
    if (this.data.autoScrollTimer) {
     
      clearInterval(this.data.autoScrollTimer);
      
      this.setData({
        autoScrollTimer: null,
        scrollDirection: null,
        isAutoScrolling: false
      }, () => {
        console.log('✅ 滚动已停止');
        
        // 执行回调函数
        if (this.autoScrollCallback && typeof this.autoScrollCallback === 'function') {
          console.log('📞 执行滚动完成回调');
          this.autoScrollCallback();
          this.autoScrollCallback = null; // 执行后清空
        }
      });
    }
  },
// 文字组件内部滚动（不影响组件位置）
onTextScroll(e) {
 
  // 这里处理文字组件内部的滚动
  // 不需要额外逻辑，让scroll-view自己处理即可
},

  // =================== 文字编辑处理 ===================

  onTextInput(e) {
    let value = e.detail.value;
    
    // 限制连续空格：将多个连续空格替换为单个空格
    value = value.replace(/\s{2,}/g, ' ');
    
    // 长度限制
    if (value.length > this.data.maxTextLength) {
      value = value.substring(0, this.data.maxTextLength);
      wx.showToast({
        title: `最多输入${this.data.maxTextLength}字`,
        icon: 'none'
      });
    }

    this.setData({
      textInput: value,
      textInputLength: value.length
    });
    if (this.data.editingIdx !== null) {
      const overlays = [...this.data.overlays];
      const editingOverlay = overlays[this.data.editingIdx];
      console.log(overlays[this.data.editingIdx].width);
      if (editingOverlay && editingOverlay.type === 'text') {
        editingOverlay.text = value;
        editingOverlay.width = overlays[this.data.editingIdx].width;//this.getTextWidth(editingOverlay)
        editingOverlay.height = overlays[this.data.editingIdx].height;//this.getTextHeight(editingOverlay)
        
        // 根据文本内容自动调整大小（可选）
        //this.autoResizeTextBox(editingOverlay, value);
        
        this.setData({ overlays,editorW: editingOverlay.width,
          editorH: editingOverlay.height
        });
        console.log("大小"+this.data.editorW+this.data.editorH+"组件"+overlays[this.data.editingIdx].width+ overlays[this.data.editingIdx].height);
        console.log('文本实时保存:', {
          索引: this.data.editingIdx,
          文本: value,
          长度: value.length
        });
      }
    }
  },

  onTextBlur(e) {
    const idx = this.data.editingIdx;
    const newText = this.data.textInput;
    
    
    // 如果文本为空，删除这个组件
  if (this.data.editingIdx !== null) {
    const overlays = [...this.data.overlays];
    const editingOverlay = overlays[this.data.editingIdx];
    
    if (editingOverlay && !editingOverlay.text.trim()) {
      // 文本为空，删除组件
      overlays.splice(this.data.editingIdx, 1);
      
      this.setData({
        overlays,
        editingIdx: null,
        selectedOverlayIdx: null,
        textInput: '',
        textInputLength: 0
      });
      
      console.log('删除空文本组件');
    } else {
      // 退出编辑模式，保持选中状态
      this.setData({
    
        editingIdx: null,
        textInput: '',
        textInputLength: 0
      }, () => {
        // 重新绘制连接线
        this.drawConnections();
      });
      
      console.log('完成文本编辑，保存内容:', editingOverlay?.text);
    }
  }
  },
// 文字编辑完成
onTextEditComplete(e) {
  const idx = this.data.editingIdx;
  const newText = e.detail.value;
  
  if (idx !== null) {
    const overlays = [...this.data.overlays];
    if (overlays[idx]) {
      overlays[idx].text = newText;
      this.setData({ overlays });
    }
  }
},
 // =================== 连线功能 ===================

 startConnectMode() {
 
  this.setData({
    isConnectingMode: true,
    firstSelectedForConnect: null,
    firstSelectedPosition: null,
    selectedOverlayIdx: null // 清除当前选中状态

  });
  wx.showToast({
    title: '连线模式：请点击第一个组件',
    icon: 'none',
    duration: 2000
  });
   // 计算并显示所有组件的连接点
   this.calculateConnectionPoints();
},

exitConnectMode() {
  this.setData({
    isConnectingMode: false,
    firstSelectedForConnect: null,
    firstSelectedPosition: null,
    connectSquares: []
  });
},
// =================== 计算连接点位置 ===================
startDeleteConnectionMode() {
  if (this.data.connections.length === 0) {
    wx.showToast({
      title: '暂无连线可删除',
      icon: 'none'
    });
    return;
  }
  
  this.setData({
    isDeleteConnectionMode: true,
    selectedOverlayIdx: null,
    isConnectingMode: false
  });
  //wx.showToast({
  //  title: '删除连线模式：点击组件删除相关连线',
  //  icon: 'none',
   // duration: 2500
  //});
  
  // 重新绘制连接线（显示删除模式样式）
  this.drawConnections();
},

exitDeleteConnectionMode() {
  this.setData({
    isDeleteConnectionMode: false
  });
  // 重新绘制连接线（恢复正常样式）
  this.drawConnections();
},
// 删除组件相关的所有连线
deleteComponentConnections(e) {
  if (!this.data.isDeleteConnectionMode) return;
  
  const idx = parseInt(e.currentTarget.dataset.idx);
  const relatedConnections = this.data.connections.filter(conn => 
    conn.from === idx || conn.to === idx
  );
  
  if (relatedConnections.length === 0) {
    wx.showToast({
      title: '该组件无相关连线',
      icon: 'none'
    });
    return;
  }
  
  wx.showModal({
    title: '确认删除',
    content: `确定要删除与此组件相关的 ${relatedConnections.length} 条连线吗？`,
    success: (res) => {
      if (res.confirm) {
        // 删除相关连线
        const connections = this.data.connections.filter(conn => 
          conn.from !== idx && conn.to !== idx
        );
        
        this.setData({ connections }, () => {
          this.drawConnections();
          this.saveConnectionsToStorage(); // 保存到本地存储
        });
        
        wx.showToast({
          title: `已删除 ${relatedConnections.length} 条连线`,
          icon: 'success'
        });
        
        // 自动退出删除模式
        this.exitDeleteConnectionMode();
      }
    }
  });
},
calculateConnectionPoints() {
  const connectSquares = [];
  // 安全检查:确保 overlays 存在且是数组
  const overlays = this.data.overlays || [];
  
  if (!Array.isArray(overlays)) {
    console.error('overlays 不是数组:', overlays);
    this.setData({ connectSquares: [] });
    return;
  }
  overlays.forEach((overlay, index) => {
    // 安全检查:确保 overlay 对象存在
    if (!overlay) {
      console.warn(`overlay[${index}] 为空,跳过`);
      return;
    }
 
    console.log(`overlay[${index}]:`, {
      type: overlay.type,
      top: overlay.top,
      left: overlay.left,
      width: overlay.width,
      height: overlay.height
    });

    // 获取实际的宽高,为不同类型设置默认值
    let width, height;
    
    if (overlay.type === 'text') {
      width = overlay.width || overlay.textWidth || 100;
      height = overlay.height || overlay.textHeight || 30;
    } else if (overlay.type === 'image') {
      width = overlay.width || 130;
      height = overlay.height || 130;
    } else {
      width = overlay.width || 80;
      height = overlay.height || 40;
    }

    // 确保宽高是有效数字
    if (typeof width !== 'number' || isNaN(width) || width <= 0) {
      console.warn(`overlay[${index}] width 无效,使用默认值 80`);
      width = 80;
    }
    if (typeof height !== 'number' || isNaN(height) || height <= 0) {
      console.warn(`overlay[${index}] height 无效,使用默认值 40`);
      height = 40;
    }

    // 确保 left 和 top 是有效数字
    const left = typeof overlay.left === 'number' && !isNaN(overlay.left) ? overlay.left : 0;
    const top = typeof overlay.top === 'number' && !isNaN(overlay.top) ? overlay.top : 0;

    // 计算中心点和半宽高
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // 确保计算结果是有效数字
    if (isNaN(centerX) || isNaN(centerY)) {
      console.error(`overlay[${index}] 坐标计算失败:`, {
        left,
        top,
        width,
        height
      });
      return; // 跳过这个 overlay
    }

    // 为每个组件添加四个连接点(上下左右)
    connectSquares.push(
      // 上连接点
      { 
        left: centerX - 4, 
        top: top - 4, 
        overlayIndex: index, 
        position: 'top' 
      },
      // 下连接点
      { 
        left: centerX - 4, 
        top: top + height - 4, 
        overlayIndex: index, 
        position: 'bottom' 
      },
      // 左连接点
      { 
        left: left - 4, 
        top: centerY - 4, 
        overlayIndex: index, 
        position: 'left' 
      },
      // 右连接点
      { 
        left: left + width - 4, 
        top: centerY - 4, 
        overlayIndex: index, 
        position: 'right' 
      }
    );
  });

  console.log(`生成了 ${connectSquares.length} 个连接点`);
  this.setData({ connectSquares });
},
// =================== 连接点点击处理 ===================
getPositionName(position) {
  const names = {
    'top': '上',
    'bottom': '下',
    'left': '左',
    'right': '右'
  };
  return names[position] || position;
},
onConnectionPointTap(e) {
  if (!this.data.isConnectingMode) return;
  
  const { overlayIndex, position } = e.currentTarget.dataset;
  const idx = parseInt(overlayIndex);
  // 确保 overlayIndex 是有效数字

  const overlays = this.data.overlays || [];
  if (isNaN(idx) || idx < 0 || idx >= overlays.length) {
    console.error('无效的 overlayIndex:', overlayIndex, '当前 overlays 长度:', overlays.length);
    wx.showToast({
      title: '连接点数据错误',
      icon: 'none'
    });
    return;
  }
  if (!['top', 'bottom', 'left', 'right'].includes(position)) {
    console.error('无效的 position:', position);
    wx.showToast({
      title: '连接点位置错误',
      icon: 'none'
    });
    return;
  }
  if (this.data.firstSelectedForConnect === null) {
    // 选择第一个连接点
    this.setData({
      firstSelectedForConnect: idx,
      firstSelectedPosition: position
    });
    wx.showToast({
      title: `已选择起点(${this.getPositionName(position)})`,
      icon: 'none'
    });
  } else {
    // 选择第二个连接点，创建连线
    const firstIdx = this.data.firstSelectedForConnect;
    if (firstIdx === idx) {
      wx.showToast({
        title: '不能连接自身',
        icon: 'none'
      });
      return;
    }

     // 安全获取 connections 数组
     const connections = Array.isArray(this.data.connections) 
     ? [...this.data.connections] 
     : [];
    // 检查是否已存在相同的连线
    const existingConnection = connections.find(conn => 
      (conn.from === firstIdx && conn.to === idx && 
       conn.fromPosition === this.data.firstSelectedPosition && 
       conn.toPosition === position) ||
      (conn.from === idx && conn.to === firstIdx && 
       conn.fromPosition === position && 
       conn.toPosition === this.data.firstSelectedPosition)
    );

    if (existingConnection) {
      wx.showToast({
        title: '连线已存在',
        icon: 'none'
      });
    } else {
      connections.push({
        from: firstIdx,
        to: idx,
        fromPosition: this.data.firstSelectedPosition,
        toPosition: position,
        id: `${firstIdx}-${idx}-${Date.now()}`
      });
      this.setData({ connections }, () => {
        // 连线成功后重新绘制
        this.drawConnections();
      });
      wx.showToast({
        title: `连线成功: ${this.getPositionName(this.data.firstSelectedPosition)} → ${this.getPositionName(position)}`,
        icon: 'success'
      });
    }

    // 退出连线模式
    this.exitConnectMode();
  }
},

// =================== 处理组件点击（连线模式下） ===================

handleOverlayTapForConnection(e) {
  if (!this.data.isConnectingMode) {
    return false; // 不在连线模式，返回 false 让其他点击事件继续处理
  }
  
  const idx = parseInt(e.currentTarget.dataset.idx);
  this.handleConnectionTap(idx);
  return true; // 阻止其他点击事件
},
handleConnectionTap(idx) {
  if (this.data.firstSelectedForConnect === null) {
    // 选择第一个组件
    this.setData({
      firstSelectedForConnect: idx
    });
    wx.showToast({
      title: '请选择第二个组件',
      icon: 'none'
    });
  } else {
    // 选择第二个组件，创建连线
    const firstIdx = this.data.firstSelectedForConnect;
    if (firstIdx === idx) {
      wx.showToast({
        title: '不能连接自身',
        icon: 'none'
      });
      return;
    }

    const connections = [...this.data.connections];
    // 检查是否已存在连线
    const existingConnection = connections.find(conn => 
      (conn.from === firstIdx && conn.to === idx) ||
      (conn.from === idx && conn.to === firstIdx)
    );

    if (existingConnection) {
      wx.showToast({
        title: '连线已存在',
        icon: 'none'
      });
    } else {
      connections.push({
        from: firstIdx,
        to: idx,
        id: `${firstIdx}-${idx}-${Date.now()}`
      });
      this.setData({ connections }, () => {
        // 连线成功后重新绘制
        this.drawConnections();
      });
      wx.showToast({
        title: '连线成功',
        icon: 'success'
      });
    }

    // 退出连线模式
    this.exitConnectMode();
  }
},

deleteConnection1(connectionId) {
  const connections = this.data.connections.filter(conn => conn.id !== connectionId);
  this.setData({ connections }, () => {
    this.drawConnections();
  });
},
canvasInitPromise: null, 
 // ✅ 新增:检查 Canvas 元素是否存在
 checkCanvasElement() {
  return new Promise((resolve, reject) => {
    console.log('检查 Canvas 元素是否存在...');
    
    const query = wx.createSelectorQuery().in(this);
    query.select('#connectionCanvas')
      .boundingClientRect()
      .exec((res) => {
        console.log('Canvas 元素查询结果:', res);
        
        if (!res || !res[0]) {
          reject(new Error('Canvas 元素不存在 - 请检查 WXML 中是否有 id="connectionCanvas" 的 canvas 元素'));
          return;
        }
        
        if (res[0].width === 0 || res[0].height === 0) {
          console.warn('⚠️ Canvas 元素尺寸为 0:', res[0]);
          reject(new Error('Canvas 元素尺寸为 0 - 请检查 CSS 样式'));
          return;
        }
        
        console.log('✅ Canvas 元素存在,尺寸:', res[0].width, 'x', res[0].height);
        resolve();
      });
  });
},
// =================== 绘制连接线的方法 ===================
// 初始化 Canvas（只执行一次）
initCanvas() {
  if (this.data.canvasNode) return; // 已初始化则跳过
  if (this.canvasInitPromise) {
    console.log('Canvas 正在初始化中,等待...');
    return this.canvasInitPromise;
  }
  console.log('开始初始化 Canvas...');
    this.setData({ canvasInitializing: true });
        // 创建并保存 Promise
        this.canvasInitPromise = new Promise((resolve, reject) => {
          // 添加超时保护
          const timeout = setTimeout(() => {
            reject(new Error('Canvas 初始化超时'));
          }, 3000);  // 3秒超时
  const query = wx.createSelectorQuery().in(this);
  query.select('#connectionCanvas').fields({ node: true, size: true }).exec((res) => {
    clearTimeout(timeout);
    if (!res || !res[0]) {
  
      console.error('❌ Canvas 节点未找到');
      reject(new Error('Canvas 节点未找到'));
      return;
    }
    try {
    const canvas = res[0].node;
    const ctx = canvas.getContext('2d');
    const sysInfo = wx.getSystemInfoSync();
    const sysDpr = sysInfo.pixelRatio || 3;
    const dprs = [sysDpr, sysDpr - 1, 2, 1]
            .filter(d => d >= 1)
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .sort((a, b) => b - a); // 从高到低排序
    console.log('🔍 尝试 DPR 队列:', dprs);
    console.log ("dpr"+sysDpr);
    console.log("w"+this.data.displayW+"h"+this.data.displayH);
          let ok = false;
          let usedDpr = sysDpr;
          let lastError = null;

           // 第一阶段:直接尝试系统 DPR,不做 4096 检查
           console.log(`🧪 第一阶段:尝试系统 DPR=${sysDpr}`);
           try {
             canvas.width = 0;
             canvas.height = 0;
 
             const w = Math.floor(this.data.displayW * sysDpr);
             const h = Math.floor(this.data.displayH * sysDpr);
 
             console.log(`   Canvas 尺寸: ${w}x${h}`);
 
             canvas.width = w;
             canvas.height = h;
 
             // 重置变换矩阵并应用缩放
             ctx.setTransform(1, 0, 0, 1, 0, 0);
             ctx.scale(sysDpr, sysDpr);
 
             // 测试绘制(验证 Canvas 是否真正可用)
             ctx.fillStyle = 'rgba(0,0,0,0)';
             ctx.fillRect(0, 0, 1, 1);
 
             ok = true;
             usedDpr = sysDpr;
             console.log(`✅ 系统 DPR=${sysDpr} 初始化成功!`);
 
           } catch (e) {
             lastError = e;
             console.warn(`⚠️ 系统 DPR=${sysDpr} 初始化失败:`, e.message);
           }
 
           // 第二阶段:如果系统 DPR 失败,进行 4096 限制检查和降级
           if (!ok) {
             console.log('🔍 第二阶段:开始 4096 限制检查和 DPR 降级...');
 
             // 生成降级 DPR 队列
             const dprs = [sysDpr - 1, 2, 1]
               .filter(d => d >= 1 && d < sysDpr)
               .filter((v, i, arr) => arr.indexOf(v) === i)
               .sort((a, b) => b - a);
 
             console.log('   降级 DPR 队列:', dprs);
 
             // 尝试降级的 DPR
             for (let dpr of dprs) {
               try {
                 canvas.width = 0;
                 canvas.height = 0;
 
                 const w = Math.floor(this.data.displayW * dpr);
                 const h = Math.floor(this.data.displayH * dpr);
 
                 console.log(`   🧪 尝试 DPR=${dpr}, Canvas 尺寸: ${w}x${h}`);
 
                 // 现在才进行 4096 检查
                 if (w > 4096 || h > 4096) {
                   console.log(`   ⚠️ DPR=${dpr} 超出 4096 限制,跳过`);
                   continue;
                 }
 
                 canvas.width = w;
                 canvas.height = h;
 
                 ctx.setTransform(1, 0, 0, 1, 0, 0);
                 ctx.scale(dpr, dpr);
 
                 // 测试绘制
                 ctx.fillStyle = 'rgba(0,0,0,0)';
                 ctx.fillRect(0, 0, 1, 1);
 
                 ok = true;
                 usedDpr = dpr;
                 console.log(`✅ DPR=${dpr} 初始化成功!`);
                 break;
 
               } catch (e) {
                 lastError = e;
                 console.warn(`   ⚠️ DPR=${dpr} 初始化失败:`, e.message);
               }
             }
           }
 
           // 所有尝试都失败
           if (!ok) {
             const errorMsg = lastError ? lastError.message : '未知错误';
             console.error('❌ Canvas 初始化彻底失败,已尝试所有 DPR:', errorMsg);
             this.setData({ canvasInitializing: false });
             throw new Error(`Canvas 初始化失败: ${errorMsg}`);
           }
 
           // 保存成功的实例
           this.canvasNode = canvas;
           this.canvasContext = ctx;
           this.canvasDpr = usedDpr;
 
           this.setData({
             canvasReady: true,
             canvasInitializing: false,
             canvasDpr: usedDpr
           });
 
           console.log('🎉 Canvas 初始化完成!', {
             使用DPR: usedDpr,
             Canvas尺寸: `${canvas.width}x${canvas.height}`,
             显示尺寸: `${this.data.displayW}x${this.data.displayH}`,
             是否降级: usedDpr !== sysDpr ? '是' : '否'
           });
 
           resolve();
 
         } catch (e) {
           console.error('❌ Canvas 初始化异常:', e);
           this.setData({ canvasInitializing: false });
           reject(e);
         }
       });
   }).finally(() => {
     // 清理 Promise 引用
     this.canvasInitPromise = null;
   });

  return this.canvasInitPromise;},

async drawConnections() {
   // 第一步：检查 Canvas 是否已初始化
   if (!this.canvasContext || !this.canvasNode) {
    console.warn('Canvas 未初始化，跳过绘制');
    await this.initCanvas()
  
  }

  // 第二步：安全获取数据
  const connections = this.data?.connections;
  const overlays = this.data?.overlays;

  // 检查数据是否存在
  if (!connections || !overlays) {
    console.warn('connections 或 overlays 数据不存在');
    return;
  }

  // 检查是否为数组
  if (!Array.isArray(connections)) {
    console.error('connections 不是数组:', typeof connections);
    return;
  }

  if (!Array.isArray(overlays)) {
    console.error('overlays 不是数组:', typeof overlays);
    return;
  }

  // 如果没有连线，清空画布后返回
  if (connections.length === 0) {
    const ctx = this.canvasContext;
    ctx.clearRect(0, 0, this.data.displayW || 0, this.data.displayH || 0);
    console.log('没有连线需要绘制');
    this.setData({ deleteButtonPositions: [] });
    return;
  }
 
  
    const ctx = this.canvasContext;
    

    // 清除之前的绘制
    ctx.clearRect(0, 0, this.data.displayW, this.data.displayH);
    // 计算删除按钮位置
    const buttonPositions = [];
    // 绘制所有连接线
    connections.forEach((connection, index) => {
      
      const fromOverlay = this.data.overlays[connection.from];
      const toOverlay = this.data.overlays[connection.to];
      
      if (!fromOverlay || !toOverlay) 
      {
        console.log("没有连接点");
        return;
      };
      
      // 根据连接点位置计算精确坐标
      const fromPoint = this.getConnectionPointCoords(fromOverlay, connection.fromPosition);
      const toPoint = this.getConnectionPointCoords(toOverlay, connection.toPosition);
      if (!fromPoint || !toPoint) {
        console.warn(`连线 ${index} 的坐标计算失败`);
        return;
      }

      // 验证坐标是否有效
      if (isNaN(fromPoint.x) || isNaN(fromPoint.y) || 
          isNaN(toPoint.x) || isNaN(toPoint.y)) {
        console.warn(`连线 ${index} 的坐标包含 NaN:`, { fromPoint, toPoint });
        return;
      }
       // 计算中点位置（用于放置删除按钮）
       const midX = (fromPoint.x + toPoint.x) / 2;
       const midY = (fromPoint.y + toPoint.y) / 2;
       
       buttonPositions.push({
         x: midX,
         y: midY
       });
      // 绘制连接线
      this.drawConnectionLine(ctx, fromPoint.x, fromPoint.y, toPoint.x, toPoint.y, connection, index);
    });
    // 更新删除按钮位置
    this.setData({ deleteButtonPositions: buttonPositions });
  
},

// 根据位置获取连接点坐标
getConnectionPointCoords(overlay, position) {
  if (!overlay) {
    console.error('overlay 为空');
    return null;
  }

  if (!position || !['top', 'bottom', 'left', 'right'].includes(position)) {
    console.error('position 无效:', position);
    return null;
  }
  
 // 获取组件的实际尺寸
 let width, height;
  console.log(overlay.type,overlay.width ,overlay.height);
 if (overlay.type === 'text') {
  width = overlay.width || this.getTextWidth(overlay) || 80;
   height = overlay.height || this.getTextHeight(overlay) || 40;
   console.log(overlay.type,width,height);
  
   switch(position) {
    case 'top':
     return { x: overlay.left + width / 2, y: overlay.top };
   case 'bottom':
     return { x: overlay.left + width / 2, y: overlay.top + height };
    case 'left':
      return { x: overlay.left, y: overlay.top + height / 2 };
    case 'right':
     return { x: overlay.left + width, y: overlay.top + height / 2 };
    default:
      return { x: overlay.left , y: overlay.top  };
  }
 } else {
   width = overlay.width || 80;
   height = overlay.height || 40;
 
  switch(position) {
    case 'top':
      return { x: overlay.left + width / 2, y: overlay.top };
    case 'bottom':
      return { x: overlay.left + width / 2, y: overlay.top + height };
    case 'left':
      return { x: overlay.left, y: overlay.top + height / 2 };
    case 'right':
      return { x: overlay.left + width, y: overlay.top + height / 2 };
    default:
      return { x: overlay.left , y: overlay.top + height / 2 };
  }
}
},

// 计算文字组件的实际宽度
getTextWidth(overlay) {
  if (overlay.type !== 'text' || !overlay.text) return null;
  
  // 简单估算：每个字符按字体大小计算宽度
  const fontSize = overlay.fontSize || 20;
  const text = overlay.text || '';
  const chineseCharCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const otherCharCount = text.length - chineseCharCount;
  
  // 中文字符按字体大小计算，英文字符按字体大小的0.6倍计算
  const estimatedWidth = chineseCharCount * fontSize + otherCharCount * fontSize * 0.6;
  return Math.max(estimatedWidth + 20, 60); // 最小宽度60px，加20px内边距
},

// 计算文字组件的实际高度
getTextHeight(overlay) {
  if (overlay.type !== 'text' || !overlay.text) return null;
  
  const fontSize = overlay.fontSize || 20;
  const text = overlay.text || '';
  const lines = text.split('\n').length;
  
  return Math.max(lines * fontSize * 1.4 + 16, 30); // 行高1.4倍，加16px内边距，最小高度30px
},

// 更新组件尺寸（用于文字组件自适应）
updateOverlaySize(idx) {
  const overlays = [...this.data.overlays];
  const overlay = overlays[idx];
  
  if (overlay && overlay.type === 'text') {
    const newWidth = this.getTextWidth(overlay);
    const newHeight = this.getTextHeight(overlay);
    
    if (newWidth && newHeight) {
      overlay.width = newWidth;
      overlay.height = newHeight;
      
      this.setData({ overlays }, () => {
        // 重新绘制连接线
        this.drawConnections();
      });
    }
  }
},

// 绘制单条连接线（增加点击检测区域）
drawConnectionLine(ctx, fromX, fromY, toX, toY, connection, index) {
  // 设置线 
  const isDeleteMode = this.data.isDeleteConnectionMode;
  const isHighlighted = this.data.highlightedConnectionIndex === index;
   // 根据状态设置线条颜色
   let strokeColor =  connection.color || "rgba(200, 200, 200, 1)"
   if (isHighlighted&&isDeleteMode) {
     strokeColor = "#ff4d4f"; // 高亮显示为红色
   } // else if (isColorSelected) {
    // 颜色选择时稍微亮一点
   // strokeColor = connection.color || '#1890ff';
  //} 
  else if (isDeleteMode) {
     strokeColor = "rgba(200, 200, 200, 1)";
   }
   if (isHighlighted ) {
    // 高亮时加粗但保持颜色
    ctx.lineWidth = 5;
  } else {
    ctx.lineWidth = 3;
  }
  ctx.strokeStyle = strokeColor ; // 浅灰 + 半透明
  //ctx.strokeStyle = isDeleteMode ? '#ff4d4f' : '#1890ff';
  ctx.lineWidth = isHighlighted ? 5 : (isDeleteMode ? 4 : 3);
  //ctx.lineWidth = isDeleteMode ? 4 : 3;
  ctx.lineCap = 'round';
  ctx.setLineDash( [5, 5]);
  // 计算折角点
  let cornerX, cornerY;
  
  // 判断主要方向并计算折角点
  const deltaX = Math.abs(toX - fromX);
  const deltaY = Math.abs(toY - fromY);
  
  if (deltaX > deltaY) {
    // 水平方向为主：先水平后垂直
    cornerX = toX;
    cornerY = fromY;
  } else {
    // 垂直方向为主：先垂直后水平
    cornerX = fromX;
    cornerY = toY;
  }
  // 绘制主线条
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(cornerX, cornerY); // 到折角点
  ctx.lineTo(toX, toY);         // 到终点
  ctx.stroke();
 
  
  // 计算箭头方向（基于最后一段线的方向）
  let arrowAngle;
  if (cornerX === toX) {
    // 最后一段是垂直线
    arrowAngle = toY > cornerY ? Math.PI / 2 : -Math.PI / 2;
  } else {
    // 最后一段是水平线
    arrowAngle = toX > cornerX ? 0 : Math.PI;
  }

  // 绘制箭头
 // this.drawArrow(ctx, toX, toY, arrowAngle,strokeColor, isDeleteMode);
  // 绘制起点和终点圆圈
 // this.drawConnectionDot(ctx, fromX, fromY,  strokeColor );
//  this.drawConnectionDot(ctx, toX, toY,  strokeColor);
    // 绘制坐标文字
    //ctx.fillStyle = '#000';
    //ctx.font = '10px sans-serif';
    //ctx.fillText(`(${Math.round(fromX)},${Math.round(fromY)})`, fromX + 10, fromY);
   // ctx.fillText(`(${Math.round(toX)},${Math.round(toY)})`, toX + 10, toY);
},




// 绘制箭头
drawArrow(ctx, x, y, angle,  color,isDeleteMode = false) {
  const arrowLength = 12;
  const arrowAngle = Math.PI / 6;
  
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x - arrowLength * Math.cos(angle - arrowAngle),
    y - arrowLength * Math.sin(angle - arrowAngle)
  );
  ctx.lineTo(
    x - arrowLength * Math.cos(angle + arrowAngle),
    y - arrowLength * Math.sin(angle + arrowAngle)
  );
  ctx.closePath();
  ctx.fill();
},
// 删除连线
deleteConnection(index) {
  const connections = [...this.data.connections];
  connections.splice(index, 1);
  
  this.setData({ 
    connections,
    highlightedConnectionIndex: null // 清除高亮
  }, () => {
    // 保存到本地存储
    wx.setStorageSync('connections', connections);
    
    // 重新绘制
    this.drawConnections();
    
    wx.showToast({
      title: '已删除连线',
      icon: 'success',
      duration: 1500
    });
  });
},
// 点击删除按钮
onDeleteButtonTap(e) {
  const index = e.currentTarget.dataset.index;
  
  console.log("✅ 点击删除按钮，索引:", index);
  
  // 高亮显示被选中的连线
  this.setData({ 
    highlightedConnectionIndex: index 
  }, () => {
    this.drawConnections();
    
    // 弹出确认对话框
    wx.showModal({
      title: '删除连线',
      content: '确定要删除这条连线吗？',
      confirmText: '删除',
      confirmColor: '#ff4d4f',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          console.log("✅ 确认删除");
          this.deleteConnection(index);
        } else {
          console.log("❌ 取消删除");
          // 取消时取消高亮
          this.setData({ 
            highlightedConnectionIndex: null 
          }, () => {
            this.drawConnections();
          });
        }
      }
    });
  });
},




// 绘制连接点
drawConnectionDot(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
},


// 高亮显示连线
highlightConnection(index) {
  this.setData({
    highlightedConnectionIndex: index
  }, () => {
    this.drawConnections();
  });
},

// 选择颜色（修复版）
onSelectColor(e) {
  const connIndex = e.currentTarget.dataset.connIndex; // 使用 connIndex 而不是 index
  const color = e.currentTarget.dataset.color;
  
  console.log("✅ 选择颜色:", { 
    连线索引: connIndex, 
    颜色: color,
    当前连线: this.data.connections[connIndex]
  });
  
  // 验证索引有效性
  if (connIndex === undefined || connIndex === null) {
    console.error("❌ 连线索引无效");
    return;
  }
  
  const connections = [...this.data.connections];
  
  if (!connections[connIndex]) {
    console.error("❌ 连线不存在:", connIndex);
    return;
  }
  
  // 记录旧颜色
  const oldColor = connections[connIndex].color || '#1890ff';
  console.log(`更改连线 ${connIndex} 的颜色: ${oldColor} -> ${color}`);
  
  // 更新颜色
  connections[connIndex].color = color;
  
  this.setData({ 
    connections,
    selectedColorConnectionIndex: null, // 选择后关闭面板
    highlightedConnectionIndex: null
  }, () => {
    // 保存到本地存储
    wx.setStorageSync('connections', connections);
    
    // 重新绘制
    this.drawConnections();
    
    console.log("✅ 颜色更改成功，新连线数据:", connections[connIndex]);
    
    wx.showToast({
      title: '颜色已更改',
      icon: 'success',
      duration: 1000
    });
  });
},

// 点击颜色按钮
onColorButtonTap(e) {
  const index = e.currentTarget.dataset.index;
  
  console.log("✅ 点击颜色按钮，连线索引:", index, "连线数据:", this.data.connections[index]);
  
  // 验证索引
  if (index === undefined || index === null || !this.data.connections[index]) {
    console.error("❌ 无效的连线索引:", index);
    return;
  }
  
  // 切换选中状态
  const newIndex = this.data.selectedColorConnectionIndex === index ? null : index;
  
  this.setData({ 
    selectedColorConnectionIndex: newIndex 
  }, () => {
    // 如果选中了，高亮显示连线
    if (newIndex !== null) {
      this.highlightConnection(newIndex);
    } else {
      this.drawConnections();
    }
  });
},


// 关闭颜色选择器
closeColorPicker(e) {
  console.log("关闭颜色选择器");
  
  this.setData({ 
    selectedColorConnectionIndex: null,
    highlightedConnectionIndex: null
  }, () => {
    this.drawConnections();
  });
},

// 阻止事件冒泡
stopPropagation(e) {
  // 阻止点击面板时关闭
},
// =================== 清空所有连接线 ===================

clearAllConnections() {
  wx.showModal({
    title: '确认清空',
    content: '确定要清空所有连接线吗？',
    success: (res) => {
      if (res.confirm) {
        this.setData({
          connections: [],
          isConnectingMode: false,
          firstSelectedForConnect: null,
          connectSquares: []
        });
        // 清空画布
        const query = wx.createSelectorQuery();
        query.select('#connectionCanvas').fields({ node: true, size: true }).exec((res) => {
          if (res[0] && res[0].node) {
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, this.data.displayW, this.data.displayH);
          }
        });
        wx.showToast({
          title: '已清空所有连线',
          icon: 'success'
        });
      }
    }
  });
},
// 保存连线信息到本地存储
saveConnectionsToStorage() {
  try {
    const sceneId = this.data.id || 'default_scene';
    const connectionsData = {
      connections: this.data.connections,
      overlaysCount: this.data.overlays.length,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    wx.setStorageSync(`scene_connections_${sceneId}`, connectionsData);
    console.log('连线数据已保存到本地');
  } catch (error) {
    console.error('保存连线数据失败:', error);
  }
},
// 从本地存储加载连线信息
loadConnectionsFromStorage() {
  try {
    const sceneId = this.data.id || 'default_scene';
    const connectionsData = wx.getStorageSync(`scene_connections_${sceneId}`);
    
    if (connectionsData && connectionsData.connections) {
      // 验证连线数据的有效性
      const validConnections = connectionsData.connections.filter(conn => {
        return conn.from < this.data.overlays.length && 
               conn.to < this.data.overlays.length &&
               this.data.overlays[conn.from] && 
               this.data.overlays[conn.to];
      });
      
      this.setData({ 
        connections: validConnections 
      }, () => {
        if (validConnections.length > 0) {
          setTimeout(() => {
            this.drawConnections();
          }, 500); // 延迟绘制确保组件已渲染
        }
      });
      
      console.log(`已加载 ${validConnections.length} 条连线`);
    }
  } catch (error) {
    console.error('加载连线数据失败:', error);
  }
},
 /**
   * 切换横竖屏模式（预览/编辑模式）
   */
  async toggleOrientation() {
    const { isLandscape } = this.data;
    
    if (!isLandscape) {
      // 切换到横屏预览模式 - 生成截图
      await this.generatePreviewImage();
    } else {
      // 切换回竖屏编辑模式
      this.setData({
        isLandscape: false,
        previewImagePath: '',
        isGeneratingPreview: false
      });
    }

    // 提供触觉反馈
    wx.vibrateShort({ type: 'light' });

    // 显示提示
    wx.showToast({
      title: !isLandscape ? '已切换到预览模式' : '已切换到编辑模式',
      icon: 'none',
      duration: 1500
    });
  },

  /**
   * 生成预览图片
   */
  async generatePreviewImage() {
    this.setData({ isGeneratingPreview: true });

    try {
      // 获取Canvas上下文
      // 延迟确保DOM完全渲染
      await this.delay(100);
      const canvas = await this.getCanvasContext('screenshotCanvas');
      const ctx = canvas.getContext('2d');
      // 获取设备像素比
      const dpr = wx.getSystemInfoSync().pixelRatio;
      // 设置Canvas尺寸
      canvas.width = this.data.displayW;
      canvas.height = this.data.displayH;
      ctx.scale(dpr, dpr);
      
      console.log('Canvas尺寸设置:', canvas.width, canvas.height);
      
      // 先绘制白色背景，确保Canvas不为空
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, this.data.displayW, this.data.displayH);
      
      // 绘制背景图
      if (this.data.imagePath) {
        await this.drawBackgroundImage(ctx, canvas);
      }
      
      // 绘制所有覆盖层组件
      await this.drawAllOverlays(ctx,canvas);
      
      // 绘制连接线
     //await this.drawConnectionsOnCanvas(ctx);
      // 确保所有绘制操作完成
      await this.delay(200);
      
      // 确保Canvas节点存在
      if (!canvas) {
         throw new Error('无法获取Canvas节点');
      }
      // 将Canvas转换为临时图片
      const tempFilePath = await this.canvasToTempFilePath(canvas);
      // 使用类似bg方法的逻辑来适配横屏预览
     // 显示预览图片
    this.showPreviewImage(tempFilePath);
      //this.adaptPreviewImage(tempFilePath);
      // 切换到横屏模式并显示预览图
      //this.setData({
       // isLandscape: true,
       // previewImagePath: tempFilePath,
       // isGeneratingPreview: false
      //});
      //await this.savePreviewImage();
    } catch (error) {
      console.error('生成预览图失败:', error);
      wx.showToast({
        title: '生成预览失败',
        icon: 'error',
        duration: 2000
      });
      this.setData({
        isGeneratingPreview: false
      });
    }
  },
 /**
   * 适配预览图片显示（仿照bg方法）
   */
  adaptPreviewImage(imagePath) {
    wx.getImageInfo({
      src: imagePath,
      success: imgInfo => {
        const sysInfo = wx.getSystemInfoSync();
        const screenH = sysInfo.windowHeight;
        const screenW = sysInfo.windowWidth;
        
        // 横屏模式下的适配逻辑
        const scale = screenW / imgInfo.height;
        const previewDisplayW = imgInfo.width * scale;
        const previewDisplayH = screenW;
        let previewOffsetX = 0;
        
        // 只有在屏幕高度 > 图片适配后宽度时才需要偏移
        if (screenH > previewDisplayW) {
          previewOffsetX = (screenH - previewDisplayW) / 2;
        }
        
        // 切换到横屏模式并设置预览图参数
        this.setData({
          isLandscape: true,
          previewImagePath: imagePath,
          previewDisplayW,
          previewDisplayH,
          previewOffsetX,
          isGeneratingPreview: false
        });
        console.log(previewDisplayW,
          previewDisplayH,
          previewOffsetX,imagePath);
      },
      fail: (error) => {
        console.error('获取预览图信息失败:', error);
        this.setData({
          isGeneratingPreview: false,
          previewError: true
        });
      }
    });
  },
  /**
   * 重新生成预览图
   */
  retryGeneratePreview() {
    this.setData({ isLandscape: false }, () => {
      setTimeout(() => {
        this.generatePreviewImage();
      }, 100);
    });
  },

  /**
   * 获取Canvas上下文
   */
  getCanvasContext(canvasId) {
    return new Promise((resolve) => {
      const query = wx.createSelectorQuery().in(this);
      query.select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res && res[0] && res[0].node) {
          const canvas = res[0].node;
          console.log('Canvas节点获取成功:', canvas.width, 'x', canvas.height);
          resolve(canvas);
        } else {
          console.error('Canvas节点获取失败:', res);
          reject(new Error('Canvas节点获取失败'));
        }
        });
    });
  },
   /**
   * 绘制背景图
   */
  drawBackgroundImage(ctx, canvas) {
    return new Promise((resolve) => {
      if (!this.data.imagePath) {
        resolve();
        return;
      }

      const img = canvas.createImage();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width / wx.getSystemInfoSync().pixelRatio, canvas.height / wx.getSystemInfoSync().pixelRatio);
        resolve();
      };
      img.onerror = () => {
        console.warn('背景图加载失败');
        resolve();
      };
      img.src = this.data.imagePath;
      // 设置超时，避免无限等待
      setTimeout(() => {
        console.warn('背景图加载超时');
        resolve();
      }, 5000);
    
    });
  },

  /**
 * 绘制所有覆盖层
 */
async drawAllOverlays(ctx, canvas) {
  const { overlays } = this.data;
  
  if (!overlays || overlays.length === 0) {
    console.log('无覆盖层，跳过');
    return;
  }
  
  console.log('开始绘制', overlays.length, '个覆盖层');
  
  for (let i = 0; i < overlays.length; i++) {
    const overlay = overlays[i];
    console.log(`绘制覆盖层 ${i}:`, overlay.type);
    
    try {
      if (overlay.type === 'text') {
        await this.drawTextOverlay(ctx, overlay);
      } else if (overlay.type === 'image') {
        await this.drawImageOverlay(ctx, canvas, overlay);
      }
    } catch (error) {
      console.error(`绘制覆盖层 ${i} 失败:`, error);
    }
  }
},

/**
 * 将编辑界面坐标转换为Canvas坐标
 */
convertCoordinates(editX, editY, editW, editH, canvasW, canvasH) {
  const scaleX = canvasW / editW;
  const scaleY = canvasH / editH;
  
  return {
    x: editX * scaleX,
    y: editY * scaleY
  };
},

/**
 * 绘制文本覆盖层（带坐标转换）
 */
drawTextOverlay(ctx, overlay) {
  return new Promise((resolve) => {
    try {
      const text = overlay.text || '';
      if (!text.trim()) {
        resolve();
        return;
      }
      
      // 获取Canvas和编辑界面尺寸
      const dpr = wx.getSystemInfoSync().pixelRatio || 2;
      const canvasWidth = ctx.canvas.width / dpr;
      const canvasHeight = ctx.canvas.height / dpr;
      const editWidth = this.data.displayW;
      const editHeight = this.data.displayH;
      
      // 转换坐标
      const pos = this.convertCoordinates(
        overlay.left, overlay.top,
        editWidth, editHeight,
        canvasWidth, canvasHeight
      );
      
      console.log('坐标转换:', {
        原始位置: `(${overlay.left}, ${overlay.top})`,
        Canvas尺寸: `${canvasWidth}×${canvasHeight}`,
        编辑尺寸: `${editWidth}×${editHeight}`,
        转换后位置: `(${pos.x}, ${pos.y})`
      });
      
      ctx.save();
      ctx.font = `${overlay.fontSize || 10}px Arial`;
      ctx.fillStyle = overlay.color || '#000000';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      
      const lines = text.split('\n');
      const lineHeight = (overlay.fontSize || 20) * 1.2;
      
      lines.forEach((line, index) => {
        if (line.trim()) {
          const x = pos.x + 8;
          const y = pos.y + 12 + (index * lineHeight);
          
          if (x >= 0 && y >= 0 && x < canvasWidth && y < canvasHeight) {
            ctx.fillText(line, x, y);
            console.log(`绘制文本: "${line}" 在 (${x}, ${y})`);
          }
        }
      });
      
      ctx.restore();
      resolve();
      
    } catch (error) {
      console.error('文本绘制失败:', error);
      resolve();
    }
  });
},

/**
 * 绘制图片覆盖层
 */
drawImageOverlay(ctx, canvas, overlay) {
  return new Promise((resolve) => {
    if (!overlay.src) {
      resolve();
      return;
    }

    console.log('加载覆盖层图片:', overlay.src);
    
    // 获取Canvas和编辑界面尺寸
    const dpr = wx.getSystemInfoSync().pixelRatio || 2;
    const canvasWidth = canvas.width / dpr;
    const canvasHeight = canvas.height / dpr;
    const editWidth = this.data.displayW;
    const editHeight = this.data.displayH;
    
    // 转换坐标和尺寸
    const pos = this.convertCoordinates(
      overlay.left, overlay.top,
      editWidth, editHeight,
      canvasWidth, canvasHeight
    );
    
    // 转换图片尺寸
    const imgWidth = (overlay.width || 80) / wx.getSystemInfoSync().pixelRatio;
    const imgHeight = (overlay.height || 40) / wx.getSystemInfoSync().pixelRatio;
    
    console.log('图片坐标转换:', {
      原始位置: `(${overlay.left}, ${overlay.top})`,
      原始尺寸: `${overlay.width || 80}×${overlay.height || 40}`,
      Canvas尺寸: `${canvasWidth}×${canvasHeight}`,
      编辑尺寸: `${editWidth}×${editHeight}`,
      转换后位置: `(${pos.x}, ${pos.y})`,
      转换后尺寸: `${imgWidth}×${imgHeight}`,
      //缩放比例: `${pos.scaleX.toFixed(3)}×${pos.scaleY.toFixed(3)}`
    });

    const img = canvas.createImage();

    img.onload = () => {
      try {
        // 检查转换后的位置和尺寸是否在Canvas范围内
        if (pos.x >= 0 && pos.y >= 0 && 
            pos.x < canvasWidth && pos.y < canvasHeight &&
            imgWidth > 0 && imgHeight > 0) {
          
          ctx.drawImage(
            img,
            pos.x,
            pos.y,
            imgWidth,
            imgHeight
          );
          console.log('覆盖层图片绘制完成');
        } else {
          console.warn('图片位置或尺寸超出Canvas范围:', {
            位置: `(${pos.x}, ${pos.y})`,
            尺寸: `${imgWidth}×${imgHeight}`,
            Canvas: `${canvasWidth}×${canvasHeight}`
          });
        }
        resolve();
      } catch (error) {
        console.error('覆盖层图片绘制失败:', error);
        resolve();
      }
    };

    img.onerror = (error) => {
      console.warn('覆盖层图片加载失败:', overlay.src, error);
      resolve();
    };

    img.src = overlay.src;

    // 设置超时
    setTimeout(() => {
      console.warn('覆盖层图片加载超时:', overlay.src);
      resolve();
    }, 3000);
  });
},

 
 delay(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
 },
  /**
   * 绘制连接线到Canvas
   */
  async drawConnectionsOnCanvas(ctx) {
    const { connections } = this.data;
    
    if (!connections || connections.length === 0) return;

    ctx.save();
    ctx.strokeStyle = '#007AFF';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    connections.forEach(connection => {
      ctx.beginPath();
      ctx.moveTo(connection.startX, connection.startY);
      ctx.lineTo(connection.endX, connection.endY);
      ctx.stroke();
    });
    
    ctx.restore();
  },

  /**
 * Canvas转换为临时文件
 */
canvasToTempFilePath(canvas) {
  return new Promise((resolve, reject) => {
    try {
      // 检查Canvas有效性
      if (!canvas || canvas.width <= 0 || canvas.height <= 0) {
        reject(new Error('Canvas无效或尺寸为0'));
        return;
      }
      
      console.log('开始转换Canvas为临时文件...');
      
      wx.canvasToTempFilePath({
        canvas: canvas,
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        destWidth: canvas.width,
        destHeight: canvas.height,
        fileType: 'png',
        quality: 1,
        success: (res) => {
          console.log('Canvas转换成功:', res.tempFilePath);
          
          // 验证文件是否存在
          wx.getFileInfo({
            filePath: res.tempFilePath,
            success: (fileInfo) => {
              console.log('临时文件信息:', fileInfo);
              resolve(res.tempFilePath);
            },
            fail: (error) => {
              console.error('临时文件验证失败:', error);
              reject(new Error('临时文件无效: ' + error.errMsg));
            }
          });
        },
        fail: (error) => {
          console.error('Canvas转换失败:', error);
          reject(new Error('Canvas转换失败: ' + error.errMsg));
        }
      });
    } catch (error) {
      console.error('Canvas转换异常:', error);
      reject(error);
    }
  });
},
/**
 * 显示预览图片 - 默认竖屏模式
 */
showPreviewImage(tempFilePath) {

  if (!tempFilePath) {
    wx.showToast({
      title: '图片路径无效',
      icon: 'error'
    });
    return;
  }
 // this.previewImage(tempFilePath);
  console.log('显示预览图片:', tempFilePath);
  
  // 设置为竖屏预览模式
  this.setData({
  showPreview: true,
    previewImagePath: tempFilePath,
    isLandscapePreview: false
  });
},

/**
 * 切换到横屏预览
 */
switchToLandscape() {
  const imagePath = this.data.previewImagePath;
  
  if (!imagePath) {
    wx.showToast({
      title: '没有可旋转的图片',
      icon: 'error'
    });
    return;
  }

  console.log('切换到横屏预览');
  
  // 获取图片信息计算横屏显示参数
  wx.getImageInfo({
    src: imagePath,
    success: (imgInfo) => {
      const sysInfo = wx.getSystemInfoSync();
      this.calculateLandscapeDisplay(imgInfo, sysInfo.windowWidth, sysInfo.windowHeight);
    },
    fail: (error) => {
      console.error('获取图片信息失败:', error);
      // 使用默认参数
      this.setData({
        isLandscapePreview: true
      });
    }
  });
},

/**
 * 切换到竖屏预览
 */
switchToPortrait() {
  console.log('切换到竖屏预览');
  
  this.setData({
    isLandscapePreview: false,
    previewDisplayW: 0,
    previewDisplayH: 0,
    previewOffsetX: 0,
    previewOffsetY: 0
  });
},
previewImage(imagePath) {
   wx.previewImage({
      urls: [imagePath], 
      current: imagePath, 
      success: () => { 
        console.log('图片预览成功'); 
      }, 
      fail: (error) => {
         console.error('图片预览失败:', error); 
         wx.showToast({
            title: '预览失败', 
            icon: 'error' });
           } 
          });
         },
/**
 * 计算横屏显示参数
 */
calculateLandscapeDisplay(imgInfo, screenW, screenH) {
  console.log('计算横屏显示参数:', {
    图片尺寸: `${imgInfo.width}x${imgInfo.height}`,
    屏幕尺寸: `${screenW}x${screenH}`
  });

  // 计算缩放比例
  const scaleByWidth = screenH / imgInfo.width;
  const scaleByHeight = screenW / imgInfo.height;
  const scale = scaleByHeight;

  // 计算显示尺寸（旋转90度）
  const displayW = screenW;
  const displayH = imgInfo.width * scale;

  // 计算居中偏移
  //const offsetX = (screenH - displayH) / 2;
   //const offsetY = (screenW - displayH) / 2;
   const offsetY = (screenH - displayH) / 2;
  const offsetX = 0;
   //const offsetY = 0;
  console.log('横屏计算结果:', {
    缩放比例: scale.toFixed(3),
    显示尺寸: `${displayW.toFixed(1)}x${displayH.toFixed(1)}`,
    偏移: `X:${offsetX.toFixed(1)} Y:${offsetY.toFixed(1)}`
  });

  this.setData({
    isLandscapePreview: true,
    previewDisplayW: displayW,
    previewDisplayH: displayH,
    previewOffsetX: offsetX,
    previewOffsetY: offsetY
  });
},

/**
 * 关闭预览
 */
closePreview() {
  this.setData({
    showPreview: false,
    previewImagePath: '',
    isLandscapePreview: false,
    previewDisplayW: 0,
    previewDisplayH: 0,
    previewOffsetX: 0,
    previewOffsetY: 0
  });
},

/**
 * 全屏查看图片
 */
viewFullscreen() {
  const imagePath = this.data.previewImagePath;
  
  if (!imagePath) return;
  
  wx.previewImage({
    urls: [imagePath],
    current: imagePath,
    success: () => {
      console.log('全屏预览成功');
    },
    fail: (error) => {
      console.error('全屏预览失败:', error);
      wx.showToast({
        title: '预览失败',
        icon: 'error'
      });
    }
  });
},

/**
 * 保存图片
 */
savePreviewImage() {
  const imagePath = this.data.previewImagePath;
  console.log("开始保存");
  if (!imagePath) {
    wx.showToast({
      title: '没有可保存的图片',
      icon: 'error'
    });
    return;
  }

  // 检查权限并保存
  wx.getSetting({
    success: (res) => {
      if (res.authSetting['scope.writePhotosAlbum']) {
        this.doSaveImage(imagePath);
      } else {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: () => {
            this.doSaveImage(imagePath);
          },
          fail: () => {
            wx.showModal({
              title: '提示',
              content: '需要您的授权才能保存图片',
              showCancel: true,
              confirmText: '去授权',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  wx.openSetting();
                }
              }
            });
          }
        });
      }
    }
  });
},

/**
 * 执行保存图片
 */
doSaveImage(imagePath) {
  wx.showLoading({
    title: '保存中...'
  });

  wx.saveImageToPhotosAlbum({
    filePath: imagePath,
    success: () => {
      wx.hideLoading();
      wx.showToast({
        title: '已保存到相册',
        icon: 'success'
      });
    },
    fail: (error) => {
      wx.hideLoading();
      console.error('保存失败:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'error'
      });
    }
  });
},

/**
 * 分享图片
 */
shareImage(imagePath) {
  if (!imagePath) {
    wx.showToast({
      title: '没有可分享的图片',
      icon: 'error'
    });
    return;
  }

  try {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success: () => {
        console.log('分享菜单显示成功');
      },
      fail: (error) => {
        console.error('分享菜单显示失败:', error);
        wx.showToast({
          title: '分享功能暂不可用',
          icon: 'none'
        });
      }
    });
    
    console.log('准备分享图片:', imagePath);
  } catch (error) {
    console.error('分享图片异常:', error);
  }
},

/**
 * 返回编辑模式
 */
backToEdit() {
  try {
    console.log('====== 返回编辑模式 ======');
    
    // 清理预览状态
    this.setData({
      showPreview: false,
      isLandscapePreview: false,
      isLandscape: false,
      previewImagePath: '',
      previewDisplayW: 0,
      previewDisplayH: 0,
      previewOffsetX: 0,
      previewOffsetY: 0
    }, () => {
      console.log('预览状态已清理');
      
      // 等待页面重新渲染完成
      wx.nextTick(() => {
        console.log('页面已重新渲染');
        this.checkCanvasElement()
        .then(() => {
          console.log('Canvas 元素存在,开始初始化');
          return this.initCanvas();
        })
        .then(() => {
          console.log('Canvas 初始化成功,可以开始绘制');
        })
        .catch(err => {
          console.error('Canvas 检查或初始化失败:', err);
          this.showCanvasError(err.message);
        });
        // 重新初始化 Canvas
       // this.initCanvas();
        
        // 延迟绘制，确保 Canvas 已准备好
        setTimeout(() => {
          console.log('开始重新绘制连线');
          this.drawConnections();
        }, 300);
      });
    });
    
    wx.showToast({
      title: '已返回编辑模式',
      icon: 'none',
      duration: 1000
    });
    
  } catch (error) {
    console.error('返回编辑模式失败:', error);
    wx.showModal({
      title: '错误',
      content: '返回编辑模式失败: ' + error.message,
      showCancel: false
    });
  }
},


/**
 * 延时函数
 */
delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || 0));
},


 
/**
 * 快速切换文本颜色（三色循环）
 */
quickToggleTextColor(e) {
  const idx = e.currentTarget.dataset.idx;
  const overlays = [...this.data.overlays];
  const overlay = overlays[idx];
  
  if (overlay && overlay.type === 'text') {
    const currentColor = overlay.color || '#000000';
    let newColor;
    
    // 三色循环：黑色 → 灰白色 → 透明 → 黑色
    switch (currentColor) {
      case '#000000':
        newColor = '#f5f5f5'; // 黑色 → 灰白色
        break;
      case '#f5f5f5':
        newColor = 'transparent'; // 灰白色 → 透明
        break;
      case 'transparent':
      default:
        newColor = '#000000'; // 透明 → 黑色
        break;
    }
    
    overlay.color = newColor;
    overlays[idx] = overlay;
    
    this.setData({
      overlays: overlays
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
    
    // 显示当前颜色提示
    const colorNames = {
      '#000000': '黑色',
      '#f5f5f5': '灰白色',
      'transparent': '透明'
    };
    
    wx.showToast({
      title: `已切换为${colorNames[newColor]}`,
      icon: 'none',
      duration: 800
    });
  }
},

  /**
   * 设置文本颜色
   */
  setTextColor(idx, color) {
    const overlays = [...this.data.overlays];
    const overlay = overlays[idx];
    
    if (overlay && overlay.type === 'text') {
      overlay.color = color;
      overlays[idx] = overlay;
      
      this.setData({
        overlays: overlays
      });
    }
  },

  /**
   * 获取文本颜色选项
   */
  getTextColorOptions() {
    return [
      { name: '黑色', value: '#000000' },
      { name: '灰白色', value: '#f5f5f5' },
      { name: '白色', value: '#ffffff' },
      { name: '深灰', value: '#333333' },
      { name: '中灰', value: '#666666' },
      { name: '浅灰', value: '#999999' }
    ];
  },
  /**
 * 开始调整大小
 */
startResizeDrag(e) {
  const idx = parseInt(e.currentTarget.dataset.idx);
  const touch = e.touches[0];
  const overlay = this.data.overlays[idx];
  
  console.log('开始调整大小:', idx);
  
  this.setData({
    isResizing: true,
    resizingIdx: idx,
    resizeStartX: touch.clientX,
    resizeStartY: touch.clientY,
    resizeStartWidth: overlay.width || 80,
    resizeStartHeight: overlay.height || 40
  });
  
  
},

/**
 * 调整大小拖动
 */
moveResizeDrag(e) {
  if (!this.data.isResizing || this.data.resizingIdx === null) return;
  
  const touch = e.touches[0];
  const deltaX = touch.clientX - this.data.resizeStartX;
  const deltaY = touch.clientY - this.data.resizeStartY;
  
  // 计算新的尺寸（从左上角拖动，所以deltaX和deltaY是负值表示放大）
  const newWidth = Math.max(20, this.data.resizeStartWidth - deltaX);
  const newHeight = Math.max(20, this.data.resizeStartHeight - deltaY);
  
  // 更新组件尺寸，但不改变位置
  const overlays = [...this.data.overlays];
  overlays[this.data.resizingIdx].width = newWidth;
  overlays[this.data.resizingIdx].height = newHeight;
  
  this.setData({
    overlays: overlays
  });
  
  //console.log('调整大小中:', {
  ///  deltaX: deltaX.toFixed(1),
  //  deltaY: deltaY.toFixed(1),
   // newWidth: newWidth.toFixed(1),
    //newHeight: newHeight.toFixed(1)
  //});
},

/**
 * 结束调整大小
 */
endResizeDrag(e) {
  console.log('结束调整大小');
  
  this.setData({
    isResizing: false,
    resizingIdx: null
  });
  
  // 触觉反馈
  wx.vibrateShort({
    type: 'light'
  });
},
goFeedback() {
  wx.navigateTo({
    url: '/Mypages/feedback/feedback'
  })
},
safeClearAllTimers() {
   // 防止定时器继续跑
   if (this.data.guideTimer) {
    clearTimeout(this.data.guideTimer);
    this.setData({ guideTimer: null });
  }

  // 滚动动画定时器（如果你有）
  if (this.data.autoScrollTimer) {
    clearInterval(this.data.autoScrollTimer);
    this.data.autoScrollTimer = null;
  }


},
  onUnload() {
    this.safeClearAllTimers()
    // 页面卸载时清理定时器
    this.stopAutoScroll();
    if (this.data.longPressTimer) {
      clearTimeout(this.data.longPressTimer);
    }
    if (this.data.tapTimer) {
      clearTimeout(this.data.tapTimer);
    }
    this.saveToLocal();
    if (this.data.isLandscape) {
      // 如果当前是横屏，恢复到竖屏
      this.setData({
        isLandscape: false
      });
    }
     // 清理 Canvas
  if (this.canvasContext) {
    this.canvasContext = null;
  }
  if (this.canvasNode) {
    this.canvasNode = null;
  }
  },
   // 页面隐藏时（切换 tab 或跳到其他页面）
   onHide() {
    this.saveToLocal();
  },
  back() {
    this.saveToLocal();
    this.safeClearAllTimers()
    // 页面卸载时清理定时器
    this.stopAutoScroll();
    const pages = getCurrentPages();
    
    const prevPage = pages[pages.length - 2];
    if (pages.length > 1) {
    
      // 告诉上一个页面需要刷新
      if (prevPage?.localDatalocal) {
        prevPage.localDatalocal();
      }
    
  
    wx.navigateBack({ delta: 1 });
    
    } else {
      // 没有上一级页面 → 跳转到指定界面
      wx.navigateTo({
        url: '/Mypages/list1/index',
      });
    }
  }
  
  
 
});

