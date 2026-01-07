/**
 * 从相机或拍照选择图片
 * @param {*} type 
 * @param {*} callBack 
 */
function selectImageByAlbumOrCamera (type, callBack) {
  wx.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sizeType: [ 'original' ],
    sourceType: [ type ],
    success: (imgRes) => {
      callBack && callBack(imgRes)
    },
    fail: () => {
      wx.hideLoading()
      console.log('取消选择')
    }
  })
}

/**
 * 从聊天记录选择图片
 * @param {*} callBack 
 */
function selectImageFromRecord (callBack) {
  wx.chooseMessageFile({
    count: 1,
    type: 'image',
    success: (imgRes) => {
      callBack && callBack(imgRes)
    },
    fail: function() {
      wx.hideLoading()
      console.log('取消选择')
    }
  })
}

/**
 * 选择添加图片
 * @param {*} callBack 
 */
function selectPhoto (callBack) {
  let itemList = [ '拍照', '从手机相册选择', '从聊天记录选择' ]
  wx.showActionSheet({
    itemList,
    success: (action) => {
      if (action.tapIndex === 0) {
        selectImageByAlbumOrCamera('camera', callBack)
      } else if (action.tapIndex === 1) {
        selectImageByAlbumOrCamera('album', callBack)
      } else if (action.tapIndex === 2) {
        selectImageFromRecord(callBack)
      }
    },
    fail: () => {
      wx.hideLoading()
      console.log('取消选择')
    }
  })
}

/**
 * 调起客户端小程序设置界面，返回用户设置的操作结果。
 * @param {} authSetting 
 * @returns 
 */
function openSetting (authSetting) {
  return Promise((resolve, reject) => {
    wx.openSetting({
      success: (opSet) => {
        if (opSet.authSetting[authSetting]) {
          // 授权成功
          resolve(1)
        }
      },
      fail: () => {
        wx.showToast({ icon: 'none', title: '打开设置失败,请重新设置' })
        reject(0)
      }
    })
  })
}

/**
 * 获取授权
 * @param {*} authSetting 
 * @param {*} callBack 
 * @param {*} authMessage 
 */
function handlerAuthSetting (authSetting, callBack, authMessage = '') {
  wx.getSetting({
    success: (setting) => {
      if (setting.authSetting[authSetting]) {
        // 已授权
        callBack && callBack()
      } else {
        // 没授权，请求授权
        wx.authorize({
          scope: authSetting,
          success: () => {
            // 授权成功
            callBack && callBack()
          },
          fail: function() {
            // 授权失败
            wx.showModal({
              title: '温馨提示',
              content: authMessage,
              success: async () => {
                const isAuth = await openSetting(authSetting)
                isAuth && callBack && callBack()
              }
            })
          }
        })
      }
    }
  })
}

/**
 * 保存图片到相册
 * @param {*} imgSrc 
 */
function saveImage2Album(imgSrc) {
  wx.saveImageToPhotosAlbum({
    filePath: imgSrc,
    success: () => {
      wx.hideLoading()
      wx.vibrateShort()
      wx.showModal({
        content: '图片已保存到相册~',
        showCancel: false,
        confirmText: '好的',
        confirmColor: '#333'
      })
    },
    fail: (err) => {
      wx.hideLoading()
      console.log('失败原因：', err)
      wx.showToast({ icon: 'none', title: '保存失败' })
    }
  })
}

/**
 * 保存图片
 * @param {*} imgSrc 
 * @returns 
 */
function savePhoto (imgSrc) {
  if (!wx.saveImageToPhotosAlbum) {
    wx.hideLoading()
    return void wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
  handlerAuthSetting('scope.writePhotosAlbum', () => {
    saveImage2Album(imgSrc)
  }, '需要获取相册写入权限~')
}

module.exports = {
  selectPhoto,
  savePhoto
}
