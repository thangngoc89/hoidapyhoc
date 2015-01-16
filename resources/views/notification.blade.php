@if (count($errors->all()) > 0)
<div class="alert alert-danger alert-block">
	<button type="button" class="close" data-dismiss="alert">&times;</button>
	<h4>Có lỗi xảy ra</h4>
	<h5>Vui lòng kiểm tra những thông tin bên dưới</h5>

    <ul>
    @if(is_array($message = $errors->all()))
        @foreach ($message as $m)
        <li>{{ $m }}</li>
        @endforeach
    @else
        <li>{{ $message }}</li>
    @endif
    </ul>
</div>
@endif