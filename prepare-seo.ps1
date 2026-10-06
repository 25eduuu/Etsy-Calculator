param(
  [Parameter(Mandatory = $true)]
  [string]$SiteUrl
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$parsed = $null
if (-not [Uri]::TryCreate($SiteUrl, [UriKind]::Absolute, [ref]$parsed) -or $parsed.Scheme -ne 'https') {
  throw 'Inserisci l URL HTTPS pubblico del sito, ad esempio https://margineetsy.pages.dev.'
}
$base = $parsed.AbsoluteUri.TrimEnd('/')
$indexPath = Join-Path $root 'index.html'
$html = [System.IO.File]::ReadAllText($indexPath)
$html = [regex]::Replace($html, '<link rel="canonical" href="[^"]*">\s*', '')
$html = [regex]::Replace($html, '<meta property="og:url" content="[^"]*">\s*', '')
$headTags = "  <link rel=`"canonical`" href=`"$base/`">`n  <meta property=`"og:url`" content=`"$base/`">`n"
if ($html -notmatch '</head>') { throw 'Elemento </head> non trovato in index.html.' }
$html = $html.Replace('</head>', "$headTags</head>")
[System.IO.File]::WriteAllText($indexPath, $html, [System.Text.UTF8Encoding]::new($false))

$urls = @('','privacy.html','disclosure.html') | ForEach-Object {
  if ($_ -eq '') { "$base/" } else { "$base/$_" }
}
$xmlUrls = $urls | ForEach-Object { '  <url><loc>' + [System.Security.SecurityElement]::Escape($_) + '</loc></url>' }
$sitemap = "<?xml version=`"1.0`" encoding=`"UTF-8`"?>`n<urlset xmlns=`"http://www.sitemaps.org/schemas/sitemap/0.9`">`n$($xmlUrls -join "`n")`n</urlset>`n"
[System.IO.File]::WriteAllText((Join-Path $root 'sitemap.xml'), $sitemap, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $root 'robots.txt'), "User-agent: *`nAllow: /`nSitemap: $base/sitemap.xml`n", [System.Text.UTF8Encoding]::new($false))
Write-Host "SEO pronto per $base"
