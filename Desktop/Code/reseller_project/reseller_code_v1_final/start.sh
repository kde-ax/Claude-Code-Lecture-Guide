#!/bin/bash

clear

echo ""
echo "╔════════════════════════════════════════╗"
echo "║     리셀러 탐지 AI - 시작 중...      ║"
echo "╚════════════════════════════════════════╝"
echo ""

echo "🐳 Docker 컨테이너 빌드 및 실행 중..."
echo "   (첫 실행은 5~10분 소요)"
echo ""

docker-compose up --build > /dev/null 2>&1 &

echo "💤 서버 준비 대기 중..."
echo ""

# 서버 준비될 때까지 대기
for i in {1..30}
do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 프론트엔드 준비 완료!"
        break
    fi
    
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ 백엔드 준비 완료!"
    fi
    
    echo "   서버 시작 중... ($i/30)"
    sleep 2
done

echo ""
echo "✅ 서버 준비 완료!"
echo "🌐 브라우저 열기..."
echo ""

# 맥에서 브라우저 열기
open http://localhost:3000

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   서버가 실행 중입니다               ║"
echo "║   브라우저: http://localhost:3000    ║"
echo "║   종료: Ctrl + C                     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# 로그 출력
docker-compose logs -f