FROM openjdk:17-jdk-slim

WORKDIR /app

#COPY src/main/resources/application.yml /app/application.yml
COPY build/libs/*.jar /app/app.jar

COPY build/libs/farmbti-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
