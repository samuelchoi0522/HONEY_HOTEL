# HONEY HOTEL

## Group Members

- Samuel Choi
   - Project Manager  
- Eugene Pak
   - Quality Assurance Engineer
- Kirby Dyson
   - Design Engineer
- Candor Miller
   - Requirements Engineer
- Aiden Grajo
   - Project Librarian

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

### Troubleshooting

#### **Client Issues**

#### 1. **Error**: `sh: react-scripts: command not found`
   - **Cause**: The `react-scripts` package is not installed because `npm install` was not run before `npm start`.
   - **Solution**:
     - Navigate to the `frontend` directory:
       ```sh
       cd HONEY_HOTEL/frontend
       ```
     - Install dependencies:
       ```sh
       npm install
       ```
     - Start the frontend server:
       ```sh
       npm start
       ```


#### **Server Issues**

#### 1. **Error**: `IllegalState Failed to load ApplicationContext`
   - **Cause**: The `.env` file is missing in the `backend` folder directory.
   - **Solution**:
     - Navigate to the `backend` directory:
       ```sh
       cd HONEY_HOTEL/backend
       ```
     - Create a `.env` file and add the required environment variables. Example:
       ```env
       DB_USERNAME=xxxxxxxxxxxx
       DB_PASSWORD=xxxxxxxxxxxx

       EMAIL_USERNAME=xxxxxxxxxxxx@gmail.com
       EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
       ```
     - Restart the server:
       ```sh
       mvn clean install
       mvn spring-boot:run
       ```
#### **2. Error**: `Database connection failed`
- **Cause**: The database credentials in the `.env` file are incorrect or the PostgreSQL server is not running.
- **Solution**:
  - Check the `.env` file in the `backend` directory and ensure the credentials match your database setup. Example:
    ```env
    DB_USERNAME=correct_username
    DB_PASSWORD=correct_password
    ```
  - Ensure the PostgreSQL server is running:
    ```sh
    sudo service postgresql start
    ```



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
| `/invalid-page`             | 404 Page that displays when unauthorized users try and access /admin-dashboard or try and access unimplemented pages.      |




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
