@extends('layouts.main')

@section('jumbotron')

<div class="jumbotron">
    <div class="container">
        <h2 class="jumbotron__heading">Tất cả thành viên</h2>
    </div>
</div>
@stop


@section('title')
Thành viên
@stop

@section('body')
<div class="container">
    <!-- TESTIMONIALS -->
    <div class="testimonials">
        <div class="container wrap wow fadeIn">

        <h2 class="section-heading">
            <a href="/users">Góp phần thành công cho Hỏi Đáp Y Học.</a>    </h2>

        <span class="section-heading-divider"></span>

        <?php  $i=1; ?>

        @foreach($users as $u)

        @if ( (($i+2) % 3) == 0 )
            <div class="row">
        @endif

        <div class="col-md-4 testimonial">
            <div class="row">
                <div class="avatar col-md-5">
                    <a href="{{ $u->profileLink() }}">
                        <img class="img-circle" src="{{ $u->getAvatar() }}" alt="{{ $u->getName() }}">
                    </a>
                </div>
                <div class="testimonial-main col-md-7">
                    <h4 class="media-heading" style="overflow: hidden">
                        <a href="{{ $u->profileLink() }}" title="{{ $u->name }}">
                            {{ $u->getName() }}
                        </a>
                    </h4>
                    <p class="testimony-body">Tham gia từ: {{ $u->joined() }}</p>
                </div>
            </div>
        </div>
        {{--Close tag when last row or last element of array--}}
        @if ( (($i % 3) == 0) || ($i == count($users)) )
            </div>
        @endif
        <?php $i++; ?>
        @endforeach
        <div class="forum-pagination">
             <ul class="pagination">
                 {!! $users->render() !!}
             </ul>
         </div>
        </div>
    </div>
</div>
@stop