# Use an official Java runtime as the base image
FROM openjdk:23-jdk-slim

# Install Maven
RUN apt-get update && \
    apt-get install -y maven && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the Maven project files
COPY pom.xml ./

# Download dependencies to cache them in a separate layer
RUN mvn dependency:go-offline -B

# Copy the rest of the application code
COPY src ./src

# Build the Maven project
RUN mvn clean package -DskipTests

# Expose the port your application runs on
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
