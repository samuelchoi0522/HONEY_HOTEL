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

Rename the .env.example file in the backend and frontend directories to .env, and replace the placeholder values to your environment variables.
You must have the .env file for the app to compile and run.

```sh
DB_USERNAME=database_username
DB_PASSWORD=database_password
EMAIL_USERNAME=gmail_email
EMAIL_PASSWORD=gmail_app_password
```

Initialize your PostgreSQL databse with the following command in the root directory.

```sh
psql -U admin -d honey_hotel_db -f ./init.sql
```

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

### Admin Dashboard Login Information
* **Admin Dashboard URL**: `/admin-dashboard` 
* **Username**: `honeyhotelinfo@gmail.com` 
* **Password**: `honeyhotel123`

### Web Pages

| **Page URL**            | **Page Description**                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------|
| `/`                     | The homepage showcasing Honey Hotel's features and a brief overview.                                 |
| `/find-hive`            | Browse all available rooms, categorized by type and price.                                            |
| `/room-details`         | A detailed page for users to select bed types, smoking status, and price categories for a specific room. |
| `/login`                | Login page for users and admin to access their accounts.                                              |
| `/register`             | Registration page for new users to create an account.                                                 |
| `/forgot-password`      | Page for users to reset their password by entering their email address.                               |
| `/account`              | User account page to view and update personal information, including booking history.                 |
| `/add-vacation-package` | Admin page for adding special vacation packages and promotions to the system.                         |
| `/checkout`             | Checkout page for users to review their booking details and confirm payment.                          |
| `/admin-dashboard`      | Admin dashboard to view, edit, and manage bookings, rooms, and user accounts (restricted access).      |
| `/admin-dashboard/view/:id/:bookingId`      | Page for clerks and administrators to view details on a specific bookingId.      |
| `/admin-dashboard/view/user/:id`      | Page for clerks and administrators to specific details of a user and view reservations associated with the user.      |
| `/invalid-page`             | 404 Page that displays when authorized users try and access /admin-dashboard or try and access unimplemented pages.      |


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
