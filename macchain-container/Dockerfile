# Cloudflare Containers용 Spring Boot Dockerfile
FROM --platform=linux/amd64 eclipse-temurin:17-jdk-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# Gradle Wrapper 및 설정 파일 복사
COPY macchain-backend/gradlew .
COPY macchain-backend/gradle gradle
COPY macchain-backend/build.gradle .
COPY macchain-backend/settings.gradle .

# 소스 코드 복사
COPY macchain-backend/src src

# 애플리케이션 빌드 (checkstyle 건너뛰기)
RUN chmod +x gradlew && ./gradlew build -x test -x checkstyleMain -x checkstyleTest

# 런타임 스테이지
FROM --platform=linux/amd64 eclipse-temurin:17-jre-alpine

# 필요한 패키지 설치
RUN apk add --no-cache curl

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/macchain-backend-1.0.0.jar app.jar

# 포트 노출
EXPOSE 8080

# 환경 변수 설정
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SPRING_PROFILES_ACTIVE=cloudflare

# 헬스체크
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# 애플리케이션 실행
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]