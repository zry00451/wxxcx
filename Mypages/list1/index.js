Page({
  data: {
    compositions: [],
    selectedId: null,
    userOpenId: '', // 当前登录用户的 openid
    showAll: false,    // 默认不展开
    allowExample: true, // 默认值，稍后会根据storage覆盖
    nickname: "",          // 生效中的昵称
    tempNickname: "",      // 弹窗里编辑的临时昵称
    showNicknameModal: false,
    showDrawer: false,
    clicked :false,
    currentImg: '',
    fadeClass: 'fade-in',
    frames: [
      '/images/play1.png',
      '/images/play2.png',
      '/images/play2.png',
      '/images/play3.png',
      '/images/play3.png',
      '/images/play3.png',
      '/images/play3.png',
      '/images/play4.png',
      '/images/play4.png'
    ],
    currentFrame: 0,
    timer: null,
    showPanel: false,
    showAnim: false,
    buttonState : 1,
    showMainBtn: true ,   // 底部主按钮
    isLogin:true,
    needRefresh:false,
    showHint:false,
  },
onshow(){
  if (this.data.needRefresh) {
    this.localDatalocal();  // 你自己的刷新方法
    this.setData({ needRefresh: false });
  }
},
  onPlay() {
    this.setData({
      showDrawer: true,
      showPanel: true,
      showAnim:true,
      currentFrame: 0,
      showMainBtn:false
    })

    this.startAnimation()
  },

  startAnimation() {
    let playCount=0
    const frameLen = this.data.frames.length
    const oneLoopDuration = 400 // ⭐ 一遍动画 1 秒
    const frameInterval = oneLoopDuration / frameLen
      // ⭐ 第一帧渐显
  this.setData({
    currentFrame: 0,
    fadeClass: 'fade-in' // 绑定渐显 class
  })
  const timer = setInterval(() => {
    let frame = this.data.currentFrame + 1

    // 一轮播放完
    if (frame >= frameLen) {
      frame = 0
      playCount++
    }

    // 最后一轮 + 最后一帧停 1 秒
    if (playCount === 1 && frame === frameLen - 1) {
      this.setData({
        currentFrame: frame,
        playCount
      })

      clearInterval(timer)

      setTimeout(() => {
        this.setData({
          showAnim: false
        })
      }, 1000)

      return
    }

    // 播放 2 轮后停止
    if (playCount >= 2) {
      clearInterval(timer)
      this.setData({
        showAnim: false
      })
      return
    }

    this.setData({
      currentFrame: frame,
      playCount,
      fadeClass: frame === 0 ? 'fade-in' : '' // 只有第一帧溶解
    })
  }, frameInterval)

  const path11=`${wx.env.USER_DATA_PATH}/button11.png`;
  const path22=`${wx.env.USER_DATA_PATH}/button22.png`;
    this.setData({
      currentImg: this.data.currentImg === path11
        ? path22
        : path11,
     // fadeClass: 'fade-in'
    });
  },


    // 打开抽屉
  openDrawer() {
    // 先让按钮淡出
    const path11=`${wx.env.USER_DATA_PATH}/button11.png`;
    const path22=`${wx.env.USER_DATA_PATH}/button22.png`;
    this.setData({ fadeClass: 'fade-out' });

    setTimeout(() => {
      // 切换按钮图片 + 淡入
      this.setData({
        currentImg: this.data.currentImg === path11
          ? path22
          : path11,
       // fadeClass: 'fade-in'
      });

      // 打开抽屉
      this.setData({ showDrawer: true });
    }, 500); // 和 CSS transition 时间保持一致
  },

  // 关闭抽屉
  closeDrawer() {
    clearInterval(this.data.timer)
    this.setData({ showDrawer: false,showPanel: false,showMainBtn: true,currentFrame: 0 });

    // 同时把按钮切换回初始状态（可选）
   // this.setData({ fadeClass: 'fade-out' });
   // setTimeout(() => {
  //    this.setData({
   //     currentImg: '/images/button11.png',
  //      fadeClass: 'fade-in'
  //    });
  //  }, 500);
  },


  async onLoad() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo || !userInfo.openid) {
      this.setData({
           isLogin: false
         });
         wx.reLaunch({
           url: '/Mypages/editorH/index?id=0'
         });
     } else {
       this.setData({
         isLogin: true,
         userName: userInfo.userName || userInfo.nickname
       });
       this.setData({ nickname:userInfo.nickname });
       console.log(userInfo);
       await this.getUserOpenId(); // 获取当前用户 openid
       this.localDatalocal();
       
     }
 
    

    //const allowExample = wx.getStorageSync("allowExample");
   // if (allowExample === false) {
    //  this.setData({ allowExample: false });
   // }
    
   //this.debugStorage();
  
  },
  egunload()
  {
    const id = 0;
    const compositions = this.data.compositions.filter(c => c.id !== id);
    this.setData({ compositions});
    wx.setStorageSync('compositions', compositions);
  },
  onImageLoad(e) {
    console.log('图片加载成功:', e.currentTarget.dataset);
  },
  
  onImageError(e) {
    console.error('图片加载失败:', e.detail, e.currentTarget.dataset);
  },
 
  // 获取 openid（需配置云开发并部署 getOpenId 云函数）
  async getUserOpenId() {
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',  // 文件夹名
      data: {
        type: 'getOpenId'
      },
      success: res => {
        console.log('用户 openid:', res.result.openid);
      },
      fail: err => {
        console.error('调用失败:', err);
      }
    });
  },

  localDatalocal(){
    //判断bgpath是否为空，空则调用写入
    const localList = wx.getStorageSync("compositions") || [];
    console.log(localList);
    if (localList.some(item => item.id === 0)) {
      wx.removeStorageSync("localComponentList_0");
    }
    const updatedList = localList.filter(item => item.id !== "0").map(item => {
      // 取出 localComponentList_${id} 中存的对象
      const localData = wx.getStorageSync(`localComponentList_${item.id}`);
      console.log(localData);
      let localBgPath = "";
     
      // 优先使用背景图本地路径
      if (localData.backgroundPath) {
        localBgPath = localData.backgroundPath;
        console.log("678"+localBgPath);
      } else if (localData.components && localData.components.length > 0) {
        // 没有背景图时，取第一个图片组件
        const firstImage = localData.components.find(overlay => overlay.type === "image" && overlay.src);
        if (firstImage) {
          localBgPath = firstImage.src;
          console.log("huh",localBgPath);
        }
      }
  
     // 检测逻辑：如果没有bgPath或者bgPath与localData.backgroundPath不一致才更新
    const shouldUpdate = !item.bgPath || 
                        (localData.backgroundPath && item.bgPath !== localData.backgroundPath) ||
                        (!localData.backgroundPath && item.bgPath !== String(localBgPath));
    
    if (shouldUpdate) {
      console.log(`更新item ${item.id} 的bgPath: ${item.bgPath} -> ${localBgPath || `${wx.env.USER_DATA_PATH}/playeg2.ipg`}`);
      return {         
        ...item,         
        bgPath: String(localBgPath) || `${wx.env.USER_DATA_PATH}/playeg2.jpg`                
      };     
    } else {
      console.log(`item ${item.id} 的bgPath无需更新: ${item.bgPath}`);
      return item; // 无需更新，直接返回原对象
    }
  });        

  // 只有当updatedList真的有变化时才调用setData
  const hasChanges = updatedList.some((item, index) => 
    item.bgPath !== localList[index]?.bgPath
  );
  
  if (hasChanges) {
    this.setData({       
      compositions: updatedList            
    });     
    console.log("compositions已更新:", updatedList);
  } else {
    console.log("compositions无变化，跳过setData");
  }
  const id = "0";
  const compositions = this.data.compositions.filter(c => c.id !== id);
  this.setData({ compositions});
  console.log(this.data.compositions)
    console.log(updatedList);
  if(this.data.compositions.length == 0){
    this.playBreathingHint(5);
  }
  },
  playBreathingHint(cycles = 5) { // ⭐ 5 次 ≈ 5 秒
    // 防止重复启动
    if (this.breathingTimer) return;
  
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in-out'
    });
  
    let fadeIn = true;
    let count = 0;
  
    this.setData({ showHint: true });
  
    this.breathingTimer = setInterval(() => {
      if (fadeIn) {
        animation.opacity(1).step();
      } else {
        animation.opacity(0.2).step();
        count++;
  
        // ⭐ 完成指定 cycles 后停止
        if (count >= cycles) {
          clearInterval(this.breathingTimer);
          this.breathingTimer = null;
          this.setData({ showHint: false });
          return;
        }
      }
  
      this.setData({
        fadeAnimation: animation.export()
      });
  
      fadeIn = !fadeIn;
    }, 1000);
  },
  stopBreathingHint() {
    if (this.breathingTimer) {
      clearInterval(this.breathingTimer);
      this.breathingTimer = null;
    }
  
    this.setData({
      showHint: false,
      fadeAnimation: null
    });
  },
  onHide() {
    this.stopBreathingHint();
  },
  
  onUnload() {
    this.stopBreathingHint();
  },
  showplayhint(){

  },
  onShow() {
    console.log('当前页面数据:', this.data);
  },
  // 获取本地和云端数据
  async loadData() {
    const localData = wx.getStorageSync('compositions') || [];

    // 云端获取当前用户作品（使用 openid 过滤）
    let cloudData = [];
    try {
      const res = await wx.cloud.database().collection('compositions')
        .where({ creatorOpenId: this.data.userOpenId })
        .get();
      cloudData = res.data;
    } catch (err) {
      console.error('云端获取失败', err);
    }
    // 1. 构建云端ID集合（以id为主键）
    const cloudIds = new Map();

    for (const item of cloudData) {
      const existing = cloudIds.get(item.id);
      if (!existing || new Date(item.updatedAt).getTime() > new Date(existing.updatedAt || 0).getTime()) {
        cloudIds.set(item.id, item);
      }
    }
    // 2. 过滤掉本地中已被云端覆盖的项
    const filteredLocal = localData.filter(item => !cloudIds.has(item.id));


    const merged = [...filteredLocal, ...cloudData];
    this.setData({ compositions: merged });
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
  toggleShowAll() {
    this.setData({
      showAll: !this.data.showAll
    });
  },
  clearAllLocalComponentLists() {
    try {
      const keys = wx.getStorageInfoSync().keys;
      const targetPrefix = 'localComponentList_';
  
      keys.forEach(key => {
        if (key.startsWith(targetPrefix)) {
          wx.removeStorageSync(key);
          console.log(`已删除本地缓存：${key}`);
        }
      });
  
      wx.showToast({
        title: '已清除所有组件数据',
        icon: 'success'
      });
    } catch (e) {
      console.error('清除出错', e);
      wx.showToast({
        title: '清除失败',
        icon: 'none'
      });
    }
    this.setData({ compositions: [] });
    wx.setStorageSync('compositions', this.data.compositions);
    
    const existingPaths = wx.getStorageSync('localFilePaths') || [];
    console.log("123"+existingPaths);
    wx.setStorageSync('localFilePaths', [])
    wx.setStorageSync("allowExample", true);
    wx.setStorageSync('localComponentList_1755534786885',[]);
    wx.setStorageSync('localComponentList_1755520796298',[]);
    wx.setStorageSync('localCompositions',[]);
    wx.setStorageSync('localkey',[]);
    wx.setStorageSync('userInfo', [])
    
  },
  // 长按显示删除按钮
 onnullPress() {
  
  //const compositions = this.data.compositions;
  wx.showModal({
    title: '清空',
    content: '是否清空许愿池',
    success: res => {
      if (res.confirm) {
        this.null();
      } else {
       
      }
    }
  });
},
  null()
  {
    
    try {
      const keys = wx.getStorageInfoSync().keys;
      const targetPrefix = 'localComponentList_';
  
      keys.forEach(key => {
        if (key.startsWith(targetPrefix)) {
          wx.removeStorageSync(key);
          console.log(`已删除本地缓存：${key}`);
        }
      });
  
      wx.showToast({
        title: '已清除所有组件数据',
        icon: 'success'
      });
    } catch (e) {
      console.error('清除出错', e);
      wx.showToast({
        title: '清除失败',
        icon: 'none'
      });
    }
    this.setData({ compositions: [] });
    wx.setStorageSync('compositions', []);
    console.log(this.data.compositions);
  },
  creatone()
  {
    wx.showModal({
      title: '创建新记录',
      placeholderText: '请输入名称',
      editable: true,  // 允许输入
     // content: this.data.nickname + 'add',  // 默认名称
      success: res => {
        if (res.confirm) {
          const id = Date.now().toString();
          // 获取用户输入的内容，如果为空则使用默认名称
          const title = res.content.trim() || (this.data.nickname + 'add');
          
          this.createNew(id, title);
          
          // 关闭抽屉
          this.setData({
            showDrawer: false,
            showAll: true
          });
          
          wx.showToast({
            title: '创建成功',
            icon: 'success'
          });
        }
        // 如果点击取消，不做任何操作
      }
    });
   
  },
  createNew(id1,title1) {
   
    //const backgroundFileID = `bg-${id}`; // 生成唯1backgroundFileID
    
    const existing = this.data.compositions.find(item => item.id === id1);
  
    if (existing) {
      wx.showToast({
        title: '已有相同ID的文件',
        icon: 'none'
      });
      return; // 终止后续逻辑
    }else{
    const newItem = {
      id:id1,
      title:title1,
      bgPath: "", // 之后由编辑页处理
      creatorOpenId: this.data.userOpenId,
      ssss:false,
      createdAt: Date.now(),
      updatedAt:  Date.now()

    };
    const updated = [newItem,...this.data.compositions ];
    this.setData({ compositions: updated });
    wx.setStorageSync('compositions', updated);}
    this.closeDrawer();

  },

  selectItem(e) {
    this.setData({ selectedId: e.currentTarget.dataset.id });
  },

  stopPropagation() {}, // 避免 input 被冒泡导致选中逻辑触发

  updateCreator(e) {
    const id = e.currentTarget.dataset.id;
    const compositions = this.data.compositions.map(c =>
      c.id === id ? { ...c, creator: e.detail.value } : c
    );
    this.setData({ compositions });
    wx.setStorageSync('compositions', compositions);
  },

  updateTitle(e) {
    const id = e.currentTarget.dataset.id;
    const compositions = this.data.compositions.map(c =>
      c.id === id ? { ...c, title: e.detail.value } : c
    );
    this.setData({ compositions });
    wx.setStorageSync('compositions', compositions);
  },

  deleteItem(e) {
    const id = e.currentTarget.dataset.id;
    const compositions = this.data.compositions.filter(c => c.id !== id);
    this.setData({ compositions, selectedId: null });
    wx.setStorageSync('compositions', compositions);
  
  },
 // 长按显示删除按钮
 onListLongPress(e) {
  const id = e.currentTarget.dataset.id;
  //const compositions = this.data.compositions;
  wx.showModal({
    title: '删除许愿池',
    content: '是否删除？',
    success: res => {
      if (res.confirm) {
        this.deleteItem(e);
      } else {
       
      }
    }
  });
},


  enterEditor(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.compositions.find(c => c.id === id);
  if (!item) return;

  const { backgroundFileID, creatorOpenId } = item;

  wx.navigateTo({
    url: `/Mypages/editorH/index?id=${id}`
  });
  },
  back() {
    

  wx.navigateTo({
    url: `/Mypages/booklist/booklist`
  });
  },
  async syncToCloud() {
    const item = this.data.compositions.find(c => c.id === this.data.selectedId);
    if (!item) return;

  const db = wx.cloud.database();
  try {
    // 1. 检查是否已有相同 id 的文档
    const res = await db.collection('compositions') // ✅ 注意加 await
      .where({ id: item.id })
      .get();

    if (res.data.length > 0) {
      // 2. 有则更新
      const docId = res.data[0]._id;
      await db.collection('compositions').doc(docId).update({
        data: {
          ...item,
          updatedAt: db.serverDate() // ✅ 确保更新时间字段写在 data 里
        }
      });
      wx.showToast({ title: '云端已更新' });
    } else {
      // 3. 无则新建
      await db.collection('compositions').add({
        data: {
          ...item,
          updatedAt: db.serverDate()
        }
      });
      wx.showToast({ title: '已上传到云端' });
    }

  } catch (err) {
    console.error('上传失败', err);
    wx.showToast({ icon: 'error', title: '上传失败' });
  }
},
onImportTap() {
  wx.chooseMessageFile({
    count: 1,
    type: 'file',
    success: res => {
      const filePath = res.tempFiles[0].path;
      const fs = wx.getFileSystemManager();

      // base64 写入本地文件的方法
      const base64ToPath = (base64Data, fileName) => {
        return new Promise((resolve, reject) => {
          const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
          const buffer = wx.base64ToArrayBuffer(base64Data);
          fs.writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            success: () => resolve(filePath),
            fail: err => reject(err)
          });
        });
      };

      fs.readFile({
        filePath,
        encoding: 'utf8',
        success: async readRes => {
          try {
            const parsed = JSON.parse(readRes.data);
            const id = parsed.id;
            const title = parsed.newTitle || '未命名标题';
            const creator = parsed.newCreator || '未命名作者';
            const localKey = `localComponentList_${id}`;
            // 创建新页面数据
            const existing = this.data.compositions.find(item => item.id === id);//为什么变成id1????
  
            if (existing) {
              wx.showModal({
                title: '发现本地文件',
                content: '本地已存在相同ID的文件，请选择如何处理：',
                confirmText: '覆盖',
                cancelText: '新建',
                success: (res) => {
                  if (res.confirm) {
                    // 用户选择覆盖 - 加载云端数据并覆盖本地
                  } else if (res.cancel) {
                    // 用户选择新建 - 生成新ID并加载云端数据
                    this.creatone();
                  }
                },
                fail: () => {
                  wx.showToast({
                    title: '加载失败请重试',
                    icon: 'none'
                  });
                }
              });
            }
          
            //
            const localData = {
              backgroundPath: '',
              components: []
            };

            // 处理背景图
            if (parsed.background) {
              try {
                const bgBase64 = parsed.background.replace(/^data:image\/\w+;base64,/, '');
                const bgPath = await base64ToPath(bgBase64, `${id}_background.jpg`);
                localData.backgroundPath = bgPath;
              } catch (err) {
                console.error('背景图保存失败', err);
                wx.showToast({ title: '背景图保存失败', icon: 'error' });
              }
            }

            // 处理组件图
            const tasks = (parsed.components || []).map(async (item, idx) => {
              if (item.type === 'image' && item.base64) {
                try {
                  const imgBase64 = item.base64.replace(/^data:image\/\w+;base64,/, '');
                  const imgPath = await base64ToPath(imgBase64, `${id}_image_${idx}.jpg`);
                  return {
                    ...item,
                    src: imgPath,
                    base64: ''
                  };
                } catch (err) {
                  console.error(`第 ${idx} 个图片组件保存失败`, err);
                  return item;
                }
              }
              return item;
            });

            const finalComponents = await Promise.all(tasks);
            localData.components = finalComponents;

            // 存储到本地缓存
            wx.setStorageSync(localKey, localData);

            

            // 可选：自动跳转
            // wx.navigateTo({ url: `/pages/editorH/index?id=${id}` });

          } catch (err) {
            console.error('JSON 解析失败', err);
            wx.showToast({ title: '文件格式错误', icon: 'error' });
          }
        },
        fail: err => {
          console.error('文件读取失败', err);
          wx.showToast({ title: '文件读取失败', icon: 'error' });
        }
      });
    },
    fail: err => {
      console.error('文件选择失败', err);
    }
  });
  // 关闭抽屉
  this.setData({
    showDrawer: false,
    showAll: true  // 显示全部
  });
},


});