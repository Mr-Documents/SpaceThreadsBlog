# Complete Password Reset Flow Test
$baseUrl = "http://localhost:8080/api/v1/auth"

Write-Host "=== TESTING COMPLETE PASSWORD RESET FLOW ===" -ForegroundColor Magenta

# Step 1: Request password reset
Write-Host "`n1. Requesting password reset..." -ForegroundColor Cyan
try {
    $forgotResponse = Invoke-WebRequest -Uri "$baseUrl/forgot-password" -Method POST -ContentType "application/json" -Body '{"email": "test@example.com"}'
    Write-Host "✅ Forgot password request: SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "❌ Forgot password request: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Step 2: Get reset token
Write-Host "`n2. Getting reset token..." -ForegroundColor Cyan
try {
    $tokenResponse = Invoke-WebRequest -Uri "$baseUrl/get-reset-token?email=test@example.com" -Method GET
    $tokenData = $tokenResponse.Content | ConvertFrom-Json
    $resetToken = $tokenData.data
    Write-Host "✅ Reset token retrieved: $resetToken" -ForegroundColor Green
} catch {
    Write-Host "❌ Get reset token: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Step 3: Reset password using token
Write-Host "`n3. Resetting password with token..." -ForegroundColor Cyan
$resetBody = @{
    token = $resetToken
    newPassword = "resetpassword123"
    confirmPassword = "resetpassword123"
} | ConvertTo-Json

try {
    $resetResponse = Invoke-RestMethod -Uri "$baseUrl/reset-password" -Method POST -ContentType "application/json" -Body $resetBody
    Write-Host "✅ Password reset: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($resetResponse.message)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Password reset: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Step 4: Test login with new password
Write-Host "`n4. Testing login with new password..." -ForegroundColor Cyan
try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -ContentType "application/json" -Body '{"email": "test@example.com", "password": "resetpassword123"}'
    Write-Host "✅ Login with new password: SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "❌ Login with new password: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== PASSWORD RESET FLOW TEST COMPLETED ===" -ForegroundColor Magenta
