// 使用 PowerShell 下载依赖库

# 创建lib目录（如果不存在）
New-Item -ItemType Directory -Force -Path "lib"

# 下载 Readability
$readabilityUrl = "https://raw.githubusercontent.com/mozilla/readability/master/Readability.js"
Invoke-WebRequest -Uri $readabilityUrl -OutFile "lib/readability.js"

# 下载 Turndown
$turndownUrl = "https://unpkg.com/turndown/dist/turndown.js"
Invoke-WebRequest -Uri $turndownUrl -OutFile "lib/turndown.js"

# 下载 Marked
$markedUrl = "https://cdn.jsdelivr.net/npm/marked/marked.min.js"
Invoke-WebRequest -Uri $markedUrl -OutFile "lib/marked.min.js"

Write-Host "依赖库下载完成！" 