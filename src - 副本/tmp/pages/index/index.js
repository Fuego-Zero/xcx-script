Page({
  data: {
    input: ''
  },
  // options(Object)
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  bindInput (e) {
    this.setData({
      input: e.detail.value
    })
  },
  async parse () {
    if (this.data.input === '') return

    wx.showLoading({
      title: '转换中',
      mask: true
    })

    wx.request({
      url: 'https://test.api.fuego.site/api/msg/parse',
      data: { msg: this.data.input },
      method: 'POST',
      success: ({ data }) => {
        this.setData({
          input: data
        })

        wx.hideLoading()
      }
    })
  },
  copy () {
    wx.setClipboardData({
      data: this.data.input
    })
  },
  paste () {
    wx.getClipboardData({
      success: ({ data }) => {
        this.setData({
          input: data
        })
      }
    })
  },
  clean () {
    this.setData({
      input: ''
    })
  }
})
