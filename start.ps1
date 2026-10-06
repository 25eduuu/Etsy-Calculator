$ErrorActionPreference = 'Stop'
$port = 8000
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Margine Etsy pronto su http://localhost:$port"
Write-Host "Premi Ctrl+C per arrestare il server. Log richieste nel terminale."
Set-Location -LiteralPath $root
python -m http.server $port --bind 127.0.0.1
