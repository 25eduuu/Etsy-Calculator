$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { throw 'Node.js non trovato. Installa Node.js LTS per eseguire i test integrati.' }
Set-Location -LiteralPath $root
& $node --test tests/calculator.test.cjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
