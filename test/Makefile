all: clean prepare
	env EDP_LOG_SLIENT=1 jasmine-node --nohelpers .


.PHONY: prepare
prepare:
	cp -r node_modules/edp-foo ../node_modules/edp-foo
	cp -r node_modules/edp-bar ../node_modules/edp-bar
	cp -r node_modules/edp-xyz ../node_modules/edp-xyz
	cp -r node_modules/edpx-bar2 ../node_modules/edpx-bar2

.PHONY: clean
clean:
	-rm -rf ../node_modules/edp-foo
	-rm -rf ../node_modules/edp-bar
	-rm -rf ../node_modules/edp-xyz
	-rm -rf ../node_modules/edpx-bar2