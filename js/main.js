var markdown = require('./html-bundle.json')
  , EventEmitter = require('events').EventEmitter
  , classlist = require('class-list')
  , add_satu_mare_images = require('./satu-mare')
  , add_graph_matrix = require('./graph-matrix')
  , qs = require('querystring')

var data = {}
  , state = {}
  , routes = {}
  , i = 0

parse(markdown, data, [], main, nav, false, posts_rendered)

function navigate(point) {
  if(state.current) {
    state.current.classlist.add('hidden')
    state.current.nav.classlist.remove('current')
  }

  point.classlist.remove('hidden')
  point.nav.classlist.add('current')

  point.events.emit('focus', point)

  state.current = point
}

function posts_rendered(data) {
  window.onhashchange = function(ev) {
    var key = window.location.hash.slice(1)

    if(routes[key]) {
      navigate(routes[key])
    }
  }
}

function parse(markdown, data, path, main, nav, reverse, done) {
  var keys = Object.keys(markdown).map(decodeURIComponent)

  i += keys.length

  keys.sort()

  if(reverse) {
    keys.reverse()
  }

  handle(keys)

  function handle(keys) {
    var key = keys.shift()

    if(!i) {
      // then there are no more keys left, anywhere.
      return done(data)
    }

    if(!key) {
      return
    }

    data[key] = data[key] || {}

    if(typeof markdown[key] === 'object') {
      handle_obj(key)
    } else {
      handle_post(key)
    }

    i--
    handle(keys)
  }

  function handle_post(key) {
    var el = document.createElement('div')

    el.innerHTML = markdown[key]
    el.setAttribute('data-name', key)
    el.id = path.concat([key]).join('/')

    var title = key_to_title(key)

    var anchor = document.createElement('a')
      , li = document.createElement('li')
      , span


    li.appendChild(anchor)

    anchor.innerHTML = title ? title.date + ' ' + title.title : key
    anchor.setAttribute('href', '#' + el.id)

    data[key].key = key
    data[key].markdown = markdown[key]
    data[key].el = el
    data[key].events = new EventEmitter

    data[key].classlist = classlist(el)

    data[key].nav = li
    data[key].nav.classlist = classlist(li)
    data[key].routes = [data[key].el.id, path.concat([key]).join('-')]

    routes[path.concat([key]).join('-')] = data[key]
    routes[data[key].el.id] = data[key]

    data[key].classlist.add('post')
    data[key].nav.classlist.add('nav')

    main.appendChild(data[key].el)
    nav.appendChild(data[key].nav)

    anchor.onclick = function(ev) {
      ev.preventDefault()
      window.location.hash = data[key].el.id
    }

    if(key === 'README.md') {
      data[key].routes.push('')
      routes[''] = data[key]
    }

    if(data[key].routes.indexOf('posts/2014-05-14-satu-mare.md') > -1) {
      data[key].events.once('focus', add_satu_mare_images)
    }

    if(data[key].routes.indexOf('posts/2014-05-31-plot-matrices.md') > -1) {
      data[key].events.once('focus', add_graph_matrix)
    }

    if(data[key].routes.indexOf(window.location.hash.slice(1)) === -1) {
      data[key].classlist.add('hidden')
    } else {
      state.current = data[key]
      data[key].nav.classlist.add('current')
      data[key].events.emit('focus', data[key])
    }
  }



  function handle_obj(key) {
    data[key].children = {}

    var new_nav = document.createElement('ul')
      , h2 = document.createElement('h2')

    h2.innerHTML = key

    nav.appendChild(h2)
    nav.appendChild(new_nav)

    data[key].header = h2
    data[key].nav = new_nav

    parse(
        markdown[key]
      , data[key].children
      , path.concat([key])
      , main
      , new_nav
      , key === 'posts'
      , done
    )
  }
}

function key_to_title(key) {
  var PARSE = /(\d{4}-\d{2}-\d{1,2})-(.*?)\.md$/
  var res = PARSE.exec(key)

  if(!res) {
    return false
  }

  return {date: res[1], title: res[2].replace(/-/g, ' ')}
}

