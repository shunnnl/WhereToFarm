FROM openjdk:17-jdk-slim

WORKDIR /app

COPY src/main/resources/application.yml /app/application.yml

COPY build/libs/*SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
