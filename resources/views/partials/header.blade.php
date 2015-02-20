<head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="The best Laravel screencasts on the web.">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>@yield('title'):: Hỏi Đáp Y Học</title>

        <meta name="keywords" content="@yield('meta_keywords','Hỏi đáp Y Học, sinh viên, y khoa, quiz, tracnghiem')" />
        <meta name="author" content="@yield('meta_author','Hỏi Đáp Y Học')" />
        <meta name="description" content="@yield('meta_description','Trắc nghiệm online - Kho đề thi trắc nghiệm Y Học')" />

        <meta name="csrf" content="{{ $encrypted_token['encrypted_token'] }}" />
        <meta property="og:site_name" content="Quiz - Hỏi Đáp Y Học"/>
        <meta property="og:type" content="article"/>
        <meta property="og:image" content="http://ask.hoidapyhoc.com/uploads/default/12/51cfb3b4bf8211c3.png"/>
        <meta property="og:title" content="@yield('title')| Trắc nghiệm - Hỏi Đáp Y Học"/>
        <meta property="og:description" content="@yield('meta_description','Trắc nghiệm online - Kho đề thi trắc nghiệm Y Học')"/>
        <meta property="og:url" content="{{ url() }}"/>

        <link rel="icon" href="//ask.hoidapyhoc.com/uploads/default/11/7c97ab16287c739c.png" type="image/x-icon">
        <link href="{{ elixir('css/main.css') }}" rel="stylesheet">

        @yield('style')
</head>