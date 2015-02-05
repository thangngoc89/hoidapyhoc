@extends('layouts.main')

@section('style')
<link href="http://vjs.zencdn.net/4.11/video-js.css" rel="stylesheet">
@endsection

@section('body')
<div class="row">
    <div class="col-md-6 col-offset-md-4">
        <video id="MY_VIDEO_1" class="video-js vjs-default-skin" controls
         preload="auto" width="640" height="264" poster="MY_VIDEO_POSTER.jpg"
         data-setup="{}">
         <source src="http://www.medicalvideos.org/uploads/MP4/C0LhqVj1kkqeAdozDMPT.mp4" type='video/mp4'>
         <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
        </video>
    </div>
</div>

@endsection

@section('script')
<script src="http://vjs.zencdn.net/4.11/video.js"></script>
@endsection