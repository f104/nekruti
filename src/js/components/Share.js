import { SHARE_NETWORK_CLASS, CLIPBOARD_BTN_CLASS } from '../constants'

export default class ShareClass {
  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }
    this.init()
  }

  init() {
    this.initShare()
    this.clipboard()
  }

  initShare() {
    let rsShare = {
      vkontakte: function (purl, ptitle, pimg, text) {
        let url = 'https://vk.com/share.php?'
        url += 'url=' + encodeURIComponent(purl)
        url += '&title=' + encodeURIComponent(ptitle)
        url += '&description=' + encodeURIComponent(text)
        url += '&image=' + encodeURIComponent(pimg)
        url += '&noparse=true'
        rsShare.popup(url)
      },
      odnoklassniki: function (purl) {
        let url = 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki'
        url += '&st.shareUrl=' + encodeURIComponent(purl)
        rsShare.popup(url)
      },
      facebook: function (purl) {
        let url = 'https://www.facebook.com/sharer.php?'
        url += 'u=' + encodeURIComponent(purl)
        rsShare.popup(url)
      },
      twitter: function (purl, ptitle) {
        let url = 'https://twitter.com/share?'
        url += 'text=' + encodeURIComponent(ptitle)
        url += '&url=' + encodeURIComponent(purl)
        rsShare.popup(url)
      },
      mailru: function (purl, ptitle, pimg, text) {
        let url = 'https://connect.mail.ru/share?'
        url += 'url=' + encodeURIComponent(purl)
        url += '&title=' + encodeURIComponent(ptitle)
        url += '&description=' + encodeURIComponent(text)
        url += '&imageurl=' + encodeURIComponent(pimg)
        rsShare.popup(url)
      },
      google: function (purl) {
        let url = 'https://plus.google.com/share?'
        url += 'url=' + encodeURIComponent(purl)
        rsShare.popup(url)
      },
      telegram: function (purl, ptitle) {
        let url = 'tg://msg_url?'
        url += 'url=' + encodeURIComponent(purl)
        url += '&text=' + encodeURIComponent(ptitle)
        rsShare.popup(url)
      },
      popup: function (url) {
        window.open(url, '', 'toolbar=0,status=0,width=626,height=436')
      },
    }

    document.addEventListener('click', (event) => {
      const link = event.target.closest(`.${SHARE_NETWORK_CLASS}`)

      if (!link) {
        return
      }

      event.preventDefault()

      const ptitle = document.querySelector('meta[property="og:title"]').getAttribute('content') || ''
      const pdesc = document.querySelector('meta[property="og:description"]').getAttribute('content') || ''
      const pimg = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''

      if (link.classList.contains('_facebook')) {
        rsShare.facebook(location.href, ptitle, pimg, pdesc)
      } else if (link.classList.contains('_twitter')) {
        rsShare.twitter(location.href, ptitle)
      } else if (link.classList.contains('_ok')) {
        rsShare.odnoklassniki(location.href)
      } else if (link.classList.contains('_vk')) {
        rsShare.vkontakte(location.href, ptitle, pimg, pdesc)
      } else if (link.classList.contains('_tg')) {
        rsShare.telegram(location.href, ptitle)
      }
    })
  }

  clipboard() {
    document.addEventListener('click', (event) => {
      const btn = event.target.closest(`.${CLIPBOARD_BTN_CLASS}`)

      if (!btn) {
        return
      }

      const url = btn.dataset.url || location

      if (url) {
        navigator.clipboard
          .writeText(url)
          .then(() => {
            window.app.message.success({ text: 'Скопировано' })
          })
          .catch(() => {
            window.app.message.error({
              title: 'Ошибка!',
              text: 'Текст не скопирован',
            })
          })
      }
    })
  }
}
