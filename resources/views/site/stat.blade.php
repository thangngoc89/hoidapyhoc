@extends('layouts.main')

@section('title')
Thống kê
@endsection

@section('body')
<div class="container wrap">
    <div class="content">
        <div class="container section">
    <div class="col-md-4 stat">
        <h2>Tổng thành viên</h2>
        <span class="stat-heading">{{ $stat[0] }}</span>
    </div>

    <div class="col-md-4 stat">
        <h2>Tổng đề thi</h2>
        <span class="stat-heading">{{ $stat[1] }}</span>
    </div>

    <div class="col-md-4 stat">
        <h2>Tổng lượt thi</h2>
        <span class="stat-heading">{{ $stat[2] }}</span>
    </div>
</div>
    </div>
</div>
@endsection