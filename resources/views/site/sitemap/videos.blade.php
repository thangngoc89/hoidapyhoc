@include('site.sitemap.layouts')
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
@foreach($videos as $video)
    <url>
        <loc>{{ url($video->link()) }}</loc>
        <lastmod>{{ $video->updated_at->format('Y-m-d\TH:i:sP') }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
@endforeach
</urlset>