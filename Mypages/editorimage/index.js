import { selectPhoto, savePhoto } from '../utils/util'
// 系统信息
const sys = wx.getSystemInfoSync()
// 画布上下文
let preCtx = null
// 图片原始路径和大小
let originPath = ''
// 当前展示的图片实际大小
// 裁剪后还可以继续裁剪
let imageWidth = 0
let imageHeight = 0


// 以下为裁剪框缩放时临时变量
// 当前操作的缩放角
let activeCorner = ''
// 裁剪框缩放前的位置信息
let clipBoxBeforeScaleClipX = 0
let clipBoxBeforeScaleClipY = 0
// 裁剪框缩放前的宽高
let clipBoxBeforeScaleWidth = 0
let clipBoxBeforeScaleHeight = 0
// 裁剪框缩放前点击鼠标的Page(X|Y)位置信息
let clipBoxBeforeScalePageX = 0
let clipBoxBeforeScalePageY = 0

// 以下为裁剪框移动时临时变量
// 裁剪框移动鼠标内部位置信息
let clipBoxMoveInnerX = 0
let clipBoxMoveInnerY = 0

// 图片在窗口面板尺寸小的缩放比
let xScale = 1
let yScale = 1
Page({
  data: {
    // 当前图片路径
    imagePath: '',

    originWidth: 0,
    originHeight: 0,

    // 图片显示面板宽高
    panelWidth: 0,
    panelHeight: 0,
    paneltop:0,
    // 裁剪区域宽高
    clipWidth: 0,
    clipHeight: 0,
    // 裁剪区域位置信息
    clipX: 0,
    clipY: 0,
    // 裁剪区域底图位置信息
    clipImgX: 0,
    clipImgY: 0,

    // 正要裁剪的宽高
    croppingImageWidth: 0,
    croppingImageHeight: 0,
    cropMode: 'rect', // 'rect' 矩形裁剪, 'circle' 圆形裁剪
  // 圆形裁剪的半径和圆心
  circleRadius: 0,
  circleCenterX: 0,
  circleCenterY: 0,
  },
  onLoad(options) {
    // 获取 eventChannel，用于接收上一页传来的 imagePath
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('initCrop', ({ imagePath }) => {
      this.setData({ imagePath });
      this.loadImage(imagePath)
      // 获取原图尺寸并按屏幕宽度等比缩放
      
      });
    
  },
  // 切换裁剪模式
 // 切换裁剪模式
 switchCropMode() {
  const newMode = this.data.cropMode === 'rect' ? 'circle' : 'rect';
  
  if (newMode === 'circle') {
    // 切换到圆形模式时，确保裁剪框是正方形
    const { clipWidth, clipHeight, clipX, clipY, panelWidth, panelHeight } = this.data;
    const size = Math.min(clipWidth, clipHeight);
    
    // 计算新的位置（居中）
    let newClipX = clipX + (clipWidth - size) / 2;
    let newClipY = clipY + (clipHeight - size) / 2;
    
    // 确保不超出面板
    newClipX = Math.max(0, Math.min(newClipX, panelWidth - size));
    newClipY = Math.max(0, Math.min(newClipY, panelHeight - size));
    
    this.setData({
      cropMode: newMode,
      clipWidth: size,
      clipHeight: size,
      clipX: newClipX,
      clipY: newClipY,
      clipImgX: 0 - newClipX,
      clipImgY: 0 - newClipY,
      croppingImageWidth: parseInt(size / xScale),
      croppingImageHeight: parseInt(size / yScale)
    });
  } else {
    // 切换回矩形模式
    this.setData({ cropMode: newMode });
  }
},

  onReady () {
    this.init()
  },
  init () {
    preCtx = wx.createCanvasContext('main')
  },
  // 初始化圆形裁剪区域
initCircleCrop() {
  const { panelWidth, panelHeight, clipWidth, clipHeight, clipX, clipY } = this.data;
  
  // 使用当前矩形裁剪框的较小边作为直径
  const diameter = Math.min(clipWidth, clipHeight);
  const radius = diameter / 2;
  
  // 圆心位置（裁剪框中心）
  const centerX = clipX + clipWidth / 2;
  const centerY = clipY + clipHeight / 2;
  
  this.setData({
    circleRadius: radius,
    circleCenterX: centerX,
    circleCenterY: centerY,
    clipWidth: diameter,
    clipHeight: diameter
  });
},
  syscImagePath (event) {
    originPath = event.detail.value
    originPath && this.loadImage(originPath)
  },
  
  onChangeImage () {
    wx.showLoading({ title: '加载中' })

    selectPhoto((fileRes) => {
      const tempFiles = fileRes.tempFiles[0]
      const tempFilePath = tempFiles.tempFilePath || tempFiles.path
      
      wx.hideLoading()
      this.loadImage(tempFilePath)
    })
  },
  changeImage () {
    if (!this.data.imagePath) {
      return
    }
    selectPhoto((fileRes) => {
      const tempFiles = fileRes.tempFiles[0]
      originPath = tempFiles.tempFilePath || tempFiles.path
      wx.hideLoading()
      originPath && this.loadImage(originPath)
    })
  },
  loadImage(originPath) {
    wx.getImageInfo({
      src: originPath,
      success: async (imgInfo) => {
        this.setData({
          originWidth: imgInfo.width,
          originHeight: imgInfo.height
        })
        this.initImage(imgInfo.width, imgInfo.height, originPath)
      },
      fail: (err) => {
        console.log('getImageInfo', err)
      }
    })
  },
  initImage (imgWidth, imgHeight, imagePath) {
    this.setData({
      clipX: 0,
      clipY: 0,
      clipImgX: 0,
      clipImgY: 0
    })

    // 初始化图片，根据窗口大小，设置图片面板尺寸
    let panelW = sys.windowWidth
    let panelH = sys.windowHeight - 200
    if (panelH / panelW >= imgHeight / imgWidth) {
      panelH = parseInt(panelW * imgHeight / imgWidth)
    } else {
      panelW = parseInt(panelH * imgWidth / imgHeight)
    }
    imageWidth = imgWidth
    imageHeight = imgHeight
    let paneltop =  (sys.windowHeight - panelH)/2
    xScale = panelW / imageWidth
    yScale = panelH / imageHeight

    this.setData({
      paneltop,
      imagePath,
      panelWidth: panelW,
      panelHeight: panelH,
      clipWidth: panelW,
      clipHeight: panelH,
      croppingImageWidth: imgWidth,
      croppingImageHeight: imgHeight
    })
  },
  touchstartM (event) {
    const { clipX, clipY } = this.data
    const { pageX, pageY } = event.touches[0]
    // 获取鼠标点在裁剪框的内部位置信息
    clipBoxMoveInnerX = pageX - clipX
    clipBoxMoveInnerY = pageY - clipY
  },
  touchmoveM (event) {
    const { pageX, pageY } = event.touches[0]
    const { panelWidth, panelHeight, clipHeight, clipWidth } = this.data

    // 裁剪框不能脱离面板
    // X位置范围为 0 到 (面板宽度-裁剪框宽度)
    let clipX = pageX - clipBoxMoveInnerX
    clipX = Math.max(clipX, 0)
    const panelX = panelWidth - clipWidth
    clipX = Math.min(clipX, panelX)
    // Y位置范围为 0 到 (面板高度-裁剪框高度)
    let clipY = pageY - clipBoxMoveInnerY
    clipY = Math.max(clipY, 0)
    const panleY = panelHeight - clipHeight
    clipY = Math.min(clipY, panleY)

    // 裁剪框底图位置信息
    const clipImgX = 0 - clipX
    const clipImgY = 0 - clipY

    this.setData({
      clipX,
      clipY,
      clipImgX,
      clipImgY
    })
  },

  // 处理缩放动作中不同corner时的尺寸位置信息
  getClipX (clipWidth) {
    switch (activeCorner) {
      case 'leftTop':
      case 'leftBottom':
        return clipBoxBeforeScaleClipX + (clipBoxBeforeScaleWidth - clipWidth)
      case 'rightTop':
      case 'rightBottom':
        return clipBoxBeforeScaleClipX;
      default:
        return 0
    }
  },
  getClipY (clipHeight) {
    switch (activeCorner) {
      case 'leftTop':
      case 'rightTop':
        return clipBoxBeforeScaleClipY + (clipBoxBeforeScaleHeight - clipHeight)
      case 'leftBottom':
      case 'rightBottom':
        return clipBoxBeforeScaleClipY
      default:
        return 0
    }
  },
  getScaleXWidthOffset (offsetW) {
    switch (activeCorner) {
      case 'leftTop':
      case 'leftBottom':
        return -offsetW
      case 'rightTop':
      case 'rightBottom':
        return offsetW
      default:
        return 0
    }
  },
  getScaleYHeightOffset (offsetH) {
    switch (activeCorner) {
      case 'rightBottom':
      case 'leftBottom':
        return offsetH
      case 'rightTop':
      case 'leftTop':
        return -offsetH
      default:
        return 0
    }
  },
  
  touchstart (event) {
    const dragId = event.currentTarget.dataset.id
    const { pageX, pageY } = event.touches[0]
    const { clipX, clipY, clipHeight, clipWidth } = this.data

    // 设置缩放时临时变量初始化值
    activeCorner = dragId
    clipBoxBeforeScalePageX = pageX
    clipBoxBeforeScalePageY = pageY
    clipBoxBeforeScaleClipX = clipX
    clipBoxBeforeScaleClipY = clipY
    clipBoxBeforeScaleWidth = clipWidth
    clipBoxBeforeScaleHeight = clipHeight
  },
  touchmove (event) {
    const { pageX, pageY } = event.touches[0]
    const { panelWidth, panelHeight, cropMode } = this.data
    if (cropMode === 'circle') {
      // 圆形裁剪模式：调整半径
      const xWidthOffset = this.getScaleXWidthOffset(pageX - clipBoxBeforeScalePageX)
      const yHeightOffset = this.getScaleYHeightOffset(pageY - clipBoxBeforeScalePageY)
      
      // 取较大的偏移量作为半径变化
      const offset = Math.max(Math.abs(xWidthOffset), Math.abs(yHeightOffset));
      const radiusChange = xWidthOffset > 0 || yHeightOffset > 0 ? offset : -offset;
      
      let radius = Math.max(clipBoxBeforeScaleWidth / 2 + radiusChange / 2, 18); // 最小半径18
      const diameter = radius * 2;
      
      // 限制最大直径
      const maxDiameter = Math.min(panelWidth, panelHeight);
      const finalDiameter = Math.min(diameter, maxDiameter);
      const finalRadius = finalDiameter / 2;
      
      // 更新圆心和半径
      let centerX = this.getClipX(finalDiameter) + finalRadius;
      let centerY = this.getClipY(finalDiameter) + finalRadius;
      
      // 确保圆不超出面板
      centerX = Math.max(finalRadius, Math.min(centerX, panelWidth - finalRadius));
      centerY = Math.max(finalRadius, Math.min(centerY, panelHeight - finalRadius));
      
      const clipX = centerX - finalRadius;
      const clipY = centerY - finalRadius;
      
      this.setData({
        circleRadius: finalRadius,
        circleCenterX: centerX,
        circleCenterY: centerY,
        clipWidth: finalDiameter,
        clipHeight: finalDiameter,
        clipX,
        clipY,
        clipImgX: 0 - clipX,
        clipImgY: 0 - clipY,
        croppingImageWidth: parseInt(finalDiameter / xScale),
        croppingImageHeight: parseInt(finalDiameter / yScale)
      });
    } else {
    
    
    // 缩放在X上的偏移
    const xWidthOffset = this.getScaleXWidthOffset(pageX - clipBoxBeforeScalePageX)
    // 裁剪框最小宽度36
    let clipWidth = Math.max(clipBoxBeforeScaleWidth + xWidthOffset, 36)
    // 设置缩放最大宽度，放大时不能超过面板、缩小时不能超过初始裁剪框
    let tempPanelWidth = pageX > clipBoxBeforeScalePageX ? panelWidth - clipBoxBeforeScaleClipX : clipBoxBeforeScaleWidth + clipBoxBeforeScaleClipX
    // 设置裁剪框宽度
    clipWidth = Math.min(clipWidth, tempPanelWidth)

    // 缩放在Y上的偏移
    const yHeightOffset = this.getScaleYHeightOffset(pageY - clipBoxBeforeScalePageY)
    // 裁剪框最小高度36
    let clipHeight = Math.max(clipBoxBeforeScaleHeight + yHeightOffset, 36)
    // 设置缩放最大高度，放大时不能超过面板、缩小时不能超过初始裁剪框
    let tempPanelHeight = pageY > clipBoxBeforeScalePageY ? panelHeight - clipBoxBeforeScaleClipY : clipBoxBeforeScaleHeight + clipBoxBeforeScaleClipY
    // 设置裁剪框高度
    clipHeight = Math.min(clipHeight, tempPanelHeight)

    // 裁剪框位置信息
    let clipX = this.getClipX(clipWidth)
    let clipY = this.getClipY(clipHeight)
    // 裁剪框底图位置信息
    let clipImgX = 0 - clipX
    let clipImgY = 0 - clipY

    this.setData({
      clipWidth,
      clipHeight,
      clipX,
      clipY,
      clipImgX,
      clipImgY,
      croppingImageWidth: parseInt(clipWidth / xScale),
      croppingImageHeight: parseInt(clipHeight / yScale)
    })
  }
  },
  downloadCanvasImage () {
    this.getCropperImage();
    const { imagePath } = this.data
    if (!imagePath) {
      return
    }
    const cropPath = imagePath;
    // 回传给上一页
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('cropDone', { cropPath });
    // 返回主页面
    wx.navigateBack();
    //wx.showLoading({ title: '保存中...' })
    //savePhoto(imagePath)
  },
  getCropperImage () {
    const { imagePath, croppingImageWidth, croppingImageHeight, panelHeight, panelWidth, clipImgX, clipImgY, cropMode, } = this.data
    if (!imagePath) {
      return
    }
    wx.showLoading({ title: '等待戈多...' })
    preCtx.clearRect(0, 0, imageWidth, imageHeight)

    const width = croppingImageWidth
    const height = croppingImageHeight
    const xPos = Math.abs(clipImgX / xScale)
    const yPos = Math.abs(clipImgY / yScale)
    if (cropMode === 'circle') {
      // 圆形裁剪
      const radius = width / 2;
      const centerX = radius;
      const centerY = radius;
      
      // 创建圆形裁剪路径
      preCtx.save();
      preCtx.beginPath();
      preCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      preCtx.closePath();
      preCtx.clip();
      
      // 绘制图片
      preCtx.drawImage(imagePath, xPos, yPos, width, height, 0, 0, width, height);
      preCtx.restore();
    } else {
    preCtx.drawImage(imagePath, xPos, yPos, width, height, 0, 0, width, height)
    }
    preCtx.save()
    preCtx.restore()

    const that = this
    preCtx.draw(false, function () {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width,
          height,
          destWidth: width,
          destHeight: height,
          canvasId: 'main',
          success: (canRes) => {
            wx.hideLoading()
            
            that.initImage(width, height, canRes.tempFilePath)
            that.downloadCanvasImage();
          
          },
          fail (err) {
            wx.hideLoading()
            console.log(err)
          }
        })
      }, 200)
    })
  
  },
  getOriginImage () {
    if (!originPath) {
      return
    }
    const { originWidth, originHeight } = this.data
    this.initImage(originWidth, originHeight, originPath)
  },
  onConfirmCrop() {
    // … canvas 裁剪逻辑，得到裁剪后临时路径 cropPath …
    //const cropPath = /* 微信 API 获取到的文件路径 */;
    // 回传给上一页
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('cropDone', { cropPath });
    // 返回主页面
    wx.navigateBack();
  }
})