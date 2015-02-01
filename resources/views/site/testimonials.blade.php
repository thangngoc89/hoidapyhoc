@extends('layouts.main')

@section('jumbotron')

<div class="jumbotron">
    <div class="container">
        <h2 class="jumbotron__heading">Mọi người nói gì về Hỏi Đáp Y Học</h2>

        <a href="/quiz/create" class="btn btn-primary">
            <i class="fa fa-plus"></i> Gửi cảm nhận của bạn
        </a>
    </div>
</div>
@stop


@section('title')
Testimonials
@stop

@section('body')
<div class="container">
    <!-- TESTIMONIALS -->
    <div class="testimonials">
        <div class="container wrap wow fadeIn">

        <h2 class="section-heading">
            <a href="/testimonials">Mọi người nói gì về Hỏi Đáp Y Học.</a>    </h2>

        <span class="section-heading-divider"></span>

        @include('index.indexTestimonials')

        </div>
    </div>
</div>
@stop