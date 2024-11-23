import {
  CUSTOM_EVENT_OPTIMIZED_RESIZE,
  HIDDEN_CLASS_NAME,
  MAIN_SLIDER_CLASS,
  PRODUCTS_SLIDER_CLASS,
  PRODUCT_SLIDER_CLASS,
  PRODUCT_SLIDER_MAIN_CLASS,
  PRODUCT_SLIDER_NAV_CLASS,
  SWIPER_BTN_NEXT_CLASS,
  SWIPER_BTN_PREV_CLASS,
  SWIPER_FRACTION_LANG_EN,
  SWIPER_FRACTION_LANG_RU,
  SWIPER_HIDE_IN_TRANSITION_CLASS,
  //SWIPER_PAGINATION_CLASS,
  SWIPER_SLIDE_CLASS,
} from '../constants'
import Swiper from 'swiper'
import { Keyboard, Navigation, Pagination, A11y, Thumbs } from 'swiper/modules'

export default class SlidersClass {
  commonParams = {
    modules: [Keyboard, Navigation, Pagination, A11y, Thumbs],
    watchOverflow: true,
    watchSlidesProgress: true,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
      pageUpDown: false,
    },
  }

  fractionLang = undefined

  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }
    this.fractionLang = window.app.lang === 'ru' ? SWIPER_FRACTION_LANG_RU : SWIPER_FRACTION_LANG_EN

    this.initMainSlider()
    this.initProductsSlider()
    this.initProductSlider()
  }

  renderFraction(currentClass, totalClass) {
    return `<span class="${currentClass}"></span> ${this.fractionLang} <span class="${totalClass}"></span>`
  }

  initMainSlider() {
    document.querySelectorAll(`.${MAIN_SLIDER_CLASS}`).forEach((el) => {
      const hideOnTransitionEls = el.querySelectorAll(`.${SWIPER_HIDE_IN_TRANSITION_CLASS}`)
      const totalSlides = el.querySelectorAll(`.${SWIPER_SLIDE_CLASS}`).length
      new Swiper(el, {
        ...this.commonParams,
        slidesPerView: 1,
        loop: totalSlides > 1,
        autoHeight: true,
        breakpoints: {
          1024: {
            slidesPerView: 'auto',
            centeredSlides: true,
          },
        },
        navigation: {
          nextEl: el.querySelector(`.${SWIPER_BTN_NEXT_CLASS}`),
          prevEl: el.querySelector(`.${SWIPER_BTN_PREV_CLASS}`),
        },
        on: {
          touchStart: () => {
            hideOnTransitionEls.forEach((el) => {
              el.classList.add(HIDDEN_CLASS_NAME)
            })
          },
          transitionEnd: () => hideOnTransitionEls.forEach((el) => el.classList.remove(HIDDEN_CLASS_NAME)),
        },
      })
    })
  }

  initProductsSlider() {
    document.querySelectorAll(`.${PRODUCTS_SLIDER_CLASS}`).forEach((el) => {
      const isFullList = el.classList.contains('_full')

      let swiper = null

      const init = () => {
        if (!swiper) {
          swiper = new Swiper(el, {
            ...this.commonParams,
            slidesPerView: 'auto',
            breakpoints: {
              1440: {
                slidesPerView: 5,
              },
            },
          })
        }
      }
      const destroy = () => {
        if (swiper) {
          swiper.destroy()
          swiper = null
        }
      }

      if (!isFullList || window.app.isMobile || window.app.isTablet) {
        init(el)
      }

      if (isFullList) {
        window.addEventListener(CUSTOM_EVENT_OPTIMIZED_RESIZE, () => {
          window.app.isMobile ? init() : destroy()
        })
      }
    })
  }

  initProductSlider() {
    document.querySelectorAll(`.${PRODUCT_SLIDER_CLASS}`).forEach((el) => {
      const main = el.querySelector(`.${PRODUCT_SLIDER_MAIN_CLASS}`)
      if (main) {
        const nav = el.querySelector(`.${PRODUCT_SLIDER_NAV_CLASS}`)
        let thumbsSwiper = undefined
        if (nav) {
          thumbsSwiper = new Swiper(nav, {
            watchOverflow: true,
            watchSlidesProgress: true,
            slidesPerView: 'auto',
          })
        }
        new Swiper(main, {
          ...this.commonParams,
          navigation: {
            nextEl: el.querySelector(`.${SWIPER_BTN_NEXT_CLASS}`),
            prevEl: el.querySelector(`.${SWIPER_BTN_PREV_CLASS}`),
          },
          thumbs: {
            swiper: thumbsSwiper,
          },
        })
      }
    })
  }
}
