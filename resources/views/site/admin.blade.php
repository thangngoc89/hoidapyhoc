<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hỏi Đáp Y Học Admin Page</title>
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="/assets/css/ng-admin.min.css">
    <link rel="stylesheet" href="/assets/css/admin.css">
    <csrf name="csrf" content="{{ $encrypted_token['encrypted_token'] }}" />
</head>

<body ng-app="myApp">
<div ui-view></div>
<script src="/assets/js/angular.js" type="text/javascript"></script>
<script src="/assets/js/ng-admin.min.js" type="text/javascript"></script>
<script src="{{ elixir('assets/js/admin.js') }}" type="text/javascript"></script>
</body>
</html>