clean:
	rm -rf dist

build: clean
	cooking build -c cooking.prod.js

dev:
	cooking watch -c cooking.dev.js

test: build
