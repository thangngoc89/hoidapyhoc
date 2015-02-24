@extends('layouts.main')

@section('title')
Thống kê trang web
@endsection

@section('meta_description')
Thống kê các thông số của Hỏi Đáp Y Học
@endsection

@section('body')
<div class="container wrap">
    <div class="content">
        <div class="container section">
    <div class="col-md-6 stat">
        <h2>Tổng thành viên</h2>
        <span class="stat-heading">{{ $stat[0] }}</span>
    </div>

    <div class="col-md-6 stat">
        <h2>Tổng đề thi</h2>
        <span class="stat-heading">{{ $stat[1] }}</span>
    </div>

    <div class="col-md-6 stat">
        <h2>Tổng lượt thi</h2>
        <span class="stat-heading">{{ $stat[2] }}</span>
    </div>

    <div class="col-md-6 stat">
        <h2>Tổng video</h2>
        <span class="stat-heading">{{ $stat[3] }}</span>
    </div>
</div>
    </div>
</div>
@endsection