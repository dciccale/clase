# vim: ts=2 sw=2 noexpandtab

default: lint test

lint:
	-@node ./node_modules/jshint/bin/jshint lib/clase.js

test:
	@node ./node_modules/nodeunit/bin/nodeunit

build:
	-@node ./node_modules/uglify-js/bin/uglifyjs lib/clase.js -m -c -o lib/clase.min.js

install:
	-@npm install

.PHONY: lint test build
