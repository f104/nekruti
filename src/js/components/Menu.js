import { BODY_MENU_OPENED_CLASS, CUSTOM_EVENT_OPTIMIZED_RESIZE, MENU_TOGGLER_CLASS } from '../constants'

export default class MenuClass {
  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }

    document.querySelectorAll(`.${MENU_TOGGLER_CLASS}`).forEach((button) => {
      button.addEventListener('click', () => toggle())
    })

    window.addEventListener(CUSTOM_EVENT_OPTIMIZED_RESIZE, () => toggle(true))

    const toggle = (hide = false) => {
      if (hide) {
        window.app.body.classList.remove(`${BODY_MENU_OPENED_CLASS}`)
      } else {
        window.app.body.classList.toggle(`${BODY_MENU_OPENED_CLASS}`)
      }
      window.app.body.classList.contains(`${BODY_MENU_OPENED_CLASS}`)
        ? window.app.addOverflowHiddenBody()
        : window.app.removeOverflowHiddenBody()
    }
  }
}
