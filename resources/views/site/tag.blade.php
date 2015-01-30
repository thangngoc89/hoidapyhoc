@extends('layouts.main')

@section('jumbotron')

<div class="jumbotron">
    <div class="container">
        <h2 class="jumbotron__heading">{{ $name }}</h2>
        <h4 class="jumbotron__sub-heading">Tag dùng để sắp xếp các tài nguyên, đề thi theo từng chủ đề liên quan</h4>

        <a href="/quiz/create" class="btn btn-primary">
            <i class="fa fa-plus"></i> Tạo đề thi mới
        </a>
    </div>
</div>
@stop


@section('title')
    {{ $name }}
@stop

@section('body')
<div class="container">
    <div class="row">
        <div class="threads-inner white col-md-12">
            <div class="lessons-nav lessons-nav--forum inline-nav row">
                 <div class="container pull-right">
                     <ul class="lessons-nav__primary pull-right">
                     <?php $tab = \Input::get('tab'); ?>
                         <li class="{{ ($tab == '' || $tab == 'popular') ? 'active' : '' }}">
                             <a href="/tag?tab=popular">Nổi bật</a> </li>
                         <li class="{{ ($tab == 'new') ? 'active' : '' }}">
                             <a href="/tag?tab=new">Mới nhất</a> </li>
                         <li class="{{ ($tab == 'list') ? 'active' : '' }}">
                             <a href="/tag?tab=list">Danh sách</a> </li>
                     </ul>

                 </div>
             </div>
            <div class="wrap">
                 @foreach($tags as $tag)
                     <div class="tags">
                        <a href="/tag/{{ $tag->slug }}" class="post-tag">{{ $tag->name }}</a>
                            <span class="item-multiplier">
                                <span class="item-multiplier-x">×</span>
                                <span class="item-multiplier-count">{{ $tag->count() }}</span>&nbsp;&nbsp;
                            </span>
                     </div>
                 @endforeach

                 <div class="forum-pagination">
                      @if ($tags instanceof Illuminate\Pagination\LengthAwarePaginator)
                     <ul class="pagination">
                         {!! $tags->render() !!}
                     </ul>
                     @endif
                 </div>
             </div>
        </div>
    </div>
</div>
@stop