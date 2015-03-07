@extends('layouts.main')

@section('title')
    Video Y Khoa
@endsection

@section('jumbotron')
<div class="jumbotron">
    <div class="container">
        <h2 class="jumbotron__heading">Video Y Học</h2>
        <h4 class="jumbotron__sub-heading">Không gì tốt hơn học tập qua video.</h4>

        <!--<a href="/video/create" class="btn btn-primary">
            <i class="fa fa-plus"></i> Gửi Video mới
        </a>-->
    </div>
</div>
@stop

@section('body')
<main>
    <div class="piece">
        <div class="container wrap">
            {!! Breadcrumbs::render('video.index') !!}

            <?php  $i=1; ?>

            @foreach($videos as $video)

            @if ( (($i+2) % 3) == 0 )
                <div class="row lesson-set lessons__row">
            @endif

                @include('video.components.videoThumbs')
            @if ( (($i % 3) == 0) || ($i == count($videos)) )
                </div>
            @endif
            <?php $i++; ?>
            @endforeach

            <div class="text-center">
                {!! $videos->render() !!}
            </div>
        </div>
    </div>
</main>
@endsection