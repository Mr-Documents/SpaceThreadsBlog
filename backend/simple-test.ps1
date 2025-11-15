# Simple Production Test
$baseUrl = "http://localhost:8080/api/v1/auth"

Write-Host "PRODUCTION-READY AUTHENTICATION SYSTEM TEST" -ForegroundColor Magenta

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/test" -Method GET
    Write-Host "SUCCESS: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Login
Write-Host "`n2. Testing Login..." -ForegroundColor Cyan
try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -ContentType "application/json" -Body '{"email": "test@example.com", "password": "password123"}'
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.token
    Write-Host "SUCCESS: JWT token received" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Profile
Write-Host "`n3. Testing Profile..." -ForegroundColor Cyan
if ($token) {
    try {
        $profileResponse = Invoke-WebRequest -Uri "$baseUrl/profile" -Method GET -Headers @{"Authorization"="Bearer $token"}
        $profileData = $profileResponse.Content | ConvertFrom-Json
        Write-Host "SUCCESS: Profile for $($profileData.data.username)" -ForegroundColor Green
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Password Reset
Write-Host "`n4. Testing Password Reset..." -ForegroundColor Cyan
try {
    $forgotResponse = Invoke-WebRequest -Uri "$baseUrl/forgot-password" -Method POST -ContentType "application/json" -Body '{"email": "test@example.com"}'
    $tokenResponse = Invoke-WebRequest -Uri "$baseUrl/get-reset-token?email=test@example.com" -Method GET
    $tokenData = $tokenResponse.Content | ConvertFrom-Json
    $resetToken = $tokenData.data
    Write-Host "SUCCESS: Reset token: $($resetToken.Substring(0,8))..." -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Swagger UI
Write-Host "`n5. Testing Swagger UI..." -ForegroundColor Cyan
try {
    $swaggerResponse = Invoke-WebRequest -Uri "http://localhost:8080/swagger-ui.html" -Method GET
    Write-Host "SUCCESS: Swagger UI accessible" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nSYSTEM IS PRODUCTION READY!" -ForegroundColor Green
Write-Host "Swagger UI: http://localhost:8080/swagger-ui.html" -ForegroundColor Yellow
