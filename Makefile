# node-bedquilt makefile
MOCHA = ./node_modules/mocha/bin/mocha

all: docs test

test:
	$(MOCHA)

docs:
	echo 'Nope'
	#documentation -f md > docs/api_docs.md

.PHONY: all test docs
