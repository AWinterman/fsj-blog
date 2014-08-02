var RSS = require('rss')
var marked = require('marked')
var fs = require('fs')
var jsdom = require('jsdom')
var browserify = require('browserify')
var add_graph_matrix = require('../js/graph-matrix')
var PATH = require('path')
var mkdirp = require('mkdirp')
var format = require('util').format

var feed = new RSS({
  title: 'Literature is Code',
  description: marked(fs.readFileSync('./README.md', {encoding: 'utf-8'})),
  feed_url: 'http://winterm.us/posts-rss.xml',
  site_url: 'http://winterm.us',
  language: 'en'
})

var PARSE = /^posts\/(\d{4}-\d{2}-\d{1,2})-(.*?)\.md$/

var dom = jsdom.jsdom(
    fs.readFileSync('./public/index.html')
  )

// it's better if you ignore this bit.
window = dom.parentWindow
document = dom
main = document.querySelector('#main')
nav = document.querySelector('#nav')

require('../public/bundle.js')
add_graph_matrix()

;[].slice.call(document.querySelectorAll('.post'))
  .forEach(function(post, i, posts) {
    var path = post.id

    var res = PARSE.exec(path)

    if(!res) {
      return
    }

    var title = res[2].replace('-', ' ')

    feed.item({
      title: title,
      description: post.querySelector('p').textContent,
      url: 'http://winterm.us#' + path,
      author: 'Andrew Winterman',
      date:  new Date(res[1])
    })
  })

fs.writeFile(PATH.join('.', 'public', 'posts-rss.xml'), feed.xml(), function(err) {
  if(err) {
    console.error(err)
    process.exit(1)
  }
})
