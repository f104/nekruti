import {
  HIDDEN_CLASS_NAME,
  MAIN_SLIDER_CLASS,
  SWIPER_BTN_NEXT_CLASS,
  SWIPER_BTN_PREV_CLASS,
  SWIPER_FRACTION_LANG_EN,
  SWIPER_FRACTION_LANG_RU,
  SWIPER_HIDE_IN_TRANSITION_CLASS,
  SWIPER_PAGINATION_CLASS,
  SWIPER_SLIDE_CLASS,
} from '../constants'
import Swiper from 'swiper'
import { Keyboard, Navigation, Pagination, A11y } from 'swiper/modules'

export default class SlidersClass {
  commonParams = {
    modules: [Keyboard, Navigation, Pagination, A11y],
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
}
