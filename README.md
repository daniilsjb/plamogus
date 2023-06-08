# University Assignment Planner

A small and simple university assignment planner for students! 🎓

![Collection of screenshots from the application.](assets/Thumbnail_Light.png#gh-light-mode-only "Thumbnail")
![Collection of screenshots from the application.](assets/Thumbnail_Dark.png#gh-dark-mode-only "Thumbnail")

## Features

- Full-stack CRUD application.
- RESTful API and PostgreSQL database.
- UI and UX based on Google's [Material Design](https://m3.material.io/)
- Contains charts and calendars.
- Supports dark and light themes.

## Technologies

The backend makes use of the following modules:

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- Spring Boot Validation
- Spring Boot Test
- [Lombok](https://projectlombok.org/)

The frontend makes use of the following modules:

- [React](https://react.dev/)
- [React Router](https://reactrouter.com/en/main)
- [React Query](https://tanstack.com/query/v3/)
- [MUI](https://mui.com/)
- [Recharts](https://recharts.org/en-US/)
- [Formik](https://formik.org/)
- [Yup](https://github.com/jquense/yup)
- [Axios](https://axios-http.com/docs/intro)
- [DayJS](https://day.js.org/)

## Building and Running

If you wish to build and run this project locally, you will need to start up the database, backend, and frontend of the
application yourself. There are several options for achieving this, which are listed below.

### 1. Starting the Database

This project uses PostgreSQL database management system. For local building and development, you have two choices for
starting it up: using Docker or by manually installing and running the DBMS on your machine.

#### Using Docker (Recommended)

If you have [Docker][1] installed, you may simply run the official [`postgres`][2] Docker image in a container. If you
do not have Docker on your system, consider installing [Docker Desktop][3], which provides all necessary software along
with a graphical user interface.

The simplest way to start the database container is via the provided [`docker-compose.yml`](./server/docker-compose.yml)
configuration file. This will take care of pulling the necessary image and setting up the environment variables, exposed
port, etc. Assuming you are in the root of the repository, simply run the following:

```sh
cd server
docker-compose up
```

Alternatively, you may run the Docker container manually using the following command:

```sh
docker run -d \
  --name uap_db \
  -e POSTGRES_DB=uap \
  -e POSTGRES_USER=uap_user \
  -e POSTGRES_PASSWORD=uap_user \
  -p 5432:5432 \
  postgres
```

#### Manually

If for some reason you do not want to use Docker, you may [download the PostgreSQL package][4] and start up the database
server yourself. Keep in mind that the application will try to access the database with the following settings
(applicable to local environments _only_):

| Setting       | Value         |
| ------------- | ------------- |
| Database Name | `uap`         |
| Username      | `uap_user`    |
| Password      | `uap_user`    |
| Host          | `localhost`   |
| Port          | `5432`        |

### 2. Starting the Server

Once you have the database up and running, you may build and start the backend of the application. The project is using
Maven as its build system, but you do not need to have it available on your system - instead, you may use the Maven
Wrapper provided by the Spring Boot project.

#### Using IntelliJ IDEA

If you are using  [IntelliJ IDEA][5] by JetBrains, simply open the `server` project in the IDE and run it. If you do not
have a suitable Java 17 SDK, you may [download one directly from the IDE][6] (such as the Amazon Corretto version of
OpenJDK) and use it within the project. To verify that the server has started correctly, you may try running samples
from the [`examples`](./server/examples/) folder using [IntelliJ's built-in HTTP client][7].

#### Using Terminal

If you prefer building from the command-line, you may use the provided `mvnw` script to build and run the project.
Ensure that the path to your Java 17 SDK is specified in the `JAVA_HOME` environment variable.

If you are on Windows, execute the following commands:

```sh
cd server
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

If you are on Linux or macOS, execute the following commands:

```sh
cd server
./mvnw clean install
./mvnw spring-boot:run
```

At this point, the backend should be up and listening on port `8080`. You may verify this by making a request to any of
its endpoints (such as `GET localhost:8080/api/v1/assignments`), which should return an empty response.

### 3. Starting the Client

Lastly, you may build and run the frontend of the application. It is an [`npm`][8]-based project configured using the
[Create React App][9] tool. Note that you may run the project from IntelliJ IDEA, or start it from the terminal using
the following commands:

```sh
cd client
npm install
npm start
```

At this point, the entire application stack should be up and running. Open up your web browser and navigate to
`localhost:3000/` to try it out!

[1]: https://www.docker.com/
[2]: https://hub.docker.com/_/postgres
[3]: https://www.docker.com/products/docker-desktop/
[4]: https://www.postgresql.org/download/
[5]: https://www.jetbrains.com/idea/
[6]: https://www.jetbrains.com/help/idea/sdk.html#set-up-jdk
[7]: https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html
[8]: https://www.npmjs.com/
[9]: https://create-react-app.dev/
