import Notify from 'simple-notify'

export default class MessageClass {
  params = {
    position: 'bottom right',
    // autoclose: false,
  }

  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }
  }

  error({ title, text }) {
    this.message({ title, text }, 'error')
  }
  warning({ title, text }) {
    this.message({ title, text }, 'warning')
  }
  success({ title, text }) {
    this.message({ title, text }, 'success')
  }
  info({ title, text }) {
    this.message({ title, text }, 'info')
  }

  message({ title, text }, status) {
    new Notify({
      title: title,
      text: text,
      status: status,
      ...this.params,
    })
  }
}
