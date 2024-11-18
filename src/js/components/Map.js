import { LOADED_CLASS, MAP_CLASS, MAP_DATA_GEO_FIELD } from '../constants'

export default class MapClass {
  mapCenter = [55.76, 37.64]
  mapZoom = 9

  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }

    this.init()
  }

  async init() {
    const containers = document.querySelectorAll(`.${MAP_CLASS}[${MAP_DATA_GEO_FIELD}]`)
    if (!containers.length) {
      return
    }

    const apiKey = window.app?.yandexMapApiKey
    const lang = window.app?.lang || 'ru'

    if (!apiKey) {
      console.error('yandexMapApiKey empty')
      return
    }

    const ymapsLib = (await import('ymaps')).default
    if (!ymapsLib) {
      console.error('ymapsLib error')
      return
    }

    const mapUrl = `https://api-maps.yandex.ru/2.1/?lang=${lang}_RU&apikey=${apiKey}`
    const markerTpl = `
      <div class="contacts-map__placemark {{ properties.className }}">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0H32L27.7551 32H0V0Z" fill="#E31E24"></path>
          <path d="M24.4277 22.342L24.6854 21.9162L24.2609 21.6565L23.4718 21.1738L23.0555 20.9191L22.7908 21.3291C21.057 24.0145 19.0367 25.2745 16.7283 25.2745C15.3287 25.2745 14.0984 24.743 13.0242 23.6587C12.0626 22.6453 11.3295 21.2984 10.8584 19.5893C10.5385 18.4104 10.3739 17.1404 10.3739 15.7623C10.3739 14.2491 10.5209 12.9317 10.8091 11.7759L10.8094 11.7746C11.2132 10.1362 11.8359 8.84824 12.6508 7.90583C13.5803 6.84796 14.679 6.3393 15.9652 6.3393C18.2694 6.3393 20.2961 8.06567 21.9623 11.9487L22.0922 12.2515H22.4217H23.2109H23.7109V11.7515V5.11884V4.61884H23.2109H22.1543H21.9199L21.77 4.79908C21.3906 5.25511 20.9485 5.45814 20.4196 5.45814C19.9466 5.45814 19.1882 5.31967 18.1227 5.00345L18.1227 5.00345L18.1219 5.00321C17.0318 4.68163 16.1521 4.5 15.5152 4.5C12.6547 4.5 10.2546 5.64708 8.34468 7.90019L8.34413 7.90084C6.44033 10.1545 5.5 12.9017 5.5 16.104C5.5 19.3151 6.45442 22.0292 8.37704 24.2111L8.37762 24.2117C10.3102 26.397 12.735 27.5 15.6196 27.5C19.4076 27.5 22.3615 25.7556 24.4277 22.342Z" fill="white" stroke="white"></path>
        </svg>
      </div>`

    ymapsLib.load(mapUrl).then((maps) => {
      containers.forEach((el) => {
        let geo = undefined
        try {
          geo = JSON.parse(el.getAttribute(MAP_DATA_GEO_FIELD))
          if (window.app.isMobile || window.app.isTablet) {
            geo.coords.center[0] += 0.015
          } else {
            geo.coords.center[1] -= 0.02
          }
        } catch (e) {
          console.error(e)
        }
        if (geo) {
          el.classList.add(LOADED_CLASS)
          const map = new maps.Map(
            el,
            {
              center: geo.coords?.center || this.mapCenter,
              zoom: geo.coords?.zoom || this.mapZoom,
              controls: [],
            },
            {
              yandexMapDisablePoiInteractivity: true,
              autoFitToViewport: 'always',
            },
          )
          map.behaviors.disable('scrollZoom')
          map.controls.add('zoomControl', {
            position: {
              bottom: '50px',
              right: '10px',
            },
          })

          const tpl = ymaps.templateLayoutFactory.createClass(markerTpl)
          const placemarkOptions = {
            iconLayout: tpl,
            iconShape: {
              type: 'Rectangle',
              coordinates: [
                [-16, -32],
                [16, 0],
              ],
            },
            cursor: 'default',
          }

          geo.placemarks?.forEach((item) => {
            if (item.coords) {
              const placemark = new ymaps.Placemark(
                item.coords,
                {
                  cursor: 'default',
                },
                placemarkOptions,
              )
              map.geoObjects.add(placemark)
            }
          })
        }
      })
    })
  }
}
