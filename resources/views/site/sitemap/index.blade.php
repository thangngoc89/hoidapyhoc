@include('site.sitemap.layouts')
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
@foreach($sitemaps as $sitemap)
    <sitemap>
        <loc>{{ url() }}/sitemap-{{$sitemap}}.xml</loc>
        <lastmod>1970-01-01T00:00:00.000Z</lastmod>
    </sitemap>
@endforeach
</sitemapindex>