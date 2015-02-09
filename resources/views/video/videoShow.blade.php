@extends('layouts.main')

@section('title')
{{ $video->title }}
@endsection

@section('style')
<link href="http://vjs.zencdn.net/4.11/video-js.css" rel="stylesheet">
<style>
div.videocontent {
    width: 100%;
    max-width: 848px;
}

.video-js {padding-top: 56.25%}
.vjs-fullscreen {padding-top: 0px}
</style>
@endsection

@section('body')
<div class="video video__lesson">
    <div class="container wrap--video">
        <div class="row">
            <div class="col-md-9">
                <article class="article clearfix">
                    <div class="videocontent">
                        <video id="video_player" class="video-js vjs-default-skin" controls preload="auto" width="auto" height="auto"
                                poster="{{ $video->thumb }}"
                                data-setup='{ "playbackRates": [0.5, 1, 1.5, 2] }'>
                            <source src="{{ $video->link }}" type='video/mp4'>
                                <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
                                </p>
                        </video>
                    </div>

                    <h1 class="lesson-title">{{ $video->title }}</h1>

                    <p class="lesson-title-meta">
                        Đăng vào lúc: {{ $video->updated_at->diffForHumans() }}
                    </p>

                    <div class="lesson-body col-sm-12">
                        <p>{{ $video->description }} <a href="{{ $video->source }}">nguồn</a></p>
                    </div>
                </article>
            </div>

            <aside class="video-sidebar col-md-3">
                @include('video.videoShowSideBar')
            </aside>
        </div>
    </div>
</div>
<div class="lesson-follow-ups">
    <div class="container wrap--video">
        <h3 class="lesson-prerequisites-title">Continue Your Learning</h3>
        <span class="lesson-prerequisites-title-divider"></span>

            <?php  $i=1; ?>

            @foreach($relatedVideos as $video)

            @if ( (($i+2) % 3) == 0 )
                <div class="row lesson-set lessons__row">
            @endif

                @include('video.components.videoThumbs')
            @if ( (($i % 3) == 0) || ($i == count($relatedVideos)) )
                </div>
            @endif
            <?php $i++; ?>
            @endforeach

    </div>
</div>
@endsection

@section('script')
<script src="http://vjs.zencdn.net/4.11/video.js"></script>
@endsection