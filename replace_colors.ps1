Get-ChildItem -Path '.' -Filter '*.html' -Recurse | Where-Object { $_.FullName -notmatch 'dist_frontend' } | ForEach-Object {
    $content = Get-Content $_.FullName
    $newContent = $content -replace 'color:\s*#0A0A0A;?', 'color: white;' -replace 'color:#0A0A0A;?', 'color:white;'
    Set-Content -Path $_.FullName -Value $newContent
}
