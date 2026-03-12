# Push all .env variables to Vercel
$envFile = Get-Content ".env" -Raw
$lines = $envFile -split "`n"

foreach ($line in $lines) {
    $line = $line.Trim()
    # Skip empty lines and comments
    if ($line -eq "" -or $line.StartsWith("#")) { continue }
    
    # Split on first = only
    $eqIndex = $line.IndexOf("=")
    if ($eqIndex -lt 1) { continue }
    
    $key = $line.Substring(0, $eqIndex).Trim()
    $value = $line.Substring($eqIndex + 1).Trim()
    
    Write-Host "Adding $key..."
    
    # Pipe the value into vercel env add
    $value | vercel env add $key production --yes 2>&1
    $value | vercel env add $key preview --yes 2>&1
    $value | vercel env add $key development --yes 2>&1
}

Write-Host "`nAll environment variables pushed to Vercel!"
