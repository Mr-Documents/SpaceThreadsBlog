# Debug Authentication Issues
$baseUrl = "http://localhost:8080/api/v1/auth"

Write-Host "=== DEBUGGING AUTHENTICATION ===" -ForegroundColor Magenta

# Get fresh token
Write-Host "`nGetting fresh login token..." -ForegroundColor Cyan
$loginResponse = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -ContentType "application/json" -Body '{"email": "test@example.com", "password": "password123"}'
$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.token

Write-Host "Token received: $($token.Substring(0,50))..." -ForegroundColor Green

# Test profile endpoint (should work)
Write-Host "`nTesting Profile endpoint..." -ForegroundColor Cyan
try {
    $profileResponse = Invoke-WebRequest -Uri "$baseUrl/profile" -Method GET -Headers @{"Authorization"="Bearer $token"}
    Write-Host "✅ Profile works: $($profileResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Profile failed: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test change password with detailed error handling
Write-Host "`nTesting Change Password endpoint..." -ForegroundColor Cyan
try {
    $changePasswordResponse = Invoke-WebRequest -Uri "$baseUrl/change-password" -Method POST -ContentType "application/json" -Headers @{"Authorization"="Bearer $token"} -Body '{"currentPassword": "password123", "newPassword": "newpassword123", "confirmPassword": "newpassword123"}'
    Write-Host "✅ Change Password works: $($changePasswordResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($changePasswordResponse.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Change Password failed: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to get more details
    try {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Yellow
    } catch {
        Write-Host "Could not read error details" -ForegroundColor Yellow
    }
}

Write-Host "`n=== DEBUG COMPLETED ===" -ForegroundColor Magenta
