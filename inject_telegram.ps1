# Inject Telegram social icon into footer of all HTML pages
# This adds a Telegram icon link after the WhatsApp icon in the footer social media section

$srcDir = $PSScriptRoot

# The Telegram link HTML to inject (after the WhatsApp </a> closing tag)
$telegramLink = @"
                                <a href="https://t.me/Elitechub" target="_blank" rel="noopener noreferrer"
                                    style="width: 36px; height: 36px; background: rgba(255,255,255,0.08); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.7); text-decoration: none;"><i
                                        class="fab fa-telegram-plane"></i></a>
"@

# Pattern: the WhatsApp link closing tag followed by the email link
# We insert the Telegram link between them
$searchPattern = 'class="fab fa-whatsapp"></i></a>'
$telegramCheck = 'fa-telegram-plane'

$htmlFiles = Get-ChildItem -Path $srcDir -Filter '*.html' -File | Where-Object {
    $_.Name -ne 'yandex_6d910a5f997cec90.html' -and $_.Name -ne 'index.html'
}

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Skip if already has telegram link
    if ($content -match $telegramCheck) {
        Write-Host "SKIP (already has Telegram): $($file.Name)"
        continue
    }
    
    # Check if it has the WhatsApp icon in footer
    if ($content -match [regex]::Escape($searchPattern)) {
        # Insert telegram link after the WhatsApp closing tag
        $content = $content -replace [regex]::Escape($searchPattern), ($searchPattern + "`r`n" + $telegramLink)
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "INJECTED: $($file.Name)"
    }
    else {
        Write-Host "NO MATCH: $($file.Name)"
    }
}

Write-Host "`nTelegram icon injection complete!"
