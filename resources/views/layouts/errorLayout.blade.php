<!DOCTYPE HTML>
<html>
<head>
<title>{{ $status }} - Hỏi Đáp Y Học</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link href="/css/error.css" rel="stylesheet" type="text/css" media="all" />
</head>
<body>
	<!-----start-wrap--------->
	<div class="wrap">
		<!-----start-content--------->
		<div class="content">
			<!-----start-logo--------->
			<div class="logo">
				<h1>{{ $status }}</h1>
				<span><img src="/img/error/signal.png"/>{{ $message }}</span>
			</div>
			<!-----end-logo--------->

			<!-----start-search-bar-section--------->
			<div class="buttom">
				<div class="seach_bar">
					<p><span><a href="/">quay về trang chủ</a></span></p>
					<!--<div class="search_box">
					<form>
					   <input type="text" value="Search" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Search';}"><input type="submit" value="">
				    </form>
					 </div>
				</div>
			</div>-->
		</div>
	</div>

	<!---------end-wrap---------->
</body>
</html>