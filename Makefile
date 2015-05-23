# node-bedquilt makefile

all: docs test

test:
	mocha

docs:
	echo 'Nope'
	#documentation -f md > docs/api_docs.md

.PHONY: all test docs
