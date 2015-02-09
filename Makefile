SHELL := /bin/bash

all: markup romania bundle rss

bundle: js/*
	browserify -d js/index.js > public/bundle.js

markup: posts/*
	fsj -t "node_modules/.bin/marked" posts README.md > js/html-bundle.json

rss: bundle markup
	node scripts/rss.js

romania: public/images/romania/*
	node scripts/romania-pictures > js/pictures.json

