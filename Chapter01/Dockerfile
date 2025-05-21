# Build frontend
FROM node:20 AS frontend
WORKDIR /app
COPY carfront/package*.json ./carfront/
COPY carfront ./carfront
WORKDIR /app/carfront
RUN npm install && npm run build

# Build backend
FROM maven:3.9.6-eclipse-temurin-21 AS backend
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Package everything
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend /build/target/*.jar app.jar
COPY --from=frontend /app/carfront/dist ./static
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]