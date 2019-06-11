const originalPage = Page

// eslint-disable-next-line
Page = function (config) {
  const { onShow } = config

  config.onShow = async function (opts) {
    if (typeof onShow === 'function') {
      Reflect.apply(onShow, this, [opts])
    }
  }

  return originalPage(config)
}
