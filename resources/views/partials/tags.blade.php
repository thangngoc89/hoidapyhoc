@foreach($tags as $tag)

    @foreach($tag as $t)
    <a href="/tag/{{ $t->slug }}" class="post-tag">{{ $t->name }}</a>&nbsp;
        <span class="item-multiplier">
        <span class="item-multiplier-x">×</span>&nbsp;
        <span class="item-multiplier-count">{{ $t->count() }}</span>
    </span>
    @endforeach

@endforeach