<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ng-admin Admin CP for Laravel 4 Bootstrap Starter Site</title>
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="/assets/css/ng-admin.min.css">
    <link rel="stylesheet" href="/assets/css/admin.css">
    <meta name="csrf" content="{{ $encrypted_token['encrypted_token'] }}" />d
</head>

<body ng-app="myApp" ng-controller="main">
<div ui-view></div>
<script src="/assets/js/angular.js" type="text/javascript"></script>
<script src="/assets/js/ng-admin.min.js" type="text/javascript"></script>
<script src="/assets/js/admin.js" type="text/javascript"></script>
</body>
</html>