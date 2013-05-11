<!doctype html>
<!--
/***************************************************************************
 *
 * Copyright (c) {{{app_create_year}}} Baidu.com, Inc. All Rights Reserved
 * $Id: action.app.html 120752 2012-04-05 14:38:54Z  $
 *
 **************************************************************************/



/**
 * src/{{{app_package_path}}}/{{{app_action_name}}}.app.html ~ {{{app_create_time}}}
 * @author {{{app_user_email}}} ({{{app_user_name}}})
 * @version $Revision: 120752 $ 
 * @description
 *
 **/
-->
<html>
<head>
    <meta charset="utf-8" />
    <title>[MOCKUP]{{{app_name}}}</title>
    <script type="text/javascript" src="{{{app_relative_path}}}/../assets/js/tangram-base-1.3.7.1.js"></script>
    <script type="text/javascript" src="{{{app_relative_path}}}/base.js"></script>
    <script type="text/javascript">
        goog.require('app.debug');
        goog.require('{{{app_name}}}');

        goog.mockups('{{{app_module}}}.mockup');
    </script>
    <!--[if IE]><![endif]-->
    <!--[if IE 6]><![endif]-->
    <!--[if gte IE 7]><![endif]-->
</head>
<body>
    <div id="Main"></div>
</body>
<script type="text/javascript">
app.debug('{{{app_action_path}}}');
</script>
</html>
