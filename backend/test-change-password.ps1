# Test Change Password with proper JSON formatting
$baseUrl = "http://localhost:8080/api/v1/auth"

# Get fresh token
$loginResponse = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -ContentType "application/json" -Body '{"email": "test@example.com", "password": "password123"}'
$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.token

Write-Host "Token: $($token.Substring(0,50))..." -ForegroundColor Green

# Test change password with proper JSON
$changePasswordBody = @{
    currentPassword = "password123"
    newPassword = "newpassword123"
    confirmPassword = "newpassword123"
} | ConvertTo-Json

Write-Host "Request Body: $changePasswordBody" -ForegroundColor Yellow

try {
    $changePasswordResponse = Invoke-RestMethod -Uri "$baseUrl/change-password" -Method POST -ContentType "application/json" -Headers @{"Authorization"="Bearer $token"} -Body $changePasswordBody
    Write-Host "✅ Change Password Success!" -ForegroundColor Green
    Write-Host "Response: $($changePasswordResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Change Password Failed" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
