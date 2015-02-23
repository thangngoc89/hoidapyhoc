@foreach ($questions as $q)

    @foreach($q as $row)

        @if( is_array($row) )
            <b>{{ $row }}</b>
        @else
            {!! $row['value'] !!}
        @endif

    @endforeach

@endforeach