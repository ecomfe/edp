代码检测
-------

edp默认提供了一些代码检测工具，并做好了默认配置，方便开发者使用。


Javascript代码检测
--------------

通过`edp jshint`命令，可以使用jshint对`当前目录`下所有Javascript代码进行检测。检测结果将输出markdown格式的报告。

    $ edp jshint
    project/loader.js
    ---------------

    1. line 7, col 11: 'semver' is defined but never used.


    Total
    ---------------

    Detect 33 files, find 1 errors in 1 files.

    - project/loader.js
