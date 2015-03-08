@if ($breadcrumbs)
	<ol class="breadcrumb" itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
		@foreach ($breadcrumbs as $breadcrumb)
		    @if ($breadcrumb->url && $breadcrumb->first)
                <li>
                    <a href="{{{ $breadcrumb->url }}}" itemprop="url">
                        <span itemprop="title">{{{ $breadcrumb->title }}}</span></a>
                </li>
			@elseif ($breadcrumb->url && !$breadcrumb->last)
				<li itemprop="child" itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
				    <a href="{{{ $breadcrumb->url }}}" itemprop="url">
				        <span itemprop="title">{{{ $breadcrumb->title }}}</span></a>
				</li>
			@else
				<li class="active" itemprop="child" itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
				    <a href="{{{ $breadcrumb->url }}}" itemprop="url"></a>
                        <span itemprop="title">{{{ $breadcrumb->title }}}</span>
				</li>
			@endif
		@endforeach
	</ol>
@endif