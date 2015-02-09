var EventEmitter = require('events').EventEmitter
  , pictures = require('./pictures.json')
  , classlist = require('class-list')

module.exports = function() {
  if(window.location.hash.slice(2) ===  '/posts/2014-05-14-satu-mare.md') {
    add_satu_mare_images(main)
  }
}

function add_satu_mare_images(satu_mare) {
  var pictures_el = document.createElement('div')
    , more = document.createElement('div')
    , counter = 0
    , limit = 4

  more.innerHTML = "<a href='#'>Load more images</a>"
  more.onclick = function(ev) {
    ev.preventDefault()

    images.emit('ready')
  }

  more_cl = classlist(more)
  more_cl.add("button-wide")

  satu_mare.appendChild(pictures_el)
  satu_mare.appendChild(more)
  satu_mare.appendChild(document.createElement('hr'))

  var images = serial_images(pictures_el, pictures)

  images.on('ready', function() {
    ++counter
    if(counter < limit) {
      return images.emit('go')
    }

    counter = 0
  })

  images.on('done', function() {
    more_cl.add("hidden")
  })

  images.emit('go')
}

function serial_images(el, image_urls) {
  var EE = new EventEmitter
    , i = 0

  EE.on('go', function() {
    var image = new Image
      , anchor = document.createElement('a')
      , span = document.createElement('span')
      , container = document.createElement('div')

    var cl = classlist(container)

    // order matters
    anchor.href = image_urls[i]
    span.innerHTML = image_urls[i].split('.')[0].split('/').slice(-1)
    image.src = image_urls[i]

    i++

    cl.add('photo')

    if(i < image_urls.length) {
      image.onload = function() {
        EE.emit('ready')
      }
    } else {
      EE.emit('done')
      EE.removeAllListeners('go')
      EE.removeAllListeners('ready')
    }

    anchor.appendChild(image)

    container.appendChild(anchor)
    container.appendChild(span)

    el.appendChild(container)
  })

  return EE
}


