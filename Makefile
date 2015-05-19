# node-bedquilt makefile

all: docs test

test:
	mocha

docs:
	documentation -f md > docs/api_docs.md

.PHONY: all test docs
