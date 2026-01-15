# Test registration endpoint
$url = "http://localhost:5000/api/auth/register"
$body = @{
    username = "testuser789"
    email = "test789@example.com"
    password = "password123"
    passwordConfirm = "password123"
} | ConvertTo-Json

Write-Host "📤 Envoi de la requête d'inscription..."
Write-Host "URL: $url"
Write-Host "Body: $body"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
    Write-Host "✅ Réponse reçue"
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Body:"
    Write-Host $response.Content
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:"
        Write-Host $responseBody
    }
}
