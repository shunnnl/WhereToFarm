# 1. Node.js 기반의 빌드 환경 설정
FROM node:18 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json과 package-lock.json 복사 후 의존성 설치
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# 4. 소스 코드 복사 후 빌드 실행
COPY . .
RUN npm run build

# Rollup 패키지 강제 설치 (추가)
RUN npm install @rollup/rollup-linux-x64-gnu --legacy-peer-deps

# 5. Nginx를 이용한 정적 파일 서빙
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# 6. Nginx 설정 파일 복사 (Optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# 7. 컨테이너 실행 시 Nginx 시작
CMD ["nginx", "-g", "daemon off;"]

# 8. Nginx 기본 포트 개방
EXPOSE 80
