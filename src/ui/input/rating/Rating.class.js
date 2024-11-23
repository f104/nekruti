import {
  RATING_STAR,
  RATING_STAR_RADIO,
  ACTIVE_CLASS_NAME,
  DATA_FOCUS_FIRST_INVISIBLE,
  DATA_FOCUS_VISIBLE_ADDED,
  FORM_INPUT_ERROR_MESSAGE_CLASS,
  DATA_ERROR_MESSAGE,
  HIDDEN_CLASS_NAME,
  ARIA_HIDDEN,
  ERROR_CLASS_NAME,
  ARIA_INVALID,
  ARIA_LABELLEDBY,
} from '../../../js/constants'

export class RatingInputClass {
  constructor(config) {
    this.value = config?.value || ''
    this.error = config?.error || false
    this.element = config?.element || null
    this.novalidate = config?.novalidate || false

    this.inputs = []
    this.input = null
    this.errorMessageEl = null
    this.required = false
    this.disabled = false
    this.message = ''
    this.errorId = ''
    this.name = ''
    this.ratingStar = []
    this.isHidden = window.app.elementIsHidden(this.element)
    this.form = null

    if (this.element && !config?.isSuper) {
      this.init()
    }
  }

  init() {
    this.ratingStar = this.element.querySelectorAll(`.${RATING_STAR}`)
    this.errorMessageEl = this.element.querySelector(`.${FORM_INPUT_ERROR_MESSAGE_CLASS}`)
    this.message = this.element.getAttribute(DATA_ERROR_MESSAGE) || ''
    this.form = this.element.closest('form')

    if (this.errorMessageEl) {
      this.errorId = this.errorMessageEl.getAttribute('id')
    }

    this.ratingStar.forEach((rateRadio, index) => {
      const radio = rateRadio.querySelector(`.${RATING_STAR_RADIO}`)

      const setActive = (i) => {
        this.ratingStar.forEach((el) => {
          el.classList.remove(`${ACTIVE_CLASS_NAME}`)
        })
        this.ratingStar[i].classList.add(`${ACTIVE_CLASS_NAME}`)
      }

      if (radio) {
        this.required = radio.hasAttribute('required')
        this.disabled = radio.hasAttribute('disabled')
        this.name = radio.getAttribute('name')

        if (radio.checked) {
          this.value = radio.value
          setActive(index)
        }

        this.input = radio
        this.inputs.push(radio)

        radio.addEventListener('input', () => {
          this.value = radio.value
          setActive(index)

          if (!this.novalidate) {
            this.checkValid()
          }
        })
        radio.addEventListener('focus', () => {
          if (radio.hasAttribute(DATA_FOCUS_VISIBLE_ADDED) && !radio.value) {
            rateRadio.parentElement.classList.add(DATA_FOCUS_FIRST_INVISIBLE)
          }
        })
        radio.addEventListener('blur', () => {
          rateRadio.parentElement.classList.remove(DATA_FOCUS_FIRST_INVISIBLE)

          if (!this.novalidate) {
            this.checkValid()
          }
        })
        rateRadio.addEventListener('mouseup', () => {
          if (radio.checked && !radio.hasAttribute('required')) {
            setActive(0)
            setTimeout(() => {
              radio.checked = false
            }, 0)
          }
        })
      }
    })
  }

  setInvalid(serverError) {
    if (this.errorMessageEl) {
      this.errorMessageEl.innerText = serverError || this.message
      this.errorMessageEl.classList.remove(HIDDEN_CLASS_NAME)
      this.errorMessageEl.removeAttribute(ARIA_HIDDEN)
    }

    if (this.element) {
      this.element.classList.add(ERROR_CLASS_NAME)
    }

    this.inputs.forEach((input) => {
      input.setAttribute(ARIA_INVALID, 'true')
      input.classList.add(ERROR_CLASS_NAME)

      if (this.errorId) {
        const ariaLabelledby = input.getAttribute(ARIA_LABELLEDBY) || ''
        const isIdContains = ariaLabelledby.includes(this.errorId)

        if (!isIdContains) {
          input.setAttribute(ARIA_LABELLEDBY, `${ariaLabelledby} ${this.errorId}`.trim())
        }
      }
    })

    this.error = true
  }

  setValid() {
    if (this.errorMessageEl) {
      this.errorMessageEl.classList.add(HIDDEN_CLASS_NAME)
      this.errorMessageEl.setAttribute(ARIA_HIDDEN, 'true')
    }

    if (this.element) {
      this.element.classList.remove(ERROR_CLASS_NAME)
    }

    this.inputs.forEach((input) => {
      if (this.errorId) {
        let ariaLabelledby = input.getAttribute(ARIA_LABELLEDBY) || ''
        ariaLabelledby = ariaLabelledby.replace(this.errorId, '').trim()

        if (ariaLabelledby) {
          input.setAttribute(ARIA_LABELLEDBY, ariaLabelledby)
        } else {
          input.removeAttribute(ARIA_LABELLEDBY, ariaLabelledby)
        }
      }

      input.removeAttribute(ARIA_INVALID)
      input.classList.remove(ERROR_CLASS_NAME)
    })

    this.error = false
  }

  checkValid(serverError = '') {
    if (this.inputs.length) {
      this.inputs.forEach((input) => {
        if (input.checked) {
          this.value = (input.value || '').trim()
        }
      })

      if (!!serverError || (!this.value && this.required && !this.disabled)) {
        this.setInvalid(serverError)
      } else {
        this.setValid()
      }
    } else {
      this.error = false
    }

    return !this.error
  }

  reset() {
    this.value = ''

    this.inputs.forEach((input) => {
      input.checked = false
    })

    this.ratingStar.forEach((el, i) => {
      el.classList.toggle(`${ACTIVE_CLASS_NAME}`, !i)
    })
    this.setValid()
  }
}
