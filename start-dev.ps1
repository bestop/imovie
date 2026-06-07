cd "c:\Users\shenhq\Documents\GitHub\imovie"
Write-Host "Starting npm install..."
& "C:\Program Files\nodejs\npm" install 2>&1 | Out-File -FilePath "install.log" -Encoding utf8
Write-Host "npm install completed"
Write-Host "Starting npm run dev..."
& "C:\Program Files\nodejs\npm" run dev 2>&1