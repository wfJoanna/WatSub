// const version = require('element-ui/package.json').version // element-ui version from node_modules
const ORIGINAL_THEME = '#409EFF' // default color
class ChangeTheme {
  constructor () {
    this.oldColor = '#409EFF'
    // this.chalk = require('./index.txt');
    this.csslinks = []
    this.styles = []
  }

  initCss () {
    const csslinks = []
    for (let i = 0; i < document.head.children.length; i++) {
      const node = document.head.children[i]
      if (node.nodeName === 'LINK' || node.nodeName === 'link') {
        const url = node.getAttribute('href')
        if (url.lastIndexOf('.css') > -1 && node.rel !== 'preload') {
          // let styledom = document.createElement('style');
          const newLinkDom = document.createElement('link')
          newLinkDom.rel = 'stylesheet'
          csslinks.push({
            type: 'link',
            dom: newLinkDom,
            // styleDom: styledom,
            rawUrl: url,
            cssText: '',
            objUrl: null
          })
        }
      } else if (node.nodeName === 'STYLE' || node.nodeName === 'style') {
        csslinks.push({
          type: 'style',
          dom: node,
          rawUrl: '',
          cssText: node.innerText, // new RegExp(ORIGINAL_THEME, 'i').test(text) && !/Chalk Variables/.test(text),
          objUrl: null
        })
      }
    }

    const promises = []
    for (let i = 0; i < csslinks.length; i++) {
      const item = csslinks[i]
      if (item.type === 'link') {
        promises.push(this.getCssText(item.rawUrl))
      }
    }
    // const styles = [].slice.call(document.querySelectorAll('style'))
    //     .filter(style => {
    //         const text = style.innerText
    //         return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
    //     });
    this.csslinks = csslinks
    return new Promise((resolve, reject) => {
      Promise.all(promises).then((cssarr) => {
        // console.log('合并后的cssarr',cssarr)
        for (let i = 0; i < cssarr.length; i++) {
          csslinks[i].cssText = cssarr[i]
        }
        // console.log('this.cssLinks',this.csslinks)
        resolve('success')
      }).catch(() => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('error')
      })
    })
  }

  /** 改变颜色  当前颜色  原始颜色 */
  changeTheme (val) {
    // let oldVal = this.oldColor;
    const themeCluster = this.getThemeCluster(val.replace('#', ''))
    const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''))
    // console.log('themeCluster =',themeCluster,originalCluster)
    this.csslinks.forEach(item => {
      let styleCssText = this.updateStyle(item.cssText, originalCluster, themeCluster)
      if (item.type === 'style') {
        item.dom.innerText = styleCssText
      } else if (item.type === 'link') {
        // styleCssText = styleCssText.replace(new RegExp('../', 'ig'), '/');
        styleCssText = styleCssText.replace(/\.\.\//g, '/')
        styleCssText = styleCssText.replace(/@font-face{[^}]+}/, '')
        // item.dom.remove();
        // item.styleDom.innerText = styleCssText;
        if (item.objUrl) {
          window.URL.revokeObjectURL(item.objUrl)
        }
        const blob = new Blob([styleCssText], { type: 'text/css;charset=utf-8' })
        item.objUrl = window.URL.createObjectURL(blob)
        item.dom.href = item.objUrl
        document.head.appendChild(item.dom)
      }
    })
    // console.log('原色',originalCluster)
    // console.log('替换色',themeCluster)
    // const getHandler = (variable, id) => {
    //     return () => {
    //         const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''))
    //         const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster)

    //         let styleTag = document.getElementById(id)
    //         if (!styleTag) {
    //             styleTag = document.createElement('style')
    //             styleTag.setAttribute('id', id)
    //             document.head.appendChild(styleTag)
    //         }
    //         styleTag.innerText = newStyle
    //     }
    // }
    // const chalkHandler = getHandler('chalk', 'chalk-style')

    // if (!this.chalk) {
    //     const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
    //     // const url = 'assets/chalk/index.css';
    //     this.getCSSString(url, chalkHandler, 'chalk')
    // } else {
    // chalkHandler()
    // }

    // const styles = [].slice.call(document.querySelectorAll('style'))
    //     .filter(style => {
    //         const text = style.innerText
    //         return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
    //     });
    // // console.log('styles',styles)
    // styles.forEach(style => {
    //     const { innerText } = style
    //     if (typeof innerText !== 'string') return
    //     style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
    // })

    // this.oldColor = val;
  }

  // 加载css文本
  getCssText (url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.responseType = 'text' // 配置数据返回类型
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            resolve(xhr.response)
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('')
          }
        }
      }
      xhr.open('GET', url, true)
      xhr.send()
    })
  }

  updateStyle (style, oldCluster, newCluster) {
    let newStyle = style
    oldCluster.forEach((color, index) => {
      newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
    })
    return newStyle
  }

  getCSSString (url, callback, variable) {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
        callback()
      }
    }
    xhr.open('GET', url)
    xhr.send()
  }

  getThemeCluster (theme) {
    const tintColor = (color, tint) => {
      let red = parseInt(color.slice(0, 2), 16)
      let green = parseInt(color.slice(2, 4), 16)
      let blue = parseInt(color.slice(4, 6), 16)

      if (tint === 0) { // when primary color is in its rgb space
        return [red, green, blue].join(',')
      } else {
        red += Math.round(tint * (255 - red))
        green += Math.round(tint * (255 - green))
        blue += Math.round(tint * (255 - blue))

        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)

        red = red.length === 1 ? '0' + red : red
        green = green.length === 1 ? '0' + green : green
        blue = blue.length === 1 ? '0' + blue : blue

        return `#${red}${green}${blue}`
      }
    }

    const shadeColor = (color, shade) => {
      let red = parseInt(color.slice(0, 2), 16)
      let green = parseInt(color.slice(2, 4), 16)
      let blue = parseInt(color.slice(4, 6), 16)

      red = Math.round((1 - shade) * red)
      green = Math.round((1 - shade) * green)
      blue = Math.round((1 - shade) * blue)

      red = red.toString(16)
      green = green.toString(16)
      blue = blue.toString(16)

      red = red.length === 1 ? '0' + red : red
      green = green.length === 1 ? '0' + green : green
      blue = blue.length === 1 ? '0' + blue : blue

      return `#${red}${green}${blue}`
    }

    const clusters = [theme]
    for (let i = 0; i <= 9; i++) {
      clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
    }
    clusters.push(shadeColor(theme, 0.1))
    return clusters
  }
}

export default new ChangeTheme()
