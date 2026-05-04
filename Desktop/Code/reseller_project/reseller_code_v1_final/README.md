# 리셀러 탐지 AI

## 필수 요구사항
- Docker Desktop 설치
  - Windows: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
  - Mac: [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)

## 빠른 시작

### Windows 사용자
1. `start.bat` 더블클릭
2. 자동으로 Docker 실행 → 브라우저 열림!

### Mac/Linux 사용자
1. 터미널에서 실행 권한 부여 (최초 1회만)
```bash
   chmod +x start.sh
```
2. 실행
```bash
   ./start.sh
```
   또는 `start.sh` 더블클릭

## 수동 실행 (모든 OS)
```bash
docker-compose up --build
```
브라우저에서 http://localhost:3000

## 종료
터미널에서 `Ctrl + C` 또는:
```bash
docker-compose down
```

## 문제 해결

### 포트 충돌
```bash
# docker-compose.yml에서 포트 번호 변경
# 3000 → 3001, 8000 → 8001
```

### 로그 확인
```bash
docker-compose logs -f
```

### 완전 재시작
```bash
docker-compose down -v
docker-compose up --build
```

## 기술 스택
- 프론트엔드: React + Vite + TypeScript
- 백엔드: FastAPI + Python
- 배포: Docker + Docker Compose
```
