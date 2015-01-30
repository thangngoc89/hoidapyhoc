@foreach($tags as $tag)

    @foreach($tag as $t)
    <a href="/tag/{{ $t->slug }}" class="post-tag">{{ $t->name }}</a>
        <span class="item-multiplier">
        <span class="item-multiplier-x">×</span>
        <span class="item-multiplier-count">{{ $t->count() }}</span>&nbsp;&nbsp;
    </span>
    @endforeach

@endforeach