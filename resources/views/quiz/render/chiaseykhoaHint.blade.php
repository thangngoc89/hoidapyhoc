<?php $answerKey = ['A','B','C','D','E']; ?>

@foreach ($questions as $index => $q)

    @foreach($q as $answerIndex => $row)

        @if( !is_array($row) )
            <strong>{{$index + 1}}.  {{ $row }}</strong>
        @else
            <p>{{ $answerKey[$answerIndex-1]}}. {!! str_replace('CHÚC MỪNG BẠN', 'ĐÚNG', $row['hint']) !!}</p>
        @endif
    @endforeach
    <p>&nbsp;</p>

@endforeach