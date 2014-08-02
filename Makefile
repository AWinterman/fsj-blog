SHELL := /bin/bash

all: romania markup bundle rss

bundle: js/*
	browserify -t brfs -d js/main.js > public/bundle.js

markup: posts/*
	fsj -f "node_modules/.bin/marked" README.md posts todos > js/html-bundle.json

rss: bundle markup
	node scripts/rss.js

romania: public/images/romania/*
	node scripts/romania-pictures > js/pictures.json

