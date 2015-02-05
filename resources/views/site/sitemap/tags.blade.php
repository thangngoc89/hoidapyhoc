@include('site.sitemap.layouts')
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
@foreach($tags as $tag)
    <url>
        <loc>{{ url('/tag/'.$tag->slug ) }}</loc>
        <lastmod>{{ date('Y-m-d\TH:i:sP') }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>
@endforeach
</urlset>