<!doctype html>
<!--
/***************************************************************************
 *
 * Copyright (c) %(app.create.year)s Baidu.com, Inc. All Rights Reserved
 * $Id: widget.app.html 150523 2012-10-30 10:06:05Z  $
 *
 **************************************************************************/



/**
 * src/{{{app_package_path}}}/{{{app_action_name}}}.app.html ~ %(app.create.time)s
 * @author %(app.user.email)s (%(app.user.name)s)
 * @version $Revision: 150523 $ 
 * @description
 *
 **/
-->
<html>
<head>
    <meta charset="utf-8" />
    <title>[AD]%(app.name)s</title>
    <script type="text/javascript" src="%(app.rel_path)s/../assets/js/tangram-base-1.3.7.1.js"></script>
    <script type="text/javascript" src="%(app.rel_path)s/../assets/js/mustache.js"></script>
    <script type="text/javascript" src="%(app.rel_path)s/base.js"></script>
    <script type="text/javascript" src="{{{app_action_name}}}.config.js"></script>
    <script type="text/javascript">
        goog.require('ad.Debug');
        goog.require('ad.Material');
        goog.require('%(app.name)s');
    </script>
</head>
<body>
</body>
<script type="text/javascript">
ad.Debug(function() {
    var material = new ad.Material('ec-ma-8964');
    material.setWidgets(
        [new %(app.name)s(WIDGET_CONFIG)]
    );
    material.show();
});
</script>
</html>
