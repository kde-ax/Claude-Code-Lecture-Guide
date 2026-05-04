@echo off
chcp 65001 >nul
cls

echo.
echo ╔════════════════════════════════════════╗
echo ║     리셀러 탐지 AI - 시작 중...      ║
echo ╚════════════════════════════════════════╝
echo.

echo 🐳 Docker 컨테이너 빌드 및 실행 중...
echo    (첫 실행은 5~10분 소요)
echo.

start /B docker-compose up --build >nul 2>&1

echo 💤 서버 준비 대기 중...
echo.

:WAIT_LOOP
timeout /t 3 /nobreak >nul
curl -s http://localhost:3000 >nul 2>&1
if %ERRORLEVEL% EQU 0 goto READY
curl -s http://localhost:8000/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    백엔드 준비 완료 ✓
    timeout /t 5 /nobreak >nul
    goto READY
)
echo    서버 시작 중...
goto WAIT_LOOP

:READY
echo.
echo ✅ 서버 준비 완료!
echo 🌐 브라우저 열기...
echo.

start http://localhost:3000

echo.
echo ╔════════════════════════════════════════╗
echo ║   서버가 실행 중입니다               ║
echo ║   브라우저: http://localhost:3000    ║
echo ║   종료: Ctrl + C                     ║
echo ╚════════════════════════════════════════╝
echo.

docker-compose logs -f
```

5. **Ctrl + S (저장)**

---

## 🚀 **실행 방법:**

**파일 탐색기에서:**
```
C:\Users\user AEA906\Desktop\reseller_code\start.bat