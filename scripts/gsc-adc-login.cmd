@echo off
setlocal
set "GCLOUD=%LOCALAPPDATA%\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
set "CLIENT=C:\Users\manci\.gcp\pepcodex-oauth-client.json"
rem gcloud now refuses ADC login unless cloud-platform is included.
rem Keep GSC/GA4/userinfo on the SAME login so the token can actually pull data.
set "SCOPES=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/userinfo.email"

if not exist "%GCLOUD%" (
  echo gcloud not found at:
  echo   %GCLOUD%
  pause
  exit /b 1
)
if not exist "%CLIENT%" (
  echo OAuth JSON not found at:
  echo   %CLIENT%
  pause
  exit /b 1
)

echo Using client: %CLIENT%
echo A browser window will open. Sign in as info@pepcodex.com
echo If you see "Google hasn't verified this app": Advanced -^> Go to PepCodex Analytics ^(unsafe^)
echo.
"%GCLOUD%" auth application-default login --client-id-file="%CLIENT%" --scopes="%SCOPES%"
echo.
echo gcloud exit code: %ERRORLEVEL%
pause
