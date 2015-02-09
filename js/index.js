var render = require('fsj-render')
var debounce = require('debounce')
var util = require('util')

var add_satu_mare_images = require('./satu-mare')
var add_graph_matrix = require('./graph-matrix')
var text = require('./html-bundle.json')

window.onload = function() {
  var ee = render(main, nav, text)

  go(ee)

  setCurrentNode(document.getElementById(ee.current))

  ee.on('data', function(data) {
    setCurrentNode(document.getElementById(ee.current))
  })

  window.addEventListener('hashchange', function() {
    go(ee)
  })

  ;[].forEach.call(navSection.querySelectorAll('a'), function(el) {
    var data = key_to_title(el.firstChild.innerHTML || el.innerHTML)

    el.innerHTML = util.format(
        '<span class=date>%s</span> <span class="title">%s</title>'
      , data.date
      , data.title
    )

  })
}

function go(ee) {
  if(window.location.hash === '#!/navigation') {
      nav.style.display = 'block'
      main.innerHTML = ''
  } else {
      nav.style.display = 'none'
  }

  if(!window.location.hash.length) {
    ee.write('/README.md')
  }
  add_satu_mare_images()
  add_graph_matrix()
}

function setCurrentNode(data) {
  if(!data) {
    return
  }

  [].forEach.call(navSection.querySelectorAll('a'), function(el) {
    if(el.parentElement) el.parentElement.classList.remove('current')
  })

  if(data.parentElement) data.parentElement.classList.add('current')
}

function key_to_title(key) {
  var PARSE = /(\d{4}-\d{2}-\d{1,2})-(.*?)\.md$/
  var res = PARSE.exec(key)

  if(!res || !res[1] || !res[2]) {
    return {date: '', title: key}
  }

  return {date: res[1], title: res[2].replace(/-/g, ' ')}
}
