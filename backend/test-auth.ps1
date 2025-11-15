# Test Authentication Endpoints
$baseUrl = "http://localhost:8080/api/v1/auth"

# Extract token from login response
$loginResponse = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -ContentType "application/json" -Body '{"email": "test@example.com", "password": "password123"}'
$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.token

Write-Host "=== LOGIN SUCCESSFUL ===" -ForegroundColor Green
Write-Host "Token: $($token.Substring(0,50))..." -ForegroundColor Yellow

# Test Profile Endpoint
Write-Host "`n=== TESTING PROFILE ENDPOINT ===" -ForegroundColor Cyan
try {
    $profileResponse = Invoke-WebRequest -Uri "$baseUrl/profile" -Method GET -Headers @{"Authorization"="Bearer $token"}
    Write-Host "Profile Response: $($profileResponse.Content)" -ForegroundColor Green
} catch {
    Write-Host "Profile Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Change Password
Write-Host "`n=== TESTING CHANGE PASSWORD ===" -ForegroundColor Cyan
try {
    $changePasswordResponse = Invoke-WebRequest -Uri "$baseUrl/change-password" -Method POST -ContentType "application/json" -Headers @{"Authorization"="Bearer $token"} -Body '{"currentPassword": "password123", "newPassword": "newpassword123", "confirmPassword": "newpassword123"}'
    Write-Host "Change Password Response: $($changePasswordResponse.Content)" -ForegroundColor Green
} catch {
    Write-Host "Change Password Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== AUTHENTICATION TESTS COMPLETED ===" -ForegroundColor Magenta
