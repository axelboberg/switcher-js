/**
 * @author Axel Boberg <hello@axelboberg.se>
 * @copyright Axel Boberg © 2021
 * @license MIT
 */

const OUTPUT_LABELS = ['PVW', 'PGM']

const INPUT_ROWS = 2
const INPUT_LABELS = ['Webcam', 'Unsplash', 'Big Buck Bunny',,,,,'Black']
const INPUT_SOURCES = [
  window.CanvasComponent.playableFactory.webcam(),
  window.CanvasComponent.playableFactory.image('https://source.unsplash.com/random'),
  window.CanvasComponent.playableFactory.video('./media/BigBuckBunny_trailer.webm'),
  window.CanvasComponent.playableFactory.bars(),
  window.CanvasComponent.playableFactory.bars(),
  window.CanvasComponent.playableFactory.bars(),
  window.CanvasComponent.playableFactory.bars(), 
  window.CanvasComponent.playableFactory.color('black')
]

const outputs = document.querySelector('.outputs')
const inputs = document.querySelector('.inputs')

const inputCanvases = []
const outputCanvases = []

/*
Setup outputs
*/
;(function () {
  for (let i = 0; i < OUTPUT_LABELS.length; i++) {
    const canvas = new window.CanvasComponent()
    canvas.source = window.CanvasComponent.playableFactory.color('black')

    outputCanvases[i] = canvas

    const el = canvas.render()
    el.dataset.label = OUTPUT_LABELS[i]
    outputs.appendChild(el)
  }
})()

/*
Setup inputs
*/
;(function () {
  const rows = Array(INPUT_ROWS)
    .fill(undefined)
    .map(() => document.createElement('div'))

  for (let i = 0; i < INPUT_SOURCES.length; i++) {
    const canvas = new window.CanvasComponent()
    canvas.source = INPUT_SOURCES[i]

    inputCanvases[i] = canvas

    const el = canvas.render()
    el.addEventListener('click', () => {
      outputCanvases[0].source = window.CanvasComponent.playableFactory.image(canvas.canvas)
    })

    el.dataset.label = INPUT_LABELS[i] || i + 1

    const row = Math.floor(i / (INPUT_SOURCES.length / INPUT_ROWS))
    rows[row].appendChild(el)
  }
  
  rows.forEach(row => {
    inputs.appendChild(row)
  })
})()

/*
Setup keyboard shortcuts
*/
;(function () {
  window.addEventListener('keydown', e => {
    /*
    Set preview on digit
    */
    if (e.code.includes('Digit')) {
      const input = parseInt(e.key) - 1
      if (!inputCanvases[input]) return
      outputCanvases[0].source = window.CanvasComponent.playableFactory.image(inputCanvases[input].canvas)
      return
    }

    /*
    Cut on space
    */
    if (e.code === 'Space') {
      const tmp = outputCanvases[0].source
      outputCanvases[0].source = outputCanvases[1].source
      outputCanvases[1].source = tmp
    }
  })
})()
