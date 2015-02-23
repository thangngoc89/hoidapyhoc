@foreach ($questions as $index => $q)

    @foreach($q as $row)

        @if( !is_array($row) )
            <strong>{{$index + 1}}.  {{ $row }}</strong>
        @else
            <p>{!! $row['value'] !!}</p>
        @endif
    @endforeach
    <p>&nbsp;</p>

@endforeach