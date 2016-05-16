install:
	@npm --registry=http://registry.npm.taobao.org install

clean:
	@rm -rf lib

build: install clean
	@cooking build

dev: install
	@cooking watch

test: build

publish: build
	@NODE_ENV=production cooking publish
