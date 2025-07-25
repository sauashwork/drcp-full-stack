# Start from an OpenJDK image
FROM openjdk:17-jdk-slim

# Add Maintainer Info
LABEL maintainer="sau-ash"

# Add the JAR file to the container
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Expose port
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java","-jar","/app.jar"]
