/**
 * @author Axel Boberg <hello@axelboberg.se>
 * @copyright Axel Boberg © 2021
 * @license MIT
 */

const PLAYABLE = {
  /**
   * Draw smtpe bars filling
   * the whole viewport
   * @returns { Function }
   */
  bars: () => {
    return function (canvas, ctx) {
      const colors = [
        '#ffffff',
        '#C0C000',
        '#FFEE00',
        '#00C0C0',
        '#00C000',
        '#C000C0',
        '#C00000',
        '#0000C0',
        '#000000'
      ]

      const width = canvas.width / colors.length

      for (let i = 0; i < colors.length; i++) {
        const x = width * i

        ctx.fillStyle = colors[i]
        ctx.fillRect(x, 0, width, canvas.height)
      }
    }
  },

  /**
   * Fill the viewport
   * with a single color
   * @param { String } color 
   * @returns { Function }
   */
  color: (color) => {
    return function (canvas, ctx) {
      ctx.fillStyle = color
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  },

  /**
   * Fill the viewport
   * with an image
   * @param { HTMLCanvasElement | HTMLImageElement | Image | String } input 
   * @returns { Function }
   */
  image: (input) => {
    let image = input
    if (typeof input === 'string') {
      image = new window.Image(1920, 1080)
      image.src = input
    }

    return function (canvas, ctx) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    }
  },

  /**
   * Draw frames using
   * the user's webcam
   * @returns { Function }
   */
  webcam: () => {
    let video

    ;(async function () {
      const stream = await window.navigator.mediaDevices.getUserMedia({ video: true })
      const el = document.createElement('video')

      el.srcObject = stream
      el.play()

      video = el
    })()

    return function (canvas, ctx) {
      if (!video) return
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }
  },

  video: url => {
    const video = document.createElement('video')
    video.src = url
    video.muted = true
    video.play()
    video.loop = true

    return function (canvas, ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }
  }
}

class Canvas {
  static get playableFactory () {
    return Object.freeze(PLAYABLE)
  }
  
  set source (val) {
    this._source = val
  }

  get source () {
    return this._source
  }

  get output () {
    return this._output
  }

  constructor () {
    this._loop()
  }

  /**
   * @private
   */
  _loop () {
    window.requestAnimationFrame(() => {
      this._draw()
      this._loop()
    })
  }

  /**
   * @private
   */
  _draw () {
    if (!this._source) return
    const ctx = this.canvas.getContext('2d')
    this._source(this.canvas, ctx)
  }

  render () {
    this.el = document.createElement('div')
    this.el.className = 'canvas'
  
    this.canvas = document.createElement('canvas')
    this.canvas.width = 1920
    this.canvas.height = 1080

    this.el.appendChild(this.canvas)
    return this.el
  }
}
window.CanvasComponent = Canvas
