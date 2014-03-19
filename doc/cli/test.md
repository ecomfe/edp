edp-test
---------
### Usage

    edp test
    edp test init
    edp test start


### Description

使用`test`对`当前目录`的`test`目录下所有测试用例进行测试。

建议目录结构为 `/test/spec/*Spec.js`。

`init` 子命令将在 `test` 目录生成测试配置文件 `config.js` 和测试入口文件 `main.js`

`start` 子命令将启动测试服务，并报告测试结果和代码覆盖率，检测到无配置文件时会自动调用 `init`。

不带任何子命令的 `edp test` 相当于 `edp test start`

配置示例：

```
module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      'src/css/*.less',
      'src/css/*.styl',
      {pattern: 'src/*/*.js', included: false},
      {pattern: 'test/*/*Spec.js', included: false},

      'test/main.js'
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/css/*.less': ['less'],
      'src/css/*.styl': ['stylus'],
      'src/*/*.js': ['coverage']
   },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'text',
      dir : 'coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    plugins: [
        'karma-jasmine', 
        'karma-chrome-launcher', 
        'karma-less-preprocessor', 
        'karma-stylus-preprocessor', 
        'karma-requirejs', 
        'karma-coverage'
    ]
  });
};

```

### Reference

http://pivotal.github.com/jasmine/

http://karma-runner.github.io/0.10/index.html

http://gotwarlost.github.io/istanbul/
