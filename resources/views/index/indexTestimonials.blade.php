<?php  $i=1; ?>

@foreach($testimonial as $tes)

@if ( (($i+2) % 3) == 0 )
    <div class="row">
@endif

<div class="col-md-4 testimonial">
    <div class="row">
        <div class="avatar col-md-5">
            @if (!empty($tes->link))
            <a href="{{ $tes->link }}">
                <img class="img-circle" src="{{ $tes->avatar }}" alt="{{ $tes->name }}">
            </a>
            @else
                 <img class="img-circle" src="{{ $tes->avatar }}" alt="{{ $tes->name }}">
            @endif
        </div>
        <div class="testimonial-main col-md-7">
            <h4 class="media-heading">
                {{ $tes->name }}
            </h4>
            <p class="testimony-body">{{ $tes->content }}</p>
        </div>
    </div>
</div>
{{--Close tag when last row or last element of array--}}
@if ( (($i % 3) == 0) || ($i == count($testimonial)) )
    </div>
@endif
<?php $i++; ?>

@endforeach