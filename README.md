# HONEY HOTEL

## Group Members

- Samuel Choi
-- Project Manager  
- Eugene Pak
-- Quality Assurance Engineer
- Kirby Dyson
-- Design Engineer
- Candor Miller
-- Requirements Engineer
- Aiden Grajo
-- Project Librarian

## Tech

Honey Hotel uses a number of open-source projects to work properly:

- [React] - Frontend web development
- [Maven] - Java Build tool
- [Spring] - Application Framework
- [JUnit] - Unit testing library
- [Java] - Backend development
- [PostgreSQL] - SQL Database
- [Docker] - Containerization platform

And of course, Honey Hotel is accessible with a [public repository][dill]
 on GitHub.

## Installation

Honey Hotel requires [Java](https://www.java.com/en/) v22, [PostgreSQL](https://www.postgresql.org/) v14, [Maven](https://maven.apache.org/) v3.9, and [Node.js](https://nodejs.org/en) v18.20 to run.

### To run this project using docker:

Ensure that you have docker installed:
```sh
docker -v
```

Once you ensure that you have docker installed:
```sh
cd HONEY_HOTEL
docker-compose up --build
```
Once all dependencies and servers are running, the project should be viewable on localhost:3000.

### To run this project locally:

Install the dependencies and devDependencies and start the server on port :8080.

```sh
cd HONEY_HOTEL
cd backend
mvn clean install
mvn spring-boot:run
```

Install the dependencies and devDependencies and start the client on port :3000.
```sh
cd HONEY_HOTEL
cd frontend
npm install
npm start
```



[//]: #
   [dill]: <https://github.com/samuelchoi0522/HONEY_HOTEL>
   [git-repo-url]: <https://github.com/samuelchoi0522/HONEY_HOTEL.git>
   [React]: <https://react.dev/>
   [Maven]: <https://maven.apache.org/>
   [Spring]: <https://spring.io/>
   [JUnit]: <https://junit.org/junit5/>
   [Java]: <https://www.java.com/en/>
   [PostgreSQL]: <https://www.postgresql.org/>
   [Docker]: <https://www.docker.com/>
