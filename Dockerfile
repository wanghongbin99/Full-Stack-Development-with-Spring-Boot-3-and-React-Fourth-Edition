# Build frontend
FROM node:20 AS frontend
WORKDIR /app
COPY ./carfront/package*.json ./carfront/
COPY ./carfront ./carfront
WORKDIR /app/carfront
RUN npm install && npm run build

# Build backend
FROM gradle:8.7-jdk21 AS backend
WORKDIR /build
COPY . .
RUN gradle clean build -x test

# Package everything
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend /build/build/libs/*.jar app.jar
COPY --from=frontend /app/carfront/dist ./static
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]