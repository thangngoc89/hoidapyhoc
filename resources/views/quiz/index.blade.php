@extends('layouts.main')

@section('jumbotron')
<?php
    $jumbotron = [
                'name'     => 'Quiz',
                'heading'   => 'Kho Đề trắc nghiệm..',
                'class'     =>  "icon-bubble-chat-1",
                'link'      => '/quiz/create',
                'button'    => 'Tạo đề thi mới'
            ];
    if ($filter == 'c')
    {
        $category = Category::where('slug',$info)->first();
        $jumbotron['name']  = $category->name;
    } elseif ($filter == 'hasHistory') {
        $jumbotron['name'] = 'Các đề bạn đã thi';
    }
?>
    @include('modules.jumbotron',$jumbotron)
@stop


@section('title')
    @if (!empty($category))
    {{ $category->name }}
    @else
    Quiz
    @endif
@stop

{{--Body Section--}}
@section('body')
    <div class="threads-inner white col-md-8">
        @include('quiz.indexContent')
    </div>
    <div id="conversations-sidebar" class="white col-md-4">
        @include('quiz.indexSidebar')
    </div>
@stop