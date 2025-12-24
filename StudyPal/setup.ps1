# StudyPal Installation Script for Windows

Write-Host "========================================" -ForegroundColor Green
Write-Host "  StudyPal Installation Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$desktopPath = [Environment]::GetFolderPath('Desktop')
$projectPath = Join-Path $desktopPath "StudyPal"

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js v18 or higher." -ForegroundColor Red
    exit 1
}

# Check if MySQL is installed
Write-Host "Checking MySQL installation..." -ForegroundColor Cyan
try {
    $mysqlVersion = mysql --version
    Write-Host "✓ MySQL is installed: $mysqlVersion" -ForegroundColor Green
} catch {
    Write-Host "! MySQL command not found. Make sure MySQL is installed and in PATH." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Installing Backend Dependencies" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Set-Location "$projectPath\backend"
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Backend installation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Installing Frontend Dependencies" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Set-Location "$projectPath\frontend"
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend installation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Set up your .env file in the backend directory:" -ForegroundColor White
Write-Host "   - Copy backend\.env.example to backend\.env" -ForegroundColor Gray
Write-Host "   - Add your OpenAI API key" -ForegroundColor Gray
Write-Host "   - Configure MySQL credentials" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Create the database:" -ForegroundColor White
Write-Host "   mysql -u root -p < backend\database.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the backend server:" -ForegroundColor White
Write-Host "   cd backend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start the frontend (in a new terminal):" -ForegroundColor White
Write-Host "   cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed instructions, see README.md or QUICKSTART.md" -ForegroundColor Yellow
Write-Host ""

Set-Location $projectPath
