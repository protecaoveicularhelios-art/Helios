# Script de deploy - Helios Protecao Veicular
# Uso: .\deploy.ps1 "mensagem do commit"
# Exemplo: .\deploy.ps1 "Adicionar novo artigo no blog"

param(
  [string]$mensagem = "Deploy: atualizar site"
)

$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = "$base\helios-source"
$out  = "$base\helios-source\out"
$dst  = "$base\novo-site"

Write-Host ""
Write-Host "=== HELIOS DEPLOY ===" -ForegroundColor Yellow
Write-Host ""

# 1. BUILD
Write-Host "[1/4] Buildando..." -ForegroundColor Cyan
Set-Location $src
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host "ERRO no build. Deploy cancelado." -ForegroundColor Red
  exit 1
}

Set-Location $base

# 2. COPIAR CIDADES
Write-Host ""
Write-Host "[2/4] Copiando paginas de cidade..." -ForegroundColor Cyan
$cidades = @(
  "belo-horizonte","contagem","betim","ribeirao-das-neves","santa-luzia",
  "ibirite","vespasiano","sabara","nova-lima","lagoa-santa",
  "pedro-leopoldo","brumadinho","esmeraldas","mario-campos","sarzedo"
)
foreach ($c in $cidades) {
  Get-ChildItem "$out\$c" | Copy-Item -Destination "$dst\$c" -Recurse -Force
}
Write-Host "  $($cidades.Count) cidades copiadas." -ForegroundColor Green

# 3. COPIAR BLOG
Write-Host "[3/4] Copiando blog..." -ForegroundColor Cyan
Get-ChildItem "$out\blog" | Copy-Item -Destination "$dst\blog" -Recurse -Force
Write-Host "  Blog copiado." -ForegroundColor Green

# 4. COPIAR ASSETS _next
Write-Host "[4/4] Copiando assets (_next)..." -ForegroundColor Cyan
Remove-Item "$dst\_next" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "$dst\_next" -Force | Out-Null
Get-ChildItem "$out\_next" | Copy-Item -Destination "$dst\_next" -Recurse -Force
Write-Host "  Assets copiados." -ForegroundColor Green

# 5. SITEMAP
Copy-Item "$out\sitemap.xml" "$dst\sitemap.xml" -Force

# 6. GIT COMMIT E PUSH
Write-Host ""
Write-Host "Commitando e enviando para o GitHub..." -ForegroundColor Cyan
git add novo-site/
git add helios-source/
git commit -m "$mensagem

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin main

Write-Host ""
Write-Host "Deploy concluido! Netlify vai atualizar em ~2 minutos." -ForegroundColor Green
Write-Host ""
