# Debug Reset Password JSON Issue
$baseUrl = "http://localhost:8080/api/v1/auth"

# Test with proper JSON formatting
$resetBody = @{
    token = "3991136b-fe60-46d7-9bcf-1c7c47bd131a"
    newPassword = "newpassword123"
    confirmPassword = "newpassword123"
} | ConvertTo-Json -Depth 10

Write-Host "Testing with JSON body:" -ForegroundColor Yellow
Write-Host $resetBody -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reset-password" -Method POST -ContentType "application/json; charset=utf-8" -Body $resetBody
    Write-Host "✅ SUCCESS: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    
    # Try to get response body
    try {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Yellow
    } catch {
        Write-Host "Could not read error details" -ForegroundColor Yellow
    }
}
