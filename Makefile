# node-bedquilt makefile

test:
	mocha

docs:
	documentation -f md > docs/api_docs.md

.PHONY: test docs
