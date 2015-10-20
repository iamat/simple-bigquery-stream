MOCHA=./node_modules/.bin/mocha
MOCHA_OPTS= --check-leaks --ui tdd --globals NODE_CONFIG
TESTS = test/*.js
REPORTER = spec # dot

ISTANBUL=./node_modules/.bin/istanbul
_MOCHA=node_modules/.bin/_mocha


ifeq "$(MOCHA_TIMEOUT)" ""
	TIMEOUT=600
else
	TIMEOUT=$(MOCHA_TIMEOUT)
endif

testall:
	@NODE_ENV=test $(MOCHA) \
		--timeout $(TIMEOUT) \
		--reporter $(REPORTER) \
		$(TESTS) \
		$(MOCHA_OPTS)

test:
	@NODE_ENV=test $(MOCHA) \
		--timeout $(TIMEOUT) \
		--reporter $(REPORTER) \
		$(TEST) \
		$(MOCHA_OPTS)

testndebug:
	@NODE_ENV=test $(MOCHA) \
		--timeout $(TIMEOUT) \
		--reporter $(REPORTER) \
		$(TEST) \
		$(MOCHA_OPTS) \
		--debug-brk

coverage:
	@test -d reports || mkdir reports
	@NODE_ENV=test $(ISTANBUL) \
		cover \
		--dir ./reports \
		$(_MOCHA) \
		-- \
		$(TEST) \
		$(MOCHA_OPTS)

test/%.js : FORCE
	@NODE_ENV=test $(MOCHA) \
		--timeout $(TIMEOUT) \
		--reporter $(REPORTER) \
		$@ \
		$(MOCHA_OPTS)

FORCE:

.PHONY: testall test coverage testndebug
