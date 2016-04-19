clean:
	rm -rf lib

build: clean
	cooking build -c cooking.prod.js

dev:
	cooking watch -c cooking.dev.js

test: build

publish: build
	npm publish