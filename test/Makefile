all:
	@cp -r edp-foo edpx-bar ../node_modules
	env EDP_LOG_SLIENT=1 jasmine-node --nohelpers .
	@rm -rf ../node_modules/edp-foo ../node_modules/edpx-bar
