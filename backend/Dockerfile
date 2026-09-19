# Stage 1: Build stage using Java 21 and Maven Wrapper
FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /app

# Copy Maven wrapper files and pom.xml
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Normalize line endings (CRLF to LF) and grant execute permissions to mvnw
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Copy application source code
COPY src ./src

# Build the application JAR without running tests
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Runtime stage using minimal Java 21 JRE
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Run as non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy the generated Spring Boot JAR from the build stage
COPY --from=builder /app/target/*.jar app.jar

RUN chown -R appuser:appuser /app

USER appuser

# Default port configuration for Render
ENV PORT=10000

EXPOSE 10000

# Listen on 0.0.0.0 and bind to Render's PORT environment variable with 10000 as default
ENTRYPOINT ["sh", "-c", "exec java -Dserver.address=0.0.0.0 -Dserver.port=${PORT:-10000} -jar app.jar"]
